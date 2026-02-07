import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import DocumentSelector from '@/components/DocumentSelector';
import FeaturesSection from '@/components/FeaturesSection';
import ClaimForm from '@/components/ClaimForm';
import FileUpload from '@/components/FileUpload';
import ResultsPanel from '@/components/ResultsPanel';
import { SAMPLE_FNOL_DATA, processClaim, ExtractedFields, ClaimOutput } from '@/lib/claimsProcessor';

type AppView = 'home' | 'form' | 'upload' | 'results';

const Index = () => {
  const [view, setView] = useState<AppView>('home');
  const [result, setResult] = useState<ClaimOutput | null>(null);
  const processorRef = useRef<HTMLDivElement>(null);

  const scrollToProcessor = () => {
    processorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectSample = (docKey: string) => {
    const fields = SAMPLE_FNOL_DATA[docKey];
    const output = processClaim(fields);
    setResult(output);
    setView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFieldsProcessed = (fields: ExtractedFields) => {
    const output = processClaim(fields);
    setResult(output);
    setView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setView('home');
    setResult(null);
  };

  const handleProcessAnother = () => {
    setView('home');
    setResult(null);
    setTimeout(() => scrollToProcessor(), 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {view === 'home' && (
          <>
            <HeroSection onGetStarted={scrollToProcessor} />
            <div ref={processorRef}>
              <DocumentSelector
                onSelect={handleSelectSample}
                onUploadClick={() => {
                  setView('upload');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onManualClick={() => {
                  setView('form');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
            <div id="features">
              <FeaturesSection />
            </div>
          </>
        )}

        {view === 'upload' && (
          <FileUpload
            onFieldsExtracted={handleFieldsProcessed}
            onBack={handleBack}
          />
        )}

        {view === 'form' && (
          <ClaimForm
            onSubmit={handleFieldsProcessed}
            onBack={handleBack}
          />
        )}

        {view === 'results' && result && (
          <ResultsPanel
            result={result}
            onBack={handleBack}
            onProcessAnother={handleProcessAnother}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
