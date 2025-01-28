import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import { Icons } from "@/components/ui/icons"

interface WalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providers: any[];
  onSelectAccount: (account: any) => void;
  selectedProvider?: string;
  onSelectProvider: (source: string) => void;
  isLoading: boolean;
}

export function WalletDialog({
  open,
  onOpenChange,
  providers,
  onSelectAccount,
  selectedProvider,
  onSelectProvider,
  isLoading
}: WalletDialogProps) {
  const selectedProviderData = providers.find(p => p.source === selectedProvider);

  return (
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
                onClick={() => onSelectProvider(provider.source)}
                disabled={isLoading}
              >
                {provider.metadata.icon ? (
                  <img 
                    src={provider.metadata.icon} 
                    alt={provider.metadata.name} 
                    className="w-6 h-6"
                  />
                ) : (
                  <Icons.wallet className="w-6 h-6" />
                )}
                <span className="flex-1">{provider.metadata.name}</span>
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
                onClick={() => onSelectAccount(account)}
                disabled={isLoading}
              >
                <Icons.user className="w-6 h-6" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{account.meta.name || 'Account'}</span>
                  <span className="text-xs text-muted-foreground">
                    {account.address}
                  </span>
                </div>
              </Button>
            ))
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
} 