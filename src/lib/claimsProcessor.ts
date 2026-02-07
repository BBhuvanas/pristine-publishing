// Types for the FNOL Claims Processing Agent

export interface PolicyInfo {
  policyNumber: string | null;
  policyholderName: string | null;
  effectiveDateStart: string | null;
  effectiveDateEnd: string | null;
}

export interface IncidentInfo {
  date: string | null;
  time: string | null;
  location: string | null;
  description: string | null;
}

export interface InvolvedParty {
  name: string | null;
  role: 'claimant' | 'third-party';
  contactDetails: string | null;
}

export interface AssetDetails {
  assetType: string | null;
  assetId: string | null;
  estimatedDamage: number | null;
}

export interface ExtractedFields {
  policyInfo: PolicyInfo;
  incidentInfo: IncidentInfo;
  involvedParties: InvolvedParty[];
  assetDetails: AssetDetails;
  claimType: string | null;
  attachments: string[];
  initialEstimate: number | null;
}

export type RouteType = 'fast-track' | 'manual-review' | 'investigation' | 'specialist-queue';

export interface ClaimOutput {
  extractedFields: ExtractedFields;
  missingFields: string[];
  recommendedRoute: RouteType;
  reasoning: string;
}

// Mandatory fields that must be present
const MANDATORY_FIELDS = [
  'policyInfo.policyNumber',
  'policyInfo.policyholderName',
  'policyInfo.effectiveDateStart',
  'incidentInfo.date',
  'incidentInfo.location',
  'incidentInfo.description',
  'claimType',
  'initialEstimate',
];

// Fraud-related keywords
const FRAUD_KEYWORDS = ['fraud', 'inconsistent', 'staged', 'suspicious', 'fabricated', 'false'];

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function findMissingFields(fields: ExtractedFields): string[] {
  const missing: string[] = [];
  for (const field of MANDATORY_FIELDS) {
    const value = getNestedValue(fields, field);
    if (value === null || value === undefined || value === '') {
      missing.push(field);
    }
  }
  if (fields.involvedParties.length === 0) {
    missing.push('involvedParties');
  }
  if (fields.assetDetails.assetType === null) {
    missing.push('assetDetails.assetType');
  }
  return missing;
}

export function determineRoute(fields: ExtractedFields, missingFields: string[]): { route: RouteType; reasoning: string } {
  const reasons: string[] = [];

  // Check for fraud keywords in description
  const description = (fields.incidentInfo.description || '').toLowerCase();
  const foundFraudKeywords = FRAUD_KEYWORDS.filter(kw => description.includes(kw));
  if (foundFraudKeywords.length > 0) {
    reasons.push(`Description contains flagged keywords: ${foundFraudKeywords.join(', ')}. Routing to investigation.`);
    return { route: 'investigation', reasoning: reasons.join(' ') };
  }

  // Check for missing mandatory fields
  if (missingFields.length > 0) {
    reasons.push(`Missing mandatory fields: ${missingFields.join(', ')}. Requires manual review to complete the claim.`);
    return { route: 'manual-review', reasoning: reasons.join(' ') };
  }

  // Check claim type for injury
  if (fields.claimType?.toLowerCase() === 'injury' || fields.claimType?.toLowerCase() === 'personal injury') {
    reasons.push('Claim type is injury. Routing to specialist queue for medical assessment.');
    return { route: 'specialist-queue', reasoning: reasons.join(' ') };
  }

  // Check estimated damage for fast-track
  const estimate = fields.initialEstimate ?? fields.assetDetails.estimatedDamage ?? 0;
  if (estimate < 25000) {
    reasons.push(`Estimated damage ($${estimate.toLocaleString()}) is below $25,000 threshold. Eligible for fast-track processing.`);
    return { route: 'fast-track', reasoning: reasons.join(' ') };
  }

  reasons.push(`Estimated damage ($${estimate.toLocaleString()}) exceeds $25,000 threshold. Standard processing required via manual review.`);
  return { route: 'manual-review', reasoning: reasons.join(' ') };
}

export function processClaim(fields: ExtractedFields): ClaimOutput {
  const missingFields = findMissingFields(fields);
  const { route, reasoning } = determineRoute(fields, missingFields);

  return {
    extractedFields: fields,
    missingFields,
    recommendedRoute: route,
    reasoning,
  };
}

// Sample FNOL documents for demo
export const SAMPLE_FNOL_DATA: Record<string, ExtractedFields> = {
  'sample-auto-collision': {
    policyInfo: {
      policyNumber: 'POL-2024-00847',
      policyholderName: 'Sarah Mitchell',
      effectiveDateStart: '2024-01-15',
      effectiveDateEnd: '2025-01-15',
    },
    incidentInfo: {
      date: '2025-11-20',
      time: '14:35',
      location: '5th Avenue & Main Street, Springfield, IL',
      description: 'Rear-end collision at traffic signal. Vehicle was stopped at red light when struck from behind by another vehicle. Moderate damage to rear bumper and trunk.',
    },
    involvedParties: [
      { name: 'Sarah Mitchell', role: 'claimant', contactDetails: 'sarah.mitchell@email.com | (555) 123-4567' },
      { name: 'James Peterson', role: 'third-party', contactDetails: 'j.peterson@email.com | (555) 987-6543' },
    ],
    assetDetails: {
      assetType: 'Vehicle',
      assetId: 'VIN-1HGCM82633A004352',
      estimatedDamage: 8500,
    },
    claimType: 'Auto Collision',
    attachments: ['police_report.pdf', 'photos_damage.zip'],
    initialEstimate: 8500,
  },
  'sample-injury-claim': {
    policyInfo: {
      policyNumber: 'POL-2024-01234',
      policyholderName: 'Michael Chen',
      effectiveDateStart: '2024-03-01',
      effectiveDateEnd: '2025-03-01',
    },
    incidentInfo: {
      date: '2025-12-05',
      time: '09:15',
      location: 'Warehouse B, Industrial Park, Chicago, IL',
      description: 'Workplace slip and fall on wet floor. Employee sustained back injury and was transported to hospital for evaluation.',
    },
    involvedParties: [
      { name: 'Michael Chen', role: 'claimant', contactDetails: 'mchen@company.com | (555) 234-5678' },
    ],
    assetDetails: {
      assetType: 'N/A',
      assetId: null,
      estimatedDamage: 45000,
    },
    claimType: 'Injury',
    attachments: ['medical_report.pdf', 'incident_form.pdf'],
    initialEstimate: 45000,
  },
  'sample-fraud-flag': {
    policyInfo: {
      policyNumber: 'POL-2024-05678',
      policyholderName: 'Robert Davis',
      effectiveDateStart: '2024-06-10',
      effectiveDateEnd: '2025-06-10',
    },
    incidentInfo: {
      date: '2025-10-15',
      time: '23:45',
      location: 'Rural Highway 12, outside Greenfield, IN',
      description: 'Single vehicle incident reported. Circumstances appear inconsistent with physical evidence. Witness accounts suggest staged collision for insurance purposes.',
    },
    involvedParties: [
      { name: 'Robert Davis', role: 'claimant', contactDetails: 'rdavis@email.com | (555) 345-6789' },
    ],
    assetDetails: {
      assetType: 'Vehicle',
      assetId: 'VIN-5YJSA1E26HF000316',
      estimatedDamage: 32000,
    },
    claimType: 'Auto Collision',
    attachments: ['police_report.pdf'],
    initialEstimate: 32000,
  },
  'sample-incomplete': {
    policyInfo: {
      policyNumber: 'POL-2024-09999',
      policyholderName: 'Lisa Wong',
      effectiveDateStart: null,
      effectiveDateEnd: null,
    },
    incidentInfo: {
      date: '2025-12-01',
      time: null,
      location: '742 Elm Street, Portland, OR',
      description: 'Water damage from burst pipe in basement. Flooding affected furniture and electronics.',
    },
    involvedParties: [],
    assetDetails: {
      assetType: 'Property',
      assetId: null,
      estimatedDamage: 15000,
    },
    claimType: 'Property Damage',
    attachments: [],
    initialEstimate: null,
  },
};

export const ROUTE_CONFIG: Record<RouteType, { label: string; color: string; icon: string }> = {
  'fast-track': { label: 'Fast-Track', color: 'success', icon: '⚡' },
  'manual-review': { label: 'Manual Review', color: 'warning', icon: '📋' },
  'investigation': { label: 'Investigation Flag', color: 'investigation', icon: '🔍' },
  'specialist-queue': { label: 'Specialist Queue', color: 'info', icon: '🏥' },
};
