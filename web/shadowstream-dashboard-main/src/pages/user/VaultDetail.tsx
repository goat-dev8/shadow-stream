import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Vault, 
  Plus, 
  Minus, 
  ExternalLink,
  Zap,
  Shield,
  Store
} from 'lucide-react';
import { mockVaults, mockMerchants, mockTransactions } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function VaultDetail() {
  const { id } = useParams();
  const vault = mockVaults.find(v => v.id === id) || mockVaults[0];
  const vaultTransactions = mockTransactions.filter(tx => tx.vaultId === vault.id);

  const spendPercentage = (vault.todaySpend / vault.dailyLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link 
        to="/app/user/vaults"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Vaults
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <Vault className="w-7 h-7 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{vault.name}</h1>
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium",
                  vault.status === 'active' 
                    ? "bg-accent/20 text-accent" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {vault.status === 'active' ? 'Active' : 'Paused'}
                </span>
              </div>
              <p className="text-muted-foreground">{vault.token} on Polygon</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Deposit
            </Button>
            <Button variant="outline" size="sm">
              <Minus className="w-4 h-4 mr-1" />
              Withdraw
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Balance</p>
            <p className="text-2xl font-bold">${vault.balance.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Daily Limit</p>
            <p className="text-2xl font-bold">${vault.dailyLimit}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <p className="text-sm text-muted-foreground mb-1">Total Calls</p>
            <p className="text-2xl font-bold">{vault.totalCalls.toLocaleString()}</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="merchants">Merchants</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Today's Spend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6"
            >
              <h3 className="font-semibold mb-4">Today's Spend vs Daily Limit</h3>
              <div className="relative pt-4">
                <div className="flex items-end justify-center h-40">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        className="text-muted"
                        strokeWidth="12"
                        stroke="currentColor"
                        fill="transparent"
                        r="58"
                        cx="80"
                        cy="80"
                      />
                      <circle
                        className="text-primary"
                        strokeWidth="12"
                        strokeDasharray={`${spendPercentage * 3.64} 364`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="58"
                        cx="80"
                        cy="80"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold">${vault.todaySpend}</span>
                      <span className="text-sm text-muted-foreground">of ${vault.dailyLimit}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-6"
            >
              <h3 className="font-semibold mb-4">Key Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground">Max per Transaction</span>
                  <span className="font-medium">${vault.maxPerTx}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground">Merchant Restrictions</span>
                  <span className="font-medium">{vault.allowedMerchantsOnly ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-muted-foreground">Agent Restrictions</span>
                  <span className="font-medium">{vault.allowedAgentsOnly ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="rules">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6"
          >
            <h3 className="font-semibold mb-4">Spending Rules</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Max per Transaction</p>
                    <p className="text-sm text-muted-foreground">Maximum amount per single call</p>
                  </div>
                </div>
                <span className="text-lg font-semibold">${vault.maxPerTx}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Daily Limit</p>
                    <p className="text-sm text-muted-foreground">Maximum total spend per day</p>
                  </div>
                </div>
                <span className="text-lg font-semibold">${vault.dailyLimit}</span>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="merchants">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6"
          >
            <h3 className="font-semibold mb-4">Allowed Merchants</h3>
            <div className="space-y-3">
              {mockMerchants.map((merchant) => (
                <div key={merchant.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Store className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{merchant.name}</p>
                      <p className="text-sm text-muted-foreground">{merchant.category}</p>
                    </div>
                  </div>
                  <Switch checked={merchant.allowed} />
                </div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="activity">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6"
          >
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {vaultTransactions.length > 0 ? vaultTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{tx.merchantName}</p>
                      <p className="text-sm text-muted-foreground">{tx.agentName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">-${tx.amount.toFixed(4)}</p>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      tx.status === 'succeeded' && "bg-accent/20 text-accent",
                      tx.status === 'pending' && "bg-yellow-500/20 text-yellow-500",
                      tx.status === 'failed' && "bg-destructive/20 text-destructive"
                    )}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              )) : (
                <p className="text-muted-foreground text-center py-8">No transactions yet</p>
              )}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
