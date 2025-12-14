import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { mockPayouts } from '@/lib/mockData';
import { Banknote, ExternalLink } from 'lucide-react';

export function MerchantPayouts() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 className="text-2xl font-bold">Payouts</h1><p className="text-muted-foreground">Manage your on-chain payouts.</p></div><Button variant="neon"><Banknote className="w-4 h-4" />Request Payout</Button></div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6"><h3 className="font-semibold mb-4">Pending Balance</h3><p className="text-4xl font-bold text-secondary">$127.35 <span className="text-lg text-muted-foreground font-normal">USDC</span></p></motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-6"><h3 className="font-semibold mb-4">Payout History</h3><div className="space-y-3">{mockPayouts.map(p => (<div key={p.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50"><div><p className="font-medium">${p.amount.toFixed(2)} {p.token}</p><p className="text-sm text-muted-foreground">{new Date(p.timestamp).toLocaleDateString()}</p></div><div className="flex items-center gap-2"><span className="px-2 py-0.5 rounded-full text-xs bg-accent/20 text-accent">{p.status}</span><button className="p-1.5 rounded hover:bg-muted"><ExternalLink className="w-4 h-4 text-muted-foreground" /></button></div></div>))}</div></motion.div>
    </div>
  );
}
