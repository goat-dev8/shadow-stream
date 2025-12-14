import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-pattern opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/15 rounded-full blur-[100px] animate-pulse-slow" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary mb-6"
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Built on Polygon</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Let your AI spend –{' '}
              <span className="text-gradient">without leaking your data.</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
            >
              ShadowStream gives your agents private, policy-limited wallets on Polygon. 
              x402 micropayments, stablecoin rails, and verifiable receipts in one dashboard.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button asChild variant="hero" size="xl">
                <Link to="/app">
                  Launch App
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="heroOutline" size="xl">
                <Link to="/docs">
                  View Docs
                </Link>
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Right Content - Animated Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              {/* Glow effect behind card */}
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-3xl transform scale-110" />
              
              {/* Main Card */}
              <motion.div
                className="relative glass rounded-2xl p-6 shadow-glow-purple"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Policy Vault</p>
                    <h3 className="text-xl font-semibold">Research Bot Budget</h3>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium">
                    Active
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Balance</p>
                    <p className="text-2xl font-bold">$2,450</p>
                    <p className="text-xs text-muted-foreground">USDC</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Daily Limit</p>
                    <p className="text-2xl font-bold">$100</p>
                    <p className="text-xs text-muted-foreground">per day</p>
                  </div>
                </div>
                
                {/* Animated Payment Rows */}
                <div className="space-y-2">
                  {[
                    { amount: '0.0023', merchant: 'OpenAI API' },
                    { amount: '0.0015', merchant: 'Perplexity' },
                    { amount: '0.0018', merchant: 'Claude API' },
                  ].map((payment, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.15 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                          <Zap className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="text-sm">{payment.merchant}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-accent">-${payment.amount}</p>
                        <p className="text-xs text-muted-foreground">USDC</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
