import { motion } from 'framer-motion';
import { Shield, FileCode2, EyeOff, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'On-chain spend limits',
    description: 'Smart contract-enforced spending caps. Your agents can never exceed the rules you set.',
  },
  {
    icon: FileCode2,
    title: 'x402 pay-per-call',
    description: 'Native HTTP 402 support. APIs charge per request automatically with standard headers.',
  },
  {
    icon: EyeOff,
    title: 'Stealth-style payouts',
    description: 'Privacy-preserving transactions. Your spending patterns stay hidden from on-chain observers.',
  },
  {
    icon: BarChart3,
    title: 'Full analytics & receipts',
    description: 'Track every micropayment. Verifiable receipts for compliance and auditing.',
  },
];

export function Features() {
  return (
    <section className="py-24 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Enterprise-grade Features
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to deploy AI agents with safe, auditable payment rails.
          </p>
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="glass rounded-2xl p-6 text-center group hover:border-primary/50 transition-all duration-300"
            >
              <motion.div
                className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all"
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.4 }}
              >
                <feature.icon className="w-7 h-7 text-primary" />
              </motion.div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
