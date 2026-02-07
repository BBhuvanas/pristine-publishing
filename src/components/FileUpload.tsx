import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, Loader2, ArrowLeft, AlertCircle, CheckCircle, Send } from 'lucide-react';
import { extractTextFromFile, parseFNOLFields } from '@/lib/documentParser';
import { ExtractedFields } from '@/lib/claimsProcessor';

interface FileUploadProps {
  onFieldsExtracted: (fields: ExtractedFields) => void;
  onBack: () => void;
}

type UploadState = 'idle' | 'parsing' | 'preview' | 'error';

const FileUpload = ({ onFieldsExtracted, onBack }: FileUploadProps) => {
  const [state, setState] = useState<UploadState>('idle');
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [parsedFields, setParsedFields] = useState<ExtractedFields | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    const ext = file.name.toLowerCase().split('.').pop();
    if (ext !== 'pdf' && ext !== 'txt' && ext !== 'text') {
      setErrorMsg('Unsupported file type. Please upload a .pdf or .txt file.');
      setState('error');
      return;
    }

    setFileName(file.name);
    setState('parsing');
    setErrorMsg('');

    try {
      const text = await extractTextFromFile(file);
      setExtractedText(text);

      if (!text.trim()) {
        setErrorMsg('Could not extract text from the file. The file may be empty or image-based.');
        setState('error');
        return;
      }

      const fields = parseFNOLFields(text);
      setParsedFields(fields);
      setState('preview');
    } catch (err: any) {
      console.error('Error parsing file:', err);
      setErrorMsg(err.message || 'Failed to parse the uploaded file.');
      setState('error');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleProcess = () => {
    if (parsedFields) {
      onFieldsExtracted(parsedFields);
    }
  };

  const resetUpload = () => {
    setState('idle');
    setFileName('');
    setExtractedText('');
    setParsedFields(null);
    setErrorMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const fieldCount = parsedFields ? countNonNullFields(parsedFields) : 0;

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to document selection
          </button>

          <h2 className="text-3xl font-bold text-foreground mb-2">Upload FNOL Document</h2>
          <p className="text-muted-foreground mb-8">
            Upload a PDF or TXT file containing FNOL claim data. The agent will extract fields automatically.
          </p>

          <AnimatePresence mode="wait">
            {/* IDLE: Upload Area */}
            {state === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-16 text-center transition-all ${
                    dragActive
                      ? 'border-primary bg-primary/5 shadow-glow'
                      : 'border-border hover:border-primary/40 bg-card'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt,.text"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
                      dragActive ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <Upload className={`w-8 h-8 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-card-foreground mb-1">
                        {dragActive ? 'Drop your file here' : 'Drag & drop your FNOL document'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse · Supports <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">.pdf</span> and <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">.txt</span> files
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PARSING: Loading */}
            {state === 'parsing' && (
              <motion.div
                key="parsing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-card rounded-2xl border border-border p-16 text-center"
              >
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <div>
                    <p className="text-lg font-semibold text-card-foreground">Processing {fileName}</p>
                    <p className="text-sm text-muted-foreground mt-1">Extracting text and parsing FNOL fields...</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ERROR */}
            {state === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-card rounded-2xl border border-investigation/30 p-10 text-center"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-investigation/10 flex items-center justify-center">
                    <AlertCircle className="w-7 h-7 text-investigation" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-card-foreground">Upload Failed</p>
                    <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{errorMsg}</p>
                  </div>
                  <button
                    onClick={resetUpload}
                    className="mt-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity"
                  >
                    Try Again
                  </button>
                </div>
              </motion.div>
            )}

            {/* PREVIEW: Show extracted fields */}
            {state === 'preview' && parsedFields && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* File info bar */}
                <div className="flex items-center justify-between bg-card rounded-xl border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground text-sm">{fileName}</p>
                      <p className="text-xs text-muted-foreground">{fieldCount} fields extracted</p>
                    </div>
                  </div>
                  <button onClick={resetUpload} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Extracted text preview */}
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Extracted Text Preview
                  </h3>
                  <div className="bg-muted rounded-lg p-4 max-h-40 overflow-y-auto">
                    <p className="text-xs font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {extractedText.slice(0, 1500)}{extractedText.length > 1500 ? '...' : ''}
                    </p>
                  </div>
                </div>

                {/* Parsed fields summary */}
                <div className="bg-card rounded-xl border border-border p-5">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Detected Fields
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FieldPreview label="Policy Number" value={parsedFields.policyInfo.policyNumber} />
                    <FieldPreview label="Policyholder" value={parsedFields.policyInfo.policyholderName} />
                    <FieldPreview label="Incident Date" value={parsedFields.incidentInfo.date} />
                    <FieldPreview label="Location" value={parsedFields.incidentInfo.location} />
                    <FieldPreview label="Claim Type" value={parsedFields.claimType} />
                    <FieldPreview label="Initial Estimate" value={parsedFields.initialEstimate != null ? `$${parsedFields.initialEstimate.toLocaleString()}` : null} />
                    <FieldPreview label="Asset Type" value={parsedFields.assetDetails.assetType} />
                    <FieldPreview label="Parties Found" value={parsedFields.involvedParties.length > 0 ? `${parsedFields.involvedParties.length} found` : null} />
                  </div>
                </div>

                {/* Description preview if found */}
                {parsedFields.incidentInfo.description && (
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Incident Description
                    </h3>
                    <p className="text-sm text-card-foreground leading-relaxed">
                      {parsedFields.incidentInfo.description}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleProcess}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-glow"
                  >
                    <Send className="w-5 h-5" />
                    Route This Claim
                  </button>
                  <button
                    onClick={resetUpload}
                    className="px-6 py-3.5 rounded-xl font-medium border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
                  >
                    Upload Different File
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

const FieldPreview = ({ label, value }: { label: string; value: string | null }) => (
  <div className="flex items-center justify-between gap-2 py-2 px-3 rounded-lg bg-muted/50">
    <span className="text-sm text-muted-foreground">{label}</span>
    {value ? (
      <span className="flex items-center gap-1.5 text-sm font-medium text-card-foreground">
        <CheckCircle className="w-3.5 h-3.5 text-success flex-shrink-0" />
        <span className="truncate max-w-[140px]">{value}</span>
      </span>
    ) : (
      <span className="flex items-center gap-1.5 text-sm text-investigation">
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
        Missing
      </span>
    )}
  </div>
);

function countNonNullFields(fields: ExtractedFields): number {
  let count = 0;
  const { policyInfo, incidentInfo, assetDetails } = fields;
  if (policyInfo.policyNumber) count++;
  if (policyInfo.policyholderName) count++;
  if (policyInfo.effectiveDateStart) count++;
  if (policyInfo.effectiveDateEnd) count++;
  if (incidentInfo.date) count++;
  if (incidentInfo.time) count++;
  if (incidentInfo.location) count++;
  if (incidentInfo.description) count++;
  if (assetDetails.assetType) count++;
  if (assetDetails.assetId) count++;
  if (assetDetails.estimatedDamage != null) count++;
  if (fields.claimType) count++;
  if (fields.initialEstimate != null) count++;
  count += fields.involvedParties.length;
  count += fields.attachments.length;
  return count;
}

export default FileUpload;
