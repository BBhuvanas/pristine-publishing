import { motion } from 'framer-motion';
import { Shield, Cpu, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="bg-hero relative overflow-hidden min-h-[70vh] flex items-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-accent/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-1.5 text-sm text-primary-foreground/80">
              <Cpu className="w-4 h-4" />
              <span>AI-Powered Claims Processing</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-primary-foreground leading-tight mb-6"
          >
            Autonomous Insurance{' '}
            <span className="text-accent">Claims Agent</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-primary-foreground/70 mb-10 max-w-2xl leading-relaxed"
          >
            Extract key fields from FNOL documents, identify missing data, classify claims, 
            and route them to the correct workflow — all in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={onGetStarted}
              className="group flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3.5 rounded-xl font-semibold text-lg hover:opacity-90 transition-all shadow-glow"
            >
              Process a Claim
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { label: 'Field Extraction', value: '10+ fields' },
              { label: 'Routing Rules', value: '4 workflows' },
              { label: 'Processing', value: '< 1 second' },
              { label: 'Output Format', value: 'JSON' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-primary-foreground">{stat.value}</div>
                <div className="text-sm text-primary-foreground/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Shield icon decoration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.06, scale: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block"
      >
        <Shield className="w-[400px] h-[400px] text-primary-foreground" strokeWidth={0.5} />
      </motion.div>
    </section>
  );
};

export default HeroSection;
