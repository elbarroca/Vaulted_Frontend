import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { InjectedExtension } from '@polkadot/extension-inject/types';
import React, { createContext, useContext, useState, useCallback } from 'react';
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
import { getAdapter } from "@/misc/nightly";
import { toast } from "@/hooks/use-toast";

const CERE = BigInt('10000000000');

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
  connectAccount: (account: WalletAccount) => Promise<void>;
  disconnectAccount: () => Promise<void>;
  getAccountBalance: (address: string) => Promise<string>;
  switchNetwork: (network: string) => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  activeAccount: string | null;
  activeNetwork: string | null;
  createPrivateBucket: () => Promise<BucketId>;
  uploadFile: (file: File) => Promise<FileMetadata>;
  shareFile: (fileMetadata: FileMetadata) => Promise<string>;
  downloadFile: (fileMetadata: FileMetadata, accessToken: string, signature: string) => Promise<void>;
  readFile: (bucketId: bigint, cid: string) => Promise<string | undefined>;
  readSharedFile: (bucketId: bigint, cid: string, accessToken: string) => Promise<string | undefined>;
  files: FileMetadata[];
  isLoading: boolean;
  error: Error | null;
}

const defaultContext: WalletContextInterface = {
  connectAccount: async () => {},
  disconnectAccount: async () => {},
  getAccountBalance: async () => '0',
  switchNetwork: async () => {},
  signMessage: async () => '',
  activeAccount: null,
  activeNetwork: null,
  uploadFile: async () => ({ id: '', name: '', size: 0, uploadedBy: '', uploadedAt: new Date(), authorizedUsers: [], cid: '', mimeType: '', description: '', folderId: null }),
  shareFile: async () => '',
  downloadFile: async () => {},
  readFile: async () => undefined,
  readSharedFile: async () => undefined,
  createPrivateBucket: async () => BigInt('0'),
  files: [],
  isLoading: false,
  error: null,
};

const WalletContext = createContext<WalletContextInterface>(defaultContext);

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [ddcClient, setDdcClient] = useState<DdcClient | null>(null);

  const [activeAccount, setActiveAccount] = useState<string | null>(null);
  const [activeNetwork, setActiveNetwork] = useState<string | null>(null);
  const [web3Signer, setWeb3Signer] = useState<Web3Signer | null>(null);

  const [files, setFiles] = useState<FileMetadata[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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

  const connectAccount = useCallback(async (account: any) => {
    try {
      let extension;
      if (account.meta.source === 'nightly') {
        const nightlyAdapter = await getAdapter();
        extension = {
          signer: nightlyAdapter.signer
        };
      } else {
        extension = await web3FromAddress(account.address);
      }

      if (extension) {
        setActiveAccount(account.address);
        const signerInstance = new Web3Signer();
        await signerInstance.connect();
        setWeb3Signer(signerInstance);

        if (!api) {
          await initializeApi('cereMainnet');
        }

        try {
          const client = await initializeDdcClient(signerInstance);
          setDdcClient(client);
        } catch (error) {
          console.error('DDC client initialization failed:', error);
          toast({
            title: 'Failed to initialize DDC client',
            description: 'An error occurred while initializing the DDC client',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Failed to connect account:', error);
      toast({
        title: 'Failed to connect account',
        description: 'An error occurred while connecting to the account',
        variant: 'destructive',
      });
      throw error;
    }
  }, [initializeDdcClient]);

  const disconnectAccount = useCallback(async () => {
    if (api) {
      await api.disconnect();
    }
    if (ddcClient) {
      await ddcClient.disconnect();
    }
    setActiveAccount(null);
    setWeb3Signer(null);
    setDdcClient(null);
  }, [api, ddcClient]);

  const switchNetwork = useCallback(async (networkKey: string) => {
    if (api) {
      await api.disconnect();
    }
    await initializeApi(networkKey);
  }, [api]);

  const getAccountBalance = useCallback(async (address: string): Promise<string> => {
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
      setFiles(prev => [...prev, fileMetadata]);

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

  return (
    <WalletContext.Provider
      value={{
        connectAccount,
        disconnectAccount,
        getAccountBalance,
        switchNetwork,
        signMessage,
        activeAccount,
        activeNetwork,
        uploadFile,
        shareFile,
        downloadFile,
        readFile,
        readSharedFile,
        createPrivateBucket,
        files,
        isLoading,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};