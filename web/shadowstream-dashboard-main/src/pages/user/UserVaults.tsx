import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, Vault, Pause, Play, Eye, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { VaultCreationModal } from '@/components/vaults/VaultCreationModal';
import { useUserVaults } from '@/hooks/useApi';
import { useWallet } from '@/hooks/useWallet';

export function UserVaults() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { address, isConnected, connect } = useWallet();
  const { data, isLoading } = useUserVaults(address);

  const vaults = data?.vaults || [];

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
          <Wallet className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
          <p className="text-muted-foreground">
            Connect your wallet to view and manage your policy vaults.
          </p>
        </div>
        <Button onClick={() => connect()} variant="hero" size="lg">
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Policy Vaults</h1>
          <p className="text-muted-foreground">Manage your stablecoin vaults with spending rules.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} variant="hero">
          <Plus className="w-4 h-4" />
          Create Policy Vault
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-xl bg-muted/50 animate-pulse" />
          ))}
        </div>
      )}

      {/* Vaults Grid */}
      {!isLoading && vaults.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vaults.map((vault, index) => (
            <motion.div
              key={vault.address}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl p-5 group hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Vault className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm font-mono truncate w-24" title={vault.address}>
                      {vault.address.slice(0, 6)}...{vault.address.slice(-4)}
                    </h3>
                    <p className="text-sm text-muted-foreground">{vault.tokenSymbol}</p>
                  </div>
                </div>
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent"
                )}>
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Balance</p>
                  <p className="text-lg font-semibold truncate" title={vault.balance}>
                    {parseFloat(vault.balance).toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Daily Limit</p>
                  <p className="text-lg font-semibold truncate" title={vault.dailyLimit}>
                    {parseFloat(vault.dailyLimit).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  Max per tx: {parseFloat(vault.maxPerTx).toFixed(2)}
                </p>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/app/user/vaults/${vault.address}`}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-12 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Vault className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No policy vaults yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first policy vault to start making secure, policy-limited micropayments with your AI agents.
            </p>
            <Button onClick={() => setShowCreateModal(true)} variant="hero">
              <Plus className="w-4 h-4" />
              Create Your First Vault
            </Button>
          </motion.div>
        )
      )}

      {/* Creation Modal */}
      <VaultCreationModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
