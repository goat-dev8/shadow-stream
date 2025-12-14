import { motion } from 'framer-motion';
import { KeyRound, Eye, CreditCard } from 'lucide-react';

const problems = [
  {
    icon: KeyRound,
    title: 'Shared API keys & unlimited spend',
    description: 'Your AI agents use your full API credentials. One rogue prompt could drain your entire budget with no guardrails.',
  },
  {
    icon: Eye,
    title: 'No privacy: on-chain usage reveals all',
    description: 'Every transaction exposes your strategy. Competitors can track your AI spending patterns and reverse-engineer your playbook.',
  },
  {
    icon: CreditCard,
    title: 'Invoices don\'t work for AI agents',
    description: 'Traditional billing isn\'t built for micropayments. Credit cards charge fees that exceed the transaction value for sub-cent calls.',
  },
];

export function Problems() {
  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-glow opacity-50" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The Problem with AI Payments Today
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Existing payment infrastructure wasn't designed for autonomous agents making thousands of micro-decisions.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="glass rounded-2xl p-6 group hover:border-destructive/50 transition-colors duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center mb-5 group-hover:bg-destructive/20 transition-colors">
                <problem.icon className="w-7 h-7 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{problem.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
