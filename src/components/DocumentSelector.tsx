import { motion } from 'framer-motion';
import { FileText, Upload, ChevronRight, PenLine } from 'lucide-react';
import { SAMPLE_FNOL_DATA } from '@/lib/claimsProcessor';

interface DocumentSelectorProps {
  onSelect: (docKey: string) => void;
  onUploadClick: () => void;
  onManualClick: () => void;
}

const DOC_LABELS: Record<string, { title: string; description: string; tag: string }> = {
  'sample-auto-collision': {
    title: 'Auto Collision — Sarah Mitchell',
    description: 'Rear-end collision, moderate damage, $8,500 estimate',
    tag: 'Fast-Track',
  },
  'sample-injury-claim': {
    title: 'Workplace Injury — Michael Chen',
    description: 'Slip and fall, back injury, hospital evaluation',
    tag: 'Specialist',
  },
  'sample-fraud-flag': {
    title: 'Suspicious Claim — Robert Davis',
    description: 'Inconsistent evidence, potential staged collision',
    tag: 'Investigation',
  },
  'sample-incomplete': {
    title: 'Incomplete Claim — Lisa Wong',
    description: 'Water damage, missing effective dates & estimate',
    tag: 'Manual Review',
  },
};

const TAG_STYLES: Record<string, string> = {
  'Fast-Track': 'bg-success/10 text-success',
  'Specialist': 'bg-info/10 text-info',
  'Investigation': 'bg-investigation/10 text-investigation',
  'Manual Review': 'bg-warning/10 text-warning',
};

const DocumentSelector = ({ onSelect, onUploadClick, onManualClick }: DocumentSelectorProps) => {
  return (
    <section id="processor" className="py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Select an FNOL Document
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose a sample document, upload your own PDF/TXT, or enter claim data manually.
          </p>
        </motion.div>

        <div className="grid gap-4">
          {Object.keys(SAMPLE_FNOL_DATA).map((key, index) => {
            const doc = DOC_LABELS[key];
            return (
              <motion.button
                key={key}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelect(key)}
                className="group flex items-center gap-4 p-5 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-card-hover transition-all text-left w-full"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-card-foreground truncate">{doc.title}</h3>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full flex-shrink-0 ${TAG_STYLES[doc.tag]}`}>
                      {doc.tag}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{doc.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
              </motion.button>
            );
          })}

          {/* Upload PDF/TXT */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            onClick={onUploadClick}
            className="group flex items-center gap-4 p-5 bg-card rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/[0.02] transition-all text-left w-full"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-card-foreground">Upload FNOL Document</h3>
              <p className="text-sm text-muted-foreground">Upload a PDF or TXT file for automatic field extraction</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
          </motion.button>

          {/* Manual entry */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            onClick={onManualClick}
            className="group flex items-center gap-4 p-5 bg-card rounded-xl border border-border hover:border-primary/30 transition-all text-left w-full"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <PenLine className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-card-foreground">Enter Manually</h3>
              <p className="text-sm text-muted-foreground">Fill in claim fields by hand</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default DocumentSelector;
