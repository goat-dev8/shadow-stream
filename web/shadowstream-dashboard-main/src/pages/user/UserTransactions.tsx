import { motion } from 'framer-motion';
import { mockTransactions } from '@/lib/mockData';
import { ExternalLink, Zap, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export function UserTransactions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">View all micropayments across your policy vaults.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Time</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Vault</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Merchant</th>
                <th className="text-left text-sm font-medium text-muted-foreground p-4">Agent</th>
                <th className="text-right text-sm font-medium text-muted-foreground p-4">Amount</th>
                <th className="text-center text-sm font-medium text-muted-foreground p-4">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((tx, index) => (
                <motion.tr key={tx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                  <td className="p-4 text-sm">{new Date(tx.timestamp).toLocaleString()}</td>
                  <td className="p-4 text-sm">{tx.vaultName}</td>
                  <td className="p-4"><div className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" />{tx.merchantName}</div></td>
                  <td className="p-4 text-sm text-muted-foreground">{tx.agentName || '-'}</td>
                  <td className="p-4 text-sm text-right font-medium">-${tx.amount.toFixed(4)}</td>
                  <td className="p-4 text-center">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs", tx.status === 'succeeded' && "bg-accent/20 text-accent", tx.status === 'pending' && "bg-yellow-500/20 text-yellow-500", tx.status === 'failed' && "bg-destructive/20 text-destructive")}>{tx.status}</span>
                  </td>
                  <td className="p-4">{tx.txHash && <button className="p-1.5 rounded hover:bg-muted"><ExternalLink className="w-4 h-4 text-muted-foreground" /></button>}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
