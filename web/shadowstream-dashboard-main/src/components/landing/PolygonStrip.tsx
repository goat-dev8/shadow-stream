import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const benefits = [
  'Low-fee stablecoin transactions',
  'Sub-second finality for micropayments',
  'ZK infrastructure ready',
  'Battle-tested security',
];

export function PolygonStrip() {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-y border-border/50">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row items-center justify-between gap-8"
        >
          {/* Polygon Logo */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#8247E5]/20 flex items-center justify-center">
              <svg viewBox="0 0 38 33" fill="none" className="w-10 h-10">
                <path
                  d="M28.8 12.5L35.2 16.2C35.8 16.6 36.1 17.2 36.1 17.9V25.3C36.1 26 35.8 26.6 35.2 27L28.8 30.7C28.2 31.1 27.4 31.1 26.8 30.7L20.4 27C19.8 26.6 19.5 26 19.5 25.3V22L14.9 19.5V25.3C14.9 26 14.6 26.6 14 27L7.6 30.7C7 31.1 6.2 31.1 5.6 30.7L-0.8 27C-1.4 26.6 -1.7 26 -1.7 25.3V17.9C-1.7 17.2 -1.4 16.6 -0.8 16.2L5.6 12.5C6.2 12.1 7 12.1 7.6 12.5L14 16.2C14.6 16.6 14.9 17.2 14.9 17.9V21.2L19.5 18.7V12.9C19.5 12.2 19.8 11.6 20.4 11.2L26.8 7.5C27.4 7.1 28.2 7.1 28.8 7.5L35.2 11.2C35.8 11.6 36.1 12.2 36.1 12.9V17.9L40.7 20.4V14.6C40.7 13.9 40.4 13.3 39.8 12.9L28.8 6.1C28.2 5.7 27.4 5.7 26.8 6.1L15.8 12.9C15.2 13.3 14.9 13.9 14.9 14.6V17.9L10.3 15.4V9.6C10.3 8.9 10.6 8.3 11.2 7.9L22.2 1.1C22.8 0.7 23.6 0.7 24.2 1.1L35.2 7.9C35.8 8.3 36.1 8.9 36.1 9.6V14.6L40.7 17.1V11.3C40.7 10.6 40.4 10 39.8 9.6L28.8 2.8C28.2 2.4 27.4 2.4 26.8 2.8L15.8 9.6C15.2 10 14.9 10.6 14.9 11.3V14.6L10.3 12.1V6.3C10.3 5.6 10.6 5 11.2 4.6L22.2 -2.2C22.8 -2.6 23.6 -2.6 24.2 -2.2L35.2 4.6C35.8 5 36.1 5.6 36.1 6.3V11.3"
                  fill="#8247E5"
                  transform="translate(2, 2) scale(0.85)"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gradient">Built for Polygon</h3>
              <p className="text-muted-foreground">The ideal chain for agentic payments</p>
            </div>
          </div>
          
          {/* Benefits */}
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
