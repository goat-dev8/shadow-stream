import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`${sizeClasses[size]} relative`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          {/* Outer glow effect */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(263 70% 58%)" />
              <stop offset="100%" stopColor="hsl(199 89% 60%)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Shield shape */}
          <path
            d="M20 2L4 10V20C4 30 20 38 20 38C20 38 36 30 36 20V10L20 2Z"
            fill="url(#logoGradient)"
            fillOpacity="0.2"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            filter="url(#glow)"
          />
          
          {/* Inner stream lines */}
          <path
            d="M12 16L20 12L28 16"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M12 22L20 18L28 22"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M12 28L20 24L28 28"
            stroke="url(#logoGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </motion.div>
      {showText && (
        <span className={`${textSizes[size]} font-bold text-gradient`}>
          ShadowStream
        </span>
      )}
    </div>
  );
}
