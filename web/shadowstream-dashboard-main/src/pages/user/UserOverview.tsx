import { motion } from 'framer-motion';
import {
  TrendingUp,
  Vault,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Wallet
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { useUserAnalytics } from '@/hooks/useApi';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';

export function UserOverview() {
  // Fix applied: Casting analytics data to Number ensures safety against string responses
  const { address, isConnected, connect } = useWallet();
  const { data, isLoading } = useUserAnalytics(address);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
          <Wallet className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
          <p className="text-muted-foreground">
            Connect your wallet to view your spending analytics and activity.
          </p>
        </div>
        <Button onClick={() => connect()} variant="hero" size="lg">
          Connect Wallet
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 w-48 bg-muted/50 rounded-xl" />
        <div className="grid sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted/50 rounded-xl" />)}
        </div>
        <div className="h-[300px] bg-muted/50 rounded-xl" />
      </div>
    );
  }

  const stats = data ? [
    {
      label: 'Total Spend (30d)',
      value: `$${Number(data.totalSpend30d).toFixed(2)}`,
      change: '+0%', // Placeholder for now or calculate from historical
      positive: false,
      icon: TrendingUp,
    },
    {
      label: 'Active Policy Vaults',
      value: (data.activeVaults || 0).toString(),
      change: '0',
      positive: true,
      icon: Vault,
    },
    {
      label: 'Avg Spend per Day',
      value: `$${Number(data.avgSpendPerDay || 0).toFixed(2)}`,
      change: '0%',
      positive: true,
      icon: Calendar,
    },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-muted-foreground">Monitor your spending and policy vault activity.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
            </div>
            {/* 
            <div className={cn(
              "flex items-center gap-1 mt-3 text-sm",
              stat.positive ? "text-accent" : "text-destructive"
            )}>
              {stat.positive ? (
                <ArrowDownRight className="w-4 h-4" />
              ) : (
                <ArrowUpRight className="w-4 h-4" />
              )}
              <span>{stat.change} from last month</span>
            </div> 
            */}
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Daily Spend vs Limit</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.dailySeries || []}>
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(263 70% 58%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(263 70% 58%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="limitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199 89% 60%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(199 89% 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 15%)" />
              <XAxis dataKey="date" stroke="hsl(218 11% 65%)" fontSize={12} />
              <YAxis stroke="hsl(218 11% 65%)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(222 47% 6%)',
                  border: '1px solid hsl(222 30% 15%)',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey="limit"
                stroke="hsl(199 89% 60%)"
                fillOpacity={1}
                fill="url(#limitGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="spend"
                stroke="hsl(263 70% 58%)"
                fillOpacity={1}
                fill="url(#spendGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Merchants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Top Merchants by Spend</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-sm text-muted-foreground font-medium pb-3">Merchant</th>
                  <th className="text-left text-sm text-muted-foreground font-medium pb-3">Category</th>
                  <th className="text-right text-sm text-muted-foreground font-medium pb-3">Total Spend</th>
                  <th className="text-right text-sm text-muted-foreground font-medium pb-3">Calls</th>
                </tr>
              </thead>
              <tbody>
                {data?.topMerchants?.map((merchant: any, index: number) => (
                  <tr key={index} className="border-b border-border/50 last:border-0">
                    <td className="py-3 font-medium">{merchant.name}</td>
                    <td className="py-3 text-muted-foreground">{merchant.category || 'API'}</td>
                    <td className="py-3 text-right">${Number(merchant.spend).toFixed(2)}</td>
                    <td className="py-3 text-right text-muted-foreground">{merchant.calls}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Recent Micropayments</h2>
          <div className="space-y-3">
            {data?.recentTransactions?.slice(0, 5).map((tx: any) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {tx.agentName} → {tx.merchantName}
                    </p>
                    <p className="text-xs text-muted-foreground">{tx.vaultName || tx.vaultAddress.slice(0, 8)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">-${parseFloat(tx.amount).toFixed(4)}</p>
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
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
