import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { Icons } from "@/components/ui/icons"
import { useEffect, useState } from "react"
import { useWallet } from "@/contexts/WalletProvider"
import { useNavigate } from "react-router-dom"
import { web3Enable, web3Accounts } from '@polkadot/extension-dapp'
import { getAdapter } from "@/misc/nightly"
import { toast } from "@/hooks/use-toast"

interface WalletProvider {
  name: string;
  icon?: string;
  accounts: InjectedAccountWithMeta[];
  source: string;
}

export interface WalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
}

export function WalletDialog({
  open,
  onOpenChange,
  isLoading: externalIsLoading,
}: WalletDialogProps) {
  const { activeAccount, connectAccount } = useWallet()
  const [providers, setProviders] = useState<WalletProvider[]>([])
  const [selectedProvider, setSelectedProvider] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const loading = isLoading || externalIsLoading

  const initializeWallets = async () => {
    try {
      setIsLoading(true)
      
    // Initialize Nightly Connect
    const nightlyAdapter = await getAdapter();
    let nightlyAccounts: InjectedAccountWithMeta[] = [];
      // Initialize PolkadotJS extension
      await web3Enable('Vaulted');
      const accounts = await web3Accounts();
      
      const polkadotProvider: WalletProvider = {
        name: 'PolkadotJS',
        icon: '/polkadot-icon.png', // Add your icon path
        accounts,
        source: 'polkadot'
      };


      
      if (await nightlyAdapter.canEagerConnect()) {
        try {
          await nightlyAdapter.connect();
          const publicKeys = await nightlyAdapter.accounts.get();
          nightlyAccounts = publicKeys.map(key => ({
            address: key.address,
            meta: {
              name: 'Nightly Account',
              source: 'nightly'
            },
            type: 'sr25519'
          }));
        } catch (error) {
          console.error('Nightly connection error:', error);
          await nightlyAdapter.disconnect().catch(() => {});
        }
      }

      const nightlyProvider: WalletProvider = {
        name: 'Nightly',
        icon: 'https://docs.nightly.app/img/logo.png',
        accounts: nightlyAccounts,
        source: 'nightly'
      };

      setProviders([polkadotProvider, nightlyProvider].filter(p => p.accounts.length > 0));
    } catch (error) {
      console.error('Failed to initialize wallets:', error);
      toast({
        title: 'Failed to initialize wallets',
        description: 'An error occurred while initializing wallets',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletConnect = async () => {
    try {
      setIsLoading(true);
      await initializeWallets();
      onOpenChange(true);
    } catch (error) {
      console.error('Failed to get wallet providers:', error);
      toast({
        title: 'Failed to connect wallet',
        description: 'An error occurred while connecting to the wallet',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProvider = (source: string) => {
    setSelectedProvider(source);
  };

  const handleSelectAccount = async (account: InjectedAccountWithMeta) => {
    try {
      setIsLoading(true);
      
      if (account.meta.source === 'nightly') {
        const adapter = await getAdapter();
        await adapter.connect();
      }
      
      await connectAccount(account as any);
      onOpenChange(false);
      navigate("/dashboard");
      toast({
        title: 'Wallet connected successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Failed to connect account:', error);
      toast({
        title: 'Failed to connect account',
        description: 'An error occurred while connecting to the account',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeAccount) {
      navigate("/dashboard");
    }
  }, [activeAccount, navigate]);

  const selectedProviderData = providers.find(p => p.source === selectedProvider);

  return (
    <>
      <Button 
        variant="outline" 
        disabled={loading} 
        onClick={handleWalletConnect}
        className="w-full gap-2 relative group bg-background hover:bg-accent border-input hover:border-accent h-12"
      >
        <span role="img" aria-label="wallet" className="text-xl relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
          👤
        </span>
        <span className="font-medium relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-400">
          {loading ? "Connecting..." : "Connect Wallet"}
        </span>
        {!loading && (
          <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <Icons.arrowRight className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          </div>
        )}
        {loading && <Icons.spinner className="absolute right-4 h-4 w-4 animate-spin" />}
      </Button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedProvider ? 'Select Account' : 'Select Wallet'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {!selectedProvider ? (
              providers.map((provider) => (
                <Button
                  key={provider.source}
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => handleSelectProvider(provider.source)}
                  disabled={loading}
                >
                  {provider.icon ? (
                    <img 
                      src={provider.icon} 
                      alt={provider.name} 
                      className="w-6 h-6"
                    />
                  ) : (
                    <Icons.wallet className="w-6 h-6" />
                  )}
                  <span className="flex-1">{provider.name}</span>
                  <span className="text-muted-foreground">
                    ({provider.accounts.length})
                  </span>
                </Button>
              ))
            ) : selectedProviderData ? (
              selectedProviderData.accounts.map((account: InjectedAccountWithMeta) => (
                <Button
                  key={account.address}
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => handleSelectAccount(account)}
                  disabled={loading}
                >
                  <Icons.user className="w-6 h-6" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{account.meta.name || 'Account'}</span>
                    <span className="text-xs text-muted-foreground">
                      {account.address.slice(0, 15) + '...' + account.address.slice(-15)}
                    </span>
                  </div>
                </Button>
              ))
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 