import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, FileCode2, ExternalLink } from 'lucide-react';
import { mockMerchantAPIs } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export function MerchantAPIs() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">API Products</h1><p className="text-muted-foreground">Manage your x402-enabled API endpoints.</p></div>
        <Button variant="neon"><Plus className="w-4 h-4" />Register API Endpoint</Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {mockMerchantAPIs.map((api, index) => (
          <motion.div key={api.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="glass rounded-xl p-5 hover:border-secondary/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center"><FileCode2 className="w-5 h-5 text-secondary" /></div><div><h3 className="font-semibold">{api.name}</h3><p className="text-sm text-muted-foreground">{api.baseUrl}</p></div></div>
              <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", api.status === 'active' ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground")}>{api.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-muted/50"><p className="text-xs text-muted-foreground mb-1">Price per call</p><p className="text-lg font-semibold">${api.pricePerCall}</p></div>
              <div className="p-3 rounded-lg bg-muted/50"><p className="text-xs text-muted-foreground mb-1">Total Revenue</p><p className="text-lg font-semibold">${api.totalRevenue.toFixed(2)}</p></div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-border/50"><p className="text-xs text-muted-foreground">{api.totalCalls.toLocaleString()} total calls</p><Button variant="ghost" size="sm"><ExternalLink className="w-4 h-4 mr-1" />View Docs</Button></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
