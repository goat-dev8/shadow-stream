import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileCode2, 
  ArrowLeftRight, 
  Banknote, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Wallet,
  Network
} from 'lucide-react';
import { cn } from '@/lib/utils';

const merchantNavItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/app/merchant' },
  { icon: FileCode2, label: 'APIs', path: '/app/merchant/apis' },
  { icon: ArrowLeftRight, label: 'Transactions', path: '/app/merchant/transactions' },
  { icon: Banknote, label: 'Payouts', path: '/app/merchant/payouts' },
  { icon: Settings, label: 'Settings', path: '/app/merchant/settings' },
];

export function MerchantDashboardLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 260 }}
        className="fixed top-0 left-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col z-40"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Logo size="sm" />
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {merchantNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-secondary")} />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-sidebar-border">
          <Link
            to="/app"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
          >
            <ArrowLeftRight className="w-5 h-5" />
            {!collapsed && <span className="text-sm">Switch Role</span>}
          </Link>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className={cn("flex-1 transition-all duration-300", collapsed ? "ml-20" : "ml-[260px]")}>
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-background/95 backdrop-blur sticky top-0 z-30 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm">
              <Network className="w-4 h-4" />
              <span>Polygon Mainnet</span>
            </div>
            <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted">Merchant Mode</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
              <Wallet className="w-4 h-4 text-secondary" />
              <span className="text-sm font-mono">0x7f8a...3c4d</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
