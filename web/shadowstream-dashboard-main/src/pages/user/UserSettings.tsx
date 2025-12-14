import { motion } from 'framer-motion';

export function UserSettings() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Manage your account and preferences.</p></div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
        <h3 className="font-semibold mb-4">Profile</h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50 flex justify-between items-center"><span className="text-muted-foreground">Display Name</span><span>User</span></div>
          <div className="p-4 rounded-lg bg-muted/50 flex justify-between items-center"><span className="text-muted-foreground">Connected Wallet</span><code className="font-mono text-sm">0x7f8a...3c4d</code></div>
          <div className="p-4 rounded-lg bg-muted/50 flex justify-between items-center"><span className="text-muted-foreground">Network</span><span>Polygon Mainnet</span></div>
        </div>
      </motion.div>
    </div>
  );
}
