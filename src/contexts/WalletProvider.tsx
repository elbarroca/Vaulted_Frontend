import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Enable, web3Accounts, web3FromAddress } from '@polkadot/extension-dapp';
import { InjectedExtension } from '@polkadot/extension-inject/types';
import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import { NETWORKS } from '@/lib/cereNetwork';
import type { AccountData } from '@polkadot/types/interfaces/balances';
import { Web3Signer } from '@cere-ddc-sdk/blockchain';
import { 
  DdcClient, 
  MAINNET, 
  File as DdcFile,
  DagNode,
  DagNodeUri,
  Link,
  BucketId,
  FileUri
} from '@cere-ddc-sdk/ddc-client';
import { v4 as uuidv4 } from 'uuid';
import { FileMetadata } from '@/types';

const CERE = BigInt('10000000000');

declare global {
  interface Window {
    injectedWeb3?: Record<string, any>;
  }
}

export interface ImportedAccount {
  address: string;
  name?: string;
  source: string;
  signer?: any;
}

interface WalletProvider {
  extension: InjectedExtension;
  metadata: {
    icon?: string;
    name: string;
  };
}

interface WalletAccount {
  address: string;
  name?: string;
  source: string;
}

export interface WalletContextInterface {
  connectWallet: () => Promise<{ address: string; network: string }>;
  disconnectWallet: () => Promise<void>;
  getBalance: (address: string) => Promise<string>;
  switchNetwork: (network: string) => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  api: ApiPromise | null;
  activeAccount: string | null;
  activeNetwork: string | null;
  accounts: WalletAccount[];
  web3Signer: Web3Signer | null;
  ddcClient: DdcClient | null;
  uploadFile: (file: File) => Promise<FileMetadata>;
  shareFile: (fileMetadata: FileMetadata) => Promise<string>;
  downloadFile: (fileMetadata: FileMetadata, accessToken: string, signature: string) => Promise<void>;
  readFile: (bucketId: bigint, cid: string) => Promise<string | undefined>;
  readSharedFile: (bucketId: bigint, cid: string, accessToken: string) => Promise<string | undefined>;
  createPrivateBucket: () => Promise<BucketId>;
  myFiles: FileMetadata[];
  isLoading: boolean;
  error: Error | null;
  extensions: any[];
  getWalletExtensions: () => Promise<void>;
  connectWithExtension: (extension: any) => Promise<{ address: string; network: string }>;
  providers: any[];
  getWalletProviders: () => Promise<void>;
  getWalletAccounts: (source: string) => Promise<WalletAccount[]>;
  connectWithAccount: (account: WalletAccount) => Promise<void>;
}

const defaultContext: WalletContextInterface = {
  connectWallet: async () => ({ address: '', network: '' }),
  disconnectWallet: async () => {},
  getBalance: async () => '0',
  switchNetwork: async () => {},
  signMessage: async () => '',
  api: null,
  activeAccount: null,
  activeNetwork: null,
  accounts: [],
  web3Signer: null,
  ddcClient: null,
  uploadFile: async () => ({ id: '', name: '', size: 0, uploadedBy: '', uploadedAt: new Date(), authorizedUsers: [], cid: '', mimeType: '', description: '', folderId: null }),
  shareFile: async () => '',
  downloadFile: async () => {},
  readFile: async () => undefined,
  readSharedFile: async () => undefined,
  createPrivateBucket: async () => BigInt('0'),
  myFiles: [],
  isLoading: false,
  error: null,
  extensions: [],
  getWalletExtensions: async () => {},
  connectWithExtension: async () => ({ address: '', network: '' }),
  providers: [],
  getWalletProviders: async () => {},
  getWalletAccounts: async () => [],
  connectWithAccount: async () => {},
};

const WalletContext = createContext<WalletContextInterface>(defaultContext);

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  const [activeAccount, setActiveAccount] = useState<string | null>(null);
  const [activeNetwork, setActiveNetwork] = useState<string | null>(null);
  const [extensions, setExtensions] = useState<any[]>([]);
  const [web3Signer, setWeb3Signer] = useState<Web3Signer | null>(null);
  const [ddcClient, setDdcClient] = useState<DdcClient | null>(null);
  const [myFiles, setMyFiles] = useState<FileMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [providers, setProviders] = useState<any[]>([]);
  const [availableAccounts, setAvailableAccounts] = useState<WalletAccount[]>([]);

  const accountsRef = useRef(accounts);
  const activeAccountRef = useRef(activeAccount);

  const initializeApi = async (networkKey: string) => {
    const network = NETWORKS[networkKey];
    if (!network) throw new Error('Network not supported');

    try {
      const provider = new WsProvider(network.endpoints.rpc);
      const api = await ApiPromise.create({ provider });
      await api.isReady;
      
      setApi(api);
      setActiveNetwork(networkKey);
      return api;
    } catch (error) {
      console.error('Failed to connect to network:', error);
      throw error;
    }
  };

  const initializeDdcClient = async (signer: Web3Signer) => {
    try {
      const client = await DdcClient.create(signer, MAINNET);
      await client.connect();
      return client;
    } catch (error) {
      console.error('Failed to initialize DDC client:', error);
      throw error;
    }
  };

  const getWalletExtensions = useCallback(async () => {
    try {
      console.log('Injected extensions:', window.injectedWeb3);

      const injectedExtensions = await web3Enable('Vaulted');
      if (!injectedExtensions.length) {
        throw new Error('No extension found');
      }

      const extensionsWithMetadata = await Promise.all(
        injectedExtensions.map(async (extension) => {
          const metadata = await extension.metadata?.get() || {} as any;
          return {
            extension,
            metadata: {
              icon: metadata.icon,
              name: metadata.name || extension.name
            }
          };
        })
      );

      setExtensions(extensionsWithMetadata);
    } catch (error) {
      console.error('Failed to get wallet extensions:', error);
      throw error;
    }
  }, []);

  const connectWithExtension = useCallback(async (extension: InjectedExtension) => {
    try {
      const allAccounts = await web3Accounts();
      const formattedAccounts: WalletAccount[] = allAccounts.map(account => ({
        address: account.address,
        name: account.meta.name || undefined,
        source: account.meta.source || 'unknown',
        signer: account.meta.source
      }));
  
      setAccounts(formattedAccounts);
      accountsRef.current = formattedAccounts;
  
      const network = 'cereMainnet';
      const accountToUse = formattedAccounts[0]?.address;
  
      if (accountToUse) {
        setActiveAccount(accountToUse);
        activeAccountRef.current = accountToUse;

        if (extension.signer) {
          const signerInstance = new Web3Signer();
          await signerInstance.connect();
          setWeb3Signer(signerInstance);

          try {
            const client = await initializeDdcClient(signerInstance);
            setDdcClient(client);
          } catch (error) {
            console.error('DDC client initialization failed:', error);
          }
        }
      }
  
      if (!api) {
        await initializeApi('cereMainnet');
      }
  
      return {
        address: accountToUse || '',
        network: network
      };
    } catch (error) {
      console.error('Failed to connect with extension:', error);
      throw error;
    }
  }, [api, initializeDdcClient]);

  const connectWallet = useCallback(async () => {
    // If only one extension, use it directly
    if (extensions.length === 1) {
      return connectWithExtension(extensions[0].extension as any);
    }
    // Otherwise, let the UI handle extension selection
    throw new Error('Please select a wallet extension');
  }, [getWalletExtensions, connectWithExtension]);

  const disconnectWallet = useCallback(async () => {
    if (api) {
      await api.disconnect();
    }
    if (ddcClient) {
      await ddcClient.disconnect();
    }
    setActiveAccount(null);
    setAccounts([]);
    setExtensions([]);
    setWeb3Signer(null);
    setDdcClient(null);
  }, [api, ddcClient]);

  const switchNetwork = useCallback(async (networkKey: string) => {
    if (api) {
      await api.disconnect();
    }
    await initializeApi(networkKey);
  }, [api]);

  const getBalance = useCallback(async (address: string): Promise<string> => {
    if (!api) throw new Error('API not initialized');
    
    try {
        const result = await api.query.system.account(address);
        const accountInfo = result as unknown as { data: AccountData };
        return accountInfo.data.free.toString();
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      throw new Error('Failed to fetch balance');
    }
  }, [api]);

  const signMessage = useCallback(async (message: string) => {
    if (!activeAccount || !web3Signer) {
      throw new Error('No active account or Web3Signer available');
    }

    const signature = await web3Signer.sign(message); // Use the Web3Signer instance

    return signature.toString();
  }, [activeAccount, web3Signer]);

  // Storage Methods
  const createPrivateBucket = async () => {
    if (!ddcClient) throw new Error('DDC client not initialized');
    setIsLoading(true);
    try {
      const deposit = await ddcClient.getDeposit();
      if (deposit === BigInt('0')) {
        await ddcClient.depositBalance(BigInt('5') * CERE);
      }

      const bucketId = await ddcClient.createBucket('0x0059f5ada35eee46802d80750d5ca4a490640511', { 
        isPublic: false 
      });

      return bucketId;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    if (!ddcClient) throw new Error('DDC client not initialized');
    setIsLoading(true);

    try {
      let bucketId = localStorage.getItem('userBucketId');
      if (!bucketId) {
        const privateBucket = await createPrivateBucket();
        bucketId = privateBucket.toString();
        localStorage.setItem('userBucketId', bucketId);
      }

      const fileBuffer = await file.arrayBuffer();
      const data = new Uint8Array(fileBuffer);
      const ddcFile = new DdcFile(data, { size: data.length });
      const bucketIdBigInt = BigInt(bucketId);
      const uploadedFileUri = await ddcClient.store(bucketIdBigInt, ddcFile);

      const fileMetadata: FileMetadata = {
        id: uuidv4(),
        name: file.name,
        size: file.size,
        uploadedBy: activeAccount || '',
        uploadedAt: new Date(),
        authorizedUsers: [activeAccount || ''],
        cid: uploadedFileUri.cid,
        mimeType: file.type || 'application/octet-stream',
        description: '',
        folderId: null
      };

      // Index the file
      const filePathInDeveloperConsole = `uploads/${fileMetadata.name}/`;
      const rootDagNode = await ddcClient.read(
        new DagNodeUri(BigInt(bucketId), 'fs'), 
        { cacheControl: 'no-cache' }
      ).catch((res) => {
        if (res.message === 'Cannot resolve CNS name: "fs"') {
          return new DagNode(null);
        }
        throw new Error("Failed to fetch 'fs' DAG node");
      });

      if (!rootDagNode) {
        throw new Error("DAG node initialization failed");
      }

      rootDagNode.links.push(
        new Link(uploadedFileUri.cid, file.size, filePathInDeveloperConsole + fileMetadata.name)
      );

      await ddcClient.store(BigInt(bucketId), rootDagNode, { name: 'fs' });
      setMyFiles(prev => [...prev, fileMetadata]);

      return fileMetadata;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Upload failed');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const shareFile = useCallback(async (fileMetadata: FileMetadata) => {
    if (!ddcClient || !web3Signer) throw new Error('DDC client or signer not initialized');
    setIsLoading(true);

    try {
      const bucketId = localStorage.getItem('userBucketId');
      if (!bucketId) throw new Error('Bucket ID not found');

      // Create a temporary URL for file sharing
      const url = `https://cdn.testnet.cere.network/${bucketId}/${fileMetadata.cid}`;
      
      // Sign the URL to create an access token
      const message = `Access request for file: ${fileMetadata.cid}`;
      const signature = await web3Signer.sign(message);
      
      // Return signed URL
      return `${url}?signature=${signature}`;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Share failed');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [ddcClient, web3Signer]);

  const downloadFile = useCallback(async (
    fileMetadata: FileMetadata,
    accessToken: string,
    signature: string
  ) => {
    if (!ddcClient) throw new Error('DDC client not initialized');
    setIsLoading(true);

    try {
      const bucketId = localStorage.getItem('userBucketId');
      if (!bucketId) throw new Error('Bucket ID not found');

      // Construct download URL with authentication
      const url = `https://cdn.testnet.cere.network/${bucketId}/${fileMetadata.cid}?token=${accessToken}&signature=${signature}`;
      
      // Fetch the file
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to download file');
      
      const blob = await response.blob();
      
      // Create download link
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileMetadata.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Download failed');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [ddcClient]);

  const readFile = useCallback(async (bucketId: bigint, cid: string) => {
    if (!ddcClient) throw new Error('DDC client not initialized');
    setIsLoading(true);
    setError(null);

    try {
      const fileUri = new FileUri(bucketId, cid);
      const fileResponse = await ddcClient.read(fileUri);
    
      // Create a Blob from the text response
      const text = await fileResponse.text();
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);

      console.log('File read successfully:', url);
      return url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to read file';
      const error = new Error(errorMessage);
      setError(error);
      console.error('Error reading file:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [ddcClient]);

  const readSharedFile = useCallback(async (
    bucketId: bigint,
    cid: string,
    accessToken: string
  ) => {
    if (!ddcClient) throw new Error('DDC client not initialized');
    setIsLoading(true);
    setError(null);

    return 'not implemented';
    /*try {
      const fileUri = new FileUri(bucketId, cid);
      const fileResponse = await ddcClient.read(fileUri, accessToken);

      const blob = await fileResponse.blob();
      const url = URL.createObjectURL(blob);

      console.log('File read successfully:', url);
      return url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to read shared file';
      const error = new Error(errorMessage);
      setError(error);
      console.error('Error reading file:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }*/
  }, [ddcClient]);

  const getWalletProviders = useCallback(async () => {
    try {
      console.log(window.injectedWeb3);
      // First enable web3
      await web3Enable('Vaulted');
      
      // Then get accounts
      const allAccounts = await web3Accounts();
      const accountsBySource = allAccounts.reduce((acc, account) => {
        const source = account.meta.source;
        if (!acc[source]) {
          acc[source] = {
            accounts: [],
            name: source,
            icon: undefined
          };
        }
        acc[source].accounts.push(account);
        return acc;
      }, {} as any);

      const providers = Object.entries(accountsBySource).map(([source, data]) => ({
        source,
        metadata: {
          // @ts-ignore 
          name: data.name,
          // @ts-ignore
          icon: data.icon
        },
        // @ts-ignore
        accounts: data.accounts
      }));

      setProviders(providers);
    } catch (error) {
      console.error('Failed to get wallet providers:', error);
      throw error;
    }
  }, []);

  const getWalletAccounts = useCallback(async (source: string) => {
    try {
      const accounts = await web3Accounts({ extensions: [source] });
      const formattedAccounts = accounts.map(acc => ({
        address: acc.address,
        name: acc.meta.name,
        source: acc.meta.source
      }));
      setAvailableAccounts(formattedAccounts);
      return formattedAccounts;
    } catch (error) {
      console.error('Failed to get accounts:', error);
      throw error;
    }
  }, []);

  const connectWithAccount = useCallback(async (account: any) => {
    try {
      const extension = await web3FromAddress(account.address);
      if (extension) {
        setActiveAccount(account.address);
        // Initialize signer and client here
        const signerInstance = new Web3Signer();
        await signerInstance.connect();
        setWeb3Signer(signerInstance);

        try {
          const client = await initializeDdcClient(signerInstance);
          setDdcClient(client);
        } catch (error) {
          console.error('DDC client initialization failed:', error);
        }
      }
    } catch (error) {
      console.error('Failed to connect account:', error);
      throw error;
    }
  }, [initializeDdcClient]);

  return (
    <WalletContext.Provider
      value={{
        connectWallet,
        disconnectWallet,
        getBalance,
        switchNetwork,
        signMessage,
        api,
        activeAccount,
        activeNetwork,
        accounts,
        web3Signer,
        ddcClient,
        uploadFile,
        shareFile,
        downloadFile,
        readFile,
        readSharedFile,
        createPrivateBucket,
        myFiles,
        isLoading,
        error,
        extensions,
        getWalletExtensions,
        connectWithExtension,
        providers,
        getWalletProviders,
        getWalletAccounts,
        connectWithAccount,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};