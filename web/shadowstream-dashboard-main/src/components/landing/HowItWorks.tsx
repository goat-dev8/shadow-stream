import { motion } from 'framer-motion';
import { Vault, Bot, Zap } from 'lucide-react';

const steps = [
  {
    icon: Vault,
    step: '01',
    title: 'Create a Policy Vault',
    description: 'Deposit USDC and set spending rules: daily limits, per-transaction caps, and approved merchants.',
  },
  {
    icon: Bot,
    step: '02',
    title: 'Connect your AI agent',
    description: 'Use our x402-compatible SDK or native HTTP headers. Your agent gets a scoped credential, not your main wallet.',
  },
  {
    icon: Zap,
    step: '03',
    title: 'Stream private micropayments',
    description: 'Every API call triggers a per-request payment. Privacy-preserving, verifiable receipts, all on Polygon.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-4 bg-muted/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How ShadowStream Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Three simple steps to enable secure, private micropayments for your AI agents.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-full h-px bg-gradient-to-r from-primary/50 to-secondary/50" />
              )}
              
              <div className="relative glass rounded-2xl p-8 h-full group hover:border-primary/50 transition-all duration-300">
                {/* Step number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-lg shadow-glow-purple">
                  {step.step}
                </div>
                
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary bg-opacity-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
