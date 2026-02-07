import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Check, AlertTriangle, CheckCircle, Shield, Clock, FileJson, List, Grid3X3 } from 'lucide-react';
import { ClaimOutput, ROUTE_CONFIG, RouteType } from '@/lib/claimsProcessor';

interface ResultsPanelProps {
  result: ClaimOutput;
  onBack: () => void;
  onProcessAnother: () => void;
}

const ROUTE_ICONS: Record<RouteType, React.ReactNode> = {
  'fast-track': <CheckCircle className="w-6 h-6" />,
  'manual-review': <Clock className="w-6 h-6" />,
  'investigation': <Shield className="w-6 h-6" />,
  'specialist-queue': <AlertTriangle className="w-6 h-6" />,
};

const ROUTE_BG: Record<RouteType, string> = {
  'fast-track': 'bg-success/10 border-success/30 text-success',
  'manual-review': 'bg-warning/10 border-warning/30 text-warning',
  'investigation': 'bg-investigation/10 border-investigation/30 text-investigation',
  'specialist-queue': 'bg-info/10 border-info/30 text-info',
};

const ResultsPanel = ({ result, onBack, onProcessAnother }: ResultsPanelProps) => {
  const [view, setView] = useState<'visual' | 'json'>('visual');
  const [copied, setCopied] = useState(false);
  const routeConfig = ROUTE_CONFIG[result.recommendedRoute];

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { extractedFields } = result;

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Process another claim
          </button>

          {/* Route Decision Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl border-2 p-6 md:p-8 mb-8 ${ROUTE_BG[result.recommendedRoute]}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">{ROUTE_ICONS[result.recommendedRoute]}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{routeConfig.icon}</span>
                  <h2 className="text-2xl font-bold">Routed to: {routeConfig.label}</h2>
                </div>
                <p className="opacity-80 leading-relaxed">{result.reasoning}</p>
              </div>
            </div>
          </motion.div>

          {/* Missing Fields Warning */}
          {result.missingFields.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-warning/5 border border-warning/20 rounded-xl p-5 mb-8"
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <h3 className="font-semibold text-foreground">Missing Fields ({result.missingFields.length})</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.missingFields.map(field => (
                  <span key={field} className="text-xs font-mono bg-warning/10 text-warning px-3 py-1 rounded-full">
                    {field}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* View Toggle */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">Extracted Data</h3>
            <div className="flex items-center bg-muted rounded-lg p-1">
              <button
                onClick={() => setView('visual')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'visual' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                <Grid3X3 className="w-4 h-4" />
                Visual
              </button>
              <button
                onClick={() => setView('json')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'json' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                <FileJson className="w-4 h-4" />
                JSON
              </button>
            </div>
          </div>

          {view === 'visual' ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Policy Info */}
              <div className="bg-card rounded-xl border border-border p-5">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Policy Information</h4>
                <div className="space-y-3">
                  <FieldRow label="Policy Number" value={extractedFields.policyInfo.policyNumber} />
                  <FieldRow label="Policyholder" value={extractedFields.policyInfo.policyholderName} />
                  <FieldRow label="Effective From" value={extractedFields.policyInfo.effectiveDateStart} />
                  <FieldRow label="Effective To" value={extractedFields.policyInfo.effectiveDateEnd} />
                </div>
              </div>

              {/* Incident Info */}
              <div className="bg-card rounded-xl border border-border p-5">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Incident Information</h4>
                <div className="space-y-3">
                  <FieldRow label="Date" value={extractedFields.incidentInfo.date} />
                  <FieldRow label="Time" value={extractedFields.incidentInfo.time} />
                  <FieldRow label="Location" value={extractedFields.incidentInfo.location} />
                  <FieldRow label="Description" value={extractedFields.incidentInfo.description} isLong />
                </div>
              </div>

              {/* Involved Parties */}
              <div className="bg-card rounded-xl border border-border p-5">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Involved Parties</h4>
                {extractedFields.involvedParties.length > 0 ? (
                  <div className="space-y-4">
                    {extractedFields.involvedParties.map((party, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${party.role === 'claimant' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {party.role}
                          </span>
                        </div>
                        <FieldRow label="Name" value={party.name} />
                        <FieldRow label="Contact" value={party.contactDetails} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-destructive italic">No parties listed</p>
                )}
              </div>

              {/* Asset & Claim */}
              <div className="bg-card rounded-xl border border-border p-5">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Asset & Claim Details</h4>
                <div className="space-y-3">
                  <FieldRow label="Asset Type" value={extractedFields.assetDetails.assetType} />
                  <FieldRow label="Asset ID" value={extractedFields.assetDetails.assetId} />
                  <FieldRow label="Est. Damage" value={extractedFields.assetDetails.estimatedDamage != null ? `$${extractedFields.assetDetails.estimatedDamage.toLocaleString()}` : null} />
                  <FieldRow label="Claim Type" value={extractedFields.claimType} />
                  <FieldRow label="Initial Estimate" value={extractedFields.initialEstimate != null ? `$${extractedFields.initialEstimate.toLocaleString()}` : null} />
                  <FieldRow label="Attachments" value={extractedFields.attachments.length > 0 ? extractedFields.attachments.join(', ') : null} />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
              <button
                onClick={copyJson}
                className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-muted px-3 py-1.5 rounded-lg transition-colors z-10"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <pre className="bg-card rounded-xl border border-border p-6 overflow-auto text-sm font-mono text-card-foreground max-h-[600px]">
                {JSON.stringify(result, null, 2)}
              </pre>
            </motion.div>
          )}

          {/* Process Another */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-center"
          >
            <button
              onClick={onProcessAnother}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Process Another Claim
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const FieldRow = ({ label, value, isLong }: { label: string; value: string | null; isLong?: boolean }) => (
  <div className={isLong ? '' : 'flex items-start justify-between gap-4'}>
    <span className="text-sm text-muted-foreground flex-shrink-0">{label}</span>
    {value ? (
      <span className={`text-sm font-medium text-card-foreground ${isLong ? 'block mt-1' : 'text-right'}`}>{value}</span>
    ) : (
      <span className={`text-sm italic text-destructive ${isLong ? 'block mt-1' : 'text-right'}`}>Missing</span>
    )}
  </div>
);

export default ResultsPanel;
