import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Wallet, Users, Store, ChevronRight } from 'lucide-react';
import type { UserRole } from '@/types';

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);

  // Determine if we're at the main /app route
  const isRoleSelection = location.pathname === '/app';

  const handleConnectWallet = () => {
    setWalletConnected(true);
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    navigate(selectedRole === 'user' ? '/app/user' : '/app/merchant');
  };

  if (!walletConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome to ShadowStream</h1>
          <p className="text-muted-foreground mb-8">
            Connect your wallet to access private policy vaults and x402 micropayments.
          </p>
          <Button onClick={handleConnectWallet} variant="hero" size="lg" className="w-full">
            <Wallet className="w-5 h-5" />
            Connect Wallet
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Supports MetaMask, WalletConnect, and Coinbase Wallet
          </p>
        </motion.div>
      </div>
    );
  }

  if (isRoleSelection) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full"
        >
          <div className="text-center mb-8">
            <Logo size="lg" showText />
            <h1 className="text-3xl font-bold mt-6 mb-2">How will you use ShadowStream?</h1>
            <p className="text-muted-foreground">
              Choose your role to get started. You can always switch later.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.button
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleSelect('user')}
              className="glass rounded-2xl p-6 text-left group hover:border-primary/50 transition-colors"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">User / Organization</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Create policy vaults, set spending limits, and let your AI agents make secure micropayments.
              </p>
              <div className="flex items-center text-primary text-sm font-medium">
                Get started <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRoleSelect('merchant')}
              className="glass rounded-2xl p-6 text-left group hover:border-secondary/50 transition-colors"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <Store className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Merchant / API Provider</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Accept x402 micropayments for your APIs. Get paid per request with instant settlement.
              </p>
              <div className="flex items-center text-secondary text-sm font-medium">
                Get started <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </motion.button>
          </div>

          <div className="text-center mt-8">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return <Outlet />;
}
