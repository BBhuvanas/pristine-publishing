import { motion } from 'framer-motion';
import { FileSearch, AlertCircle, GitBranch, MessageSquareText } from 'lucide-react';

const features = [
  {
    icon: <FileSearch className="w-6 h-6" />,
    title: 'Field Extraction',
    description: 'Automatically extracts policy info, incident details, parties, and asset data from FNOL documents.',
  },
  {
    icon: <AlertCircle className="w-6 h-6" />,
    title: 'Missing Field Detection',
    description: 'Identifies all mandatory fields that are missing or incomplete for thorough claim processing.',
  },
  {
    icon: <GitBranch className="w-6 h-6" />,
    title: 'Smart Routing',
    description: 'Routes claims to Fast-Track, Manual Review, Investigation, or Specialist queues based on rules.',
  },
  {
    icon: <MessageSquareText className="w-6 h-6" />,
    title: 'Decision Reasoning',
    description: 'Provides clear, human-readable explanations for every routing decision made.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 px-6 bg-muted/50">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The agent follows a systematic pipeline to process each claim accurately and efficiently.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border p-6 hover:shadow-card-hover transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Routing Rules Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 bg-card rounded-xl border border-border p-6 md:p-8"
        >
          <h3 className="text-lg font-semibold text-card-foreground mb-5">Routing Rules</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { rule: 'Estimated damage < $25,000', result: '⚡ Fast-Track', color: 'text-success' },
              { rule: 'Any mandatory field missing', result: '📋 Manual Review', color: 'text-warning' },
              { rule: 'Fraud keywords detected', result: '🔍 Investigation Flag', color: 'text-investigation' },
              { rule: 'Claim type = Injury', result: '🏥 Specialist Queue', color: 'text-info' },
            ].map(item => (
              <div key={item.rule} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <span className={`font-semibold text-sm flex-shrink-0 ${item.color}`}>{item.result}</span>
                <span className="text-sm text-muted-foreground">{item.rule}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
