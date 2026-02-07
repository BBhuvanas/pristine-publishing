import { ExtractedFields } from './claimsProcessor';

/**
 * Extract text from a PDF file using pdfjs-dist
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  
  // Set worker source
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  const textParts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join(' ');
    textParts.push(pageText);
  }

  return textParts.join('\n\n');
}

/**
 * Extract text from a TXT file
 */
export async function extractTextFromTXT(file: File): Promise<string> {
  return await file.text();
}

/**
 * Extract text from an uploaded file (PDF or TXT)
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.toLowerCase().split('.').pop();
  
  if (extension === 'pdf') {
    return extractTextFromPDF(file);
  } else if (extension === 'txt' || extension === 'text') {
    return extractTextFromTXT(file);
  }
  
  throw new Error(`Unsupported file type: .${extension}. Please upload a PDF or TXT file.`);
}

/**
 * Parse extracted text to find FNOL fields using pattern matching
 */
export function parseFNOLFields(text: string): ExtractedFields {
  const normalized = text.replace(/\s+/g, ' ');

  return {
    policyInfo: {
      policyNumber: matchPattern(normalized, [
        /policy\s*(?:number|no|#|id)[:\s]*([A-Z0-9][\w-]{3,20})/i,
        /POL-\d{4}-\d{3,6}/,
      ]),
      policyholderName: matchPattern(normalized, [
        /policy\s*holder(?:\s*name)?[:\s]*([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/i,
        /insured(?:\s*name)?[:\s]*([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/i,
        /claimant(?:\s*name)?[:\s]*([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/i,
        /name[:\s]*([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/i,
      ]),
      effectiveDateStart: matchPattern(normalized, [
        /effective\s*(?:from|start|date)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
        /effective\s*(?:from|start|date)[:\s]*(\d{4}-\d{2}-\d{2})/i,
        /coverage\s*(?:from|start)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
      ]),
      effectiveDateEnd: matchPattern(normalized, [
        /effective\s*(?:to|end|through|until)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
        /effective\s*(?:to|end|through|until)[:\s]*(\d{4}-\d{2}-\d{2})/i,
        /expir(?:ation|es|y)\s*(?:date)?[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
      ]),
    },
    incidentInfo: {
      date: matchPattern(normalized, [
        /(?:incident|loss|accident|occurrence)\s*date[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
        /(?:incident|loss|accident|occurrence)\s*date[:\s]*(\d{4}-\d{2}-\d{2})/i,
        /date\s*of\s*(?:incident|loss|accident|occurrence)[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
        /date\s*of\s*(?:incident|loss|accident|occurrence)[:\s]*(\d{4}-\d{2}-\d{2})/i,
      ]),
      time: matchPattern(normalized, [
        /(?:incident|loss|accident|occurrence)\s*time[:\s]*(\d{1,2}:\d{2}(?:\s*[APap][Mm])?)/i,
        /time\s*of\s*(?:incident|loss|accident)[:\s]*(\d{1,2}:\d{2}(?:\s*[APap][Mm])?)/i,
        /time[:\s]*(\d{1,2}:\d{2}(?:\s*[APap][Mm])?)/i,
      ]),
      location: matchPattern(normalized, [
        /(?:incident|loss|accident)\s*location[:\s]*(.{10,100}?)(?=\s*(?:description|claim|type|damage|date|time|$))/i,
        /location\s*of\s*(?:incident|loss|accident)[:\s]*(.{10,100}?)(?=\s*(?:description|claim|type|damage|date|time|$))/i,
        /location[:\s]*(.{10,80}?)(?=\s*(?:description|claim|type|damage|date|time|$))/i,
      ]),
      description: matchPattern(normalized, [
        /(?:incident\s*)?description[:\s]*(.{20,500}?)(?=\s*(?:claim\s*type|asset|estimated|involved|parties|attachments|$))/i,
        /description\s*of\s*(?:incident|loss|accident|damage)[:\s]*(.{20,500}?)(?=\s*(?:claim\s*type|asset|estimated|involved|parties|attachments|$))/i,
      ]),
    },
    involvedParties: parseInvolvedParties(normalized),
    assetDetails: {
      assetType: matchPattern(normalized, [
        /asset\s*type[:\s]*(vehicle|property|equipment|n\/a)/i,
        /type\s*of\s*asset[:\s]*(vehicle|property|equipment)/i,
      ]),
      assetId: matchPattern(normalized, [
        /asset\s*id[:\s]*([A-Z0-9][\w-]{3,30})/i,
        /vin[:\s#]*([A-Z0-9]{17})/i,
        /VIN-([A-Z0-9]{17})/,
        /vehicle\s*id[:\s]*([A-Z0-9][\w-]{3,30})/i,
      ]),
      estimatedDamage: parseAmount(normalized, [
        /estimated\s*damage[:\s]*\$?([\d,]+(?:\.\d{2})?)/i,
        /damage\s*estimate[:\s]*\$?([\d,]+(?:\.\d{2})?)/i,
      ]),
    },
    claimType: matchPattern(normalized, [
      /claim\s*type[:\s]*(auto\s*collision|property\s*damage|injury|personal\s*injury|theft|natural\s*disaster|fire|flood|liability)/i,
      /type\s*of\s*claim[:\s]*(auto\s*collision|property\s*damage|injury|personal\s*injury|theft|natural\s*disaster|fire|flood|liability)/i,
    ]),
    attachments: parseAttachments(normalized),
    initialEstimate: parseAmount(normalized, [
      /initial\s*estimate[:\s]*\$?([\d,]+(?:\.\d{2})?)/i,
      /estimated\s*(?:total|cost|amount)[:\s]*\$?([\d,]+(?:\.\d{2})?)/i,
      /total\s*estimate[:\s]*\$?([\d,]+(?:\.\d{2})?)/i,
    ]),
  };
}

function matchPattern(text: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
    if (match && match[0]) {
      return match[0].trim();
    }
  }
  return null;
}

function parseAmount(text: string, patterns: RegExp[]): number | null {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const num = Number(match[1].replace(/,/g, ''));
      if (!isNaN(num)) return num;
    }
  }
  return null;
}

function parseInvolvedParties(text: string): ExtractedFields['involvedParties'] {
  const parties: ExtractedFields['involvedParties'] = [];

  // Try to find claimant
  const claimantMatch = text.match(/claimant(?:\s*name)?[:\s]*([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/i);
  if (claimantMatch) {
    const contactMatch = text.match(new RegExp(claimantMatch[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[^]*?(?:contact|email|phone|tel)[:\\s]*([\\w.@+\\-()\\s]{5,60})', 'i'));
    parties.push({
      name: claimantMatch[1].trim(),
      role: 'claimant',
      contactDetails: contactMatch ? contactMatch[1].trim() : null,
    });
  }

  // Try to find third party
  const thirdPartyMatch = text.match(/third\s*party(?:\s*name)?[:\s]*([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/i);
  if (thirdPartyMatch) {
    const contactMatch = text.match(new RegExp(thirdPartyMatch[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[^]*?(?:contact|email|phone|tel)[:\\s]*([\\w.@+\\-()\\s]{5,60})', 'i'));
    parties.push({
      name: thirdPartyMatch[1].trim(),
      role: 'third-party',
      contactDetails: contactMatch ? contactMatch[1].trim() : null,
    });
  }

  return parties;
}

function parseAttachments(text: string): string[] {
  const attachments: string[] = [];
  const pattern = /[\w-]+\.(?:pdf|jpg|jpeg|png|zip|doc|docx|xls|xlsx)/gi;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    if (!attachments.includes(match[0])) {
      attachments.push(match[0]);
    }
  }
  return attachments;
}
