import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';
import { ExtractedFields } from '@/lib/claimsProcessor';

interface ClaimFormProps {
  onSubmit: (fields: ExtractedFields) => void;
  onBack: () => void;
}

const ClaimForm = ({ onSubmit, onBack }: ClaimFormProps) => {
  const [formData, setFormData] = useState({
    policyNumber: '',
    policyholderName: '',
    effectiveDateStart: '',
    effectiveDateEnd: '',
    incidentDate: '',
    incidentTime: '',
    incidentLocation: '',
    incidentDescription: '',
    claimantName: '',
    claimantContact: '',
    thirdPartyName: '',
    thirdPartyContact: '',
    assetType: '',
    assetId: '',
    estimatedDamage: '',
    claimType: '',
    initialEstimate: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fields: ExtractedFields = {
      policyInfo: {
        policyNumber: formData.policyNumber || null,
        policyholderName: formData.policyholderName || null,
        effectiveDateStart: formData.effectiveDateStart || null,
        effectiveDateEnd: formData.effectiveDateEnd || null,
      },
      incidentInfo: {
        date: formData.incidentDate || null,
        time: formData.incidentTime || null,
        location: formData.incidentLocation || null,
        description: formData.incidentDescription || null,
      },
      involvedParties: [
        ...(formData.claimantName ? [{ name: formData.claimantName, role: 'claimant' as const, contactDetails: formData.claimantContact || null }] : []),
        ...(formData.thirdPartyName ? [{ name: formData.thirdPartyName, role: 'third-party' as const, contactDetails: formData.thirdPartyContact || null }] : []),
      ],
      assetDetails: {
        assetType: formData.assetType || null,
        assetId: formData.assetId || null,
        estimatedDamage: formData.estimatedDamage ? Number(formData.estimatedDamage) : null,
      },
      claimType: formData.claimType || null,
      attachments: [],
      initialEstimate: formData.initialEstimate ? Number(formData.initialEstimate) : null,
    };
    onSubmit(fields);
  };

  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-input bg-card text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";

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

          <h2 className="text-3xl font-bold text-foreground mb-2">Enter Claim Data</h2>
          <p className="text-muted-foreground mb-8">Fill in the FNOL fields manually. Leave fields empty to test missing field detection.</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Policy Information */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Policy Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Policy Number</label>
                  <input className={inputClass} placeholder="POL-2024-XXXXX" value={formData.policyNumber} onChange={e => handleChange('policyNumber', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Policyholder Name</label>
                  <input className={inputClass} placeholder="Full Name" value={formData.policyholderName} onChange={e => handleChange('policyholderName', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Effective Start Date</label>
                  <input type="date" className={inputClass} value={formData.effectiveDateStart} onChange={e => handleChange('effectiveDateStart', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Effective End Date</label>
                  <input type="date" className={inputClass} value={formData.effectiveDateEnd} onChange={e => handleChange('effectiveDateEnd', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Incident Information */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                Incident Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Date of Incident</label>
                  <input type="date" className={inputClass} value={formData.incidentDate} onChange={e => handleChange('incidentDate', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Time of Incident</label>
                  <input type="time" className={inputClass} value={formData.incidentTime} onChange={e => handleChange('incidentTime', e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Location</label>
                  <input className={inputClass} placeholder="Address or location description" value={formData.incidentLocation} onChange={e => handleChange('incidentLocation', e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Description</label>
                  <textarea className={`${inputClass} min-h-[100px] resize-y`} placeholder="Describe the incident..." value={formData.incidentDescription} onChange={e => handleChange('incidentDescription', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Involved Parties */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                Involved Parties
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Claimant Name</label>
                  <input className={inputClass} placeholder="Full Name" value={formData.claimantName} onChange={e => handleChange('claimantName', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Claimant Contact</label>
                  <input className={inputClass} placeholder="Email or phone" value={formData.claimantContact} onChange={e => handleChange('claimantContact', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Third Party Name (optional)</label>
                  <input className={inputClass} placeholder="Full Name" value={formData.thirdPartyName} onChange={e => handleChange('thirdPartyName', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Third Party Contact (optional)</label>
                  <input className={inputClass} placeholder="Email or phone" value={formData.thirdPartyContact} onChange={e => handleChange('thirdPartyContact', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Asset & Claim Details */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning" />
                Asset & Claim Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Asset Type</label>
                  <select className={inputClass} value={formData.assetType} onChange={e => handleChange('assetType', e.target.value)}>
                    <option value="">Select type...</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Property">Property</option>
                    <option value="Equipment">Equipment</option>
                    <option value="N/A">N/A</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Asset ID</label>
                  <input className={inputClass} placeholder="VIN, Property ID, etc." value={formData.assetId} onChange={e => handleChange('assetId', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Claim Type</label>
                  <select className={inputClass} value={formData.claimType} onChange={e => handleChange('claimType', e.target.value)}>
                    <option value="">Select type...</option>
                    <option value="Auto Collision">Auto Collision</option>
                    <option value="Property Damage">Property Damage</option>
                    <option value="Injury">Injury</option>
                    <option value="Theft">Theft</option>
                    <option value="Natural Disaster">Natural Disaster</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Estimated Damage ($)</label>
                  <input type="number" className={inputClass} placeholder="0" value={formData.estimatedDamage} onChange={e => handleChange('estimatedDamage', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Initial Estimate ($)</label>
                  <input type="number" className={inputClass} placeholder="0" value={formData.initialEstimate} onChange={e => handleChange('initialEstimate', e.target.value)} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-glow"
            >
              <Send className="w-5 h-5" />
              Process Claim
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ClaimForm;
