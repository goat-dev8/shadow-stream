import { motion } from 'framer-motion';
import { TrendingUp, Zap, FileCode2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const revenueData = [{ date: 'Mon', revenue: 12, calls: 520 },{ date: 'Tue', revenue: 18, calls: 780 },{ date: 'Wed', revenue: 15, calls: 650 },{ date: 'Thu', revenue: 22, calls: 950 },{ date: 'Fri', revenue: 28, calls: 1200 },{ date: 'Sat', revenue: 14, calls: 600 },{ date: 'Sun', revenue: 19, calls: 820 }];

export function MerchantOverview() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Merchant Overview</h1><p className="text-muted-foreground">Track your API revenue and usage.</p></div>
      <div className="grid sm:grid-cols-3 gap-4">
        {[{ label: 'Total Revenue (30d)', value: '$892.45', icon: TrendingUp },{ label: 'Total Calls', value: '24,156', icon: Zap },{ label: 'Active APIs', value: '2', icon: FileCode2 }].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-xl p-5">
            <div className="flex items-start justify-between"><div><p className="text-sm text-muted-foreground mb-1">{stat.label}</p><p className="text-3xl font-bold">{stat.value}</p></div><div className="p-2 rounded-lg bg-secondary/10"><stat.icon className="w-5 h-5 text-secondary" /></div></div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Revenue & Calls</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(199 89% 60%)" stopOpacity={0.3}/><stop offset="95%" stopColor="hsl(199 89% 60%)" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 15%)" /><XAxis dataKey="date" stroke="hsl(218 11% 65%)" fontSize={12} /><YAxis stroke="hsl(218 11% 65%)" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(222 47% 6%)', border: '1px solid hsl(222 30% 15%)', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(199 89% 60%)" fillOpacity={1} fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
