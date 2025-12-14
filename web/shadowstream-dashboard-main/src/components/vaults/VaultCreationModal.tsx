import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Check, ChevronLeft, ChevronRight, Vault, Coins, Shield, FileCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreateVault } from '@/hooks/useApi';
import { useWallet } from '@/hooks/useWallet';
import { TOKENS } from '@/lib/tokens';
import { toast } from 'sonner';

interface VaultCreationModalProps {
  open: boolean;
  onClose: () => void;
}

const steps = [
  { id: 1, title: 'Basics', icon: Vault },
  { id: 2, title: 'Token & Deposit', icon: Coins },
  { id: 3, title: 'Spending Rules', icon: Shield },
  { id: 4, title: 'Review', icon: FileCheck },
];

const availableTokens = [
  { id: TOKENS.USDC.address, name: TOKENS.USDC.name, symbol: TOKENS.USDC.symbol },
  { id: TOKENS.USDT.address, name: TOKENS.USDT.name, symbol: TOKENS.USDT.symbol },
];

export function VaultCreationModal({ open, onClose }: VaultCreationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const { address } = useWallet();
  const { mutateAsync: createVault, isPending } = useCreateVault();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tokenAddress: TOKENS.USDC.address as string,
    depositAmount: '',
    maxPerTx: '',
    dailyLimit: '',
    allowedMerchantsOnly: false,
    allowedAgentsOnly: false,
  });

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleCreate = async () => {
    if (!address) {
      toast.error("Wallet not connected");
      return;
    }

    try {
      await createVault({
        userAddress: address,
        tokenAddress: formData.tokenAddress,
        maxPerTx: formData.maxPerTx,
        dailyLimit: formData.dailyLimit,
      });

      toast.success("Vault created successfully!");
      onClose();
      setCurrentStep(1);
      setFormData({
        name: '',
        description: '',
        tokenAddress: TOKENS.USDC.address,
        depositAmount: '',
        maxPerTx: '',
        dailyLimit: '',
        allowedMerchantsOnly: false,
        allowedAgentsOnly: false,
      });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to create vault");
    }
  };

  const selectedToken = availableTokens.find(t => t.id === formData.tokenAddress);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Policy Vault</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 px-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  currentStep >= step.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}>
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={cn(
                  "text-xs mt-2 hidden sm:block",
                  currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-12 sm:w-20 h-0.5 mx-2",
                  currentStep > step.id ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="min-h-[280px]"
          >
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Vault Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Research Bot Budget"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="What will this vault be used for?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1.5 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label>Select Token</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {availableTokens.map((token) => (
                      <button
                        key={token.id}
                        onClick={() => setFormData({ ...formData, tokenAddress: token.id })}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all text-center",
                          formData.tokenAddress === token.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <p className="font-semibold">{token.symbol}</p>
                        <p className="text-xs text-muted-foreground">{token.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="deposit">Initial Deposit Amount (Mocked for now)</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="deposit"
                      type="number"
                      placeholder="0.00"
                      value={formData.depositAmount}
                      onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                      className="pr-16"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {selectedToken?.symbol}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Note: Actual deposit requires token approval. Backend deployment will handle initial setup.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxPerTx">Max per Transaction</Label>
                    <div className="relative mt-1.5">
                      <Input
                        id="maxPerTx"
                        type="number"
                        placeholder="5.00"
                        value={formData.maxPerTx}
                        onChange={(e) => setFormData({ ...formData, maxPerTx: e.target.value })}
                        className="pr-16"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        {selectedToken?.symbol}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="dailyLimit">Daily Limit</Label>
                    <div className="relative mt-1.5">
                      <Input
                        id="dailyLimit"
                        type="number"
                        placeholder="100.00"
                        value={formData.dailyLimit}
                        onChange={(e) => setFormData({ ...formData, dailyLimit: e.target.value })}
                        className="pr-16"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        {selectedToken?.symbol}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div>
                      <p className="font-medium">Only approved merchants</p>
                      <p className="text-sm text-muted-foreground">Restrict spending to whitelisted merchants</p>
                    </div>
                    <Switch
                      checked={formData.allowedMerchantsOnly}
                      onCheckedChange={(checked) => setFormData({ ...formData, allowedMerchantsOnly: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div>
                      <p className="font-medium">Only approved agents</p>
                      <p className="text-sm text-muted-foreground">Restrict spending to specific agents</p>
                    </div>
                    <Switch
                      checked={formData.allowedAgentsOnly}
                      onCheckedChange={(checked) => setFormData({ ...formData, allowedAgentsOnly: checked })}
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <h3 className="font-semibold mb-3">Vault Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span>{formData.name || 'Untitled Vault'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Token</span>
                      <span>{selectedToken?.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Initial Deposit</span>
                      <span>{formData.depositAmount || '0'} {selectedToken?.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max per Transaction</span>
                      <span>{formData.maxPerTx || '0'} {selectedToken?.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Daily Limit</span>
                      <span>{formData.dailyLimit || '0'} {selectedToken?.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Merchant Restriction</span>
                      <span>{formData.allowedMerchantsOnly ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Agent Restriction</span>
                      <span>{formData.allowedAgentsOnly ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  By creating this vault, you agree to deposit funds into a smart contract on Polygon according to our terms.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1 || isPending}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          {currentStep < 4 ? (
            <Button onClick={handleNext} variant="default" disabled={isPending}>
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleCreate} variant="hero" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Policy Vault'
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
