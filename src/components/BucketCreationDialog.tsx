import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/ui/icons"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

interface BucketCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateBucket: (amount: bigint) => Promise<void>;
  isLoading: boolean;
}

export function BucketCreationDialog({
  open,
  onOpenChange,
  onCreateBucket,
  isLoading
}: BucketCreationDialogProps) {
  const [amount, setAmount] = useState("5");

  const handleCreate = async () => {
    try {
      const cereAmount = BigInt(parseFloat(amount) * 10000000000);
      await onCreateBucket(cereAmount);
    } catch (error) {
      toast({
        title: "Failed to create bucket",
        description: "Please try again with a valid amount",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Private Bucket</DialogTitle>
          <DialogDescription>
            Enter the amount of CERE you want to deposit for your private bucket.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter CERE amount"
              min="1"
              step="1"
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              Minimum recommended: 5 CERE
            </p>
          </div>
          <Button 
            onClick={handleCreate} 
            disabled={isLoading || !amount}
            className="w-full"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Create Bucket
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 