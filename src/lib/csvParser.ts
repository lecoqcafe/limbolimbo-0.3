export interface Opportunity {
  opp_ID: string;
  Opportunité: string;
  Image: string;
  "Description de l'opportunité": string;
  "Lien d'affiliation": string;
}

export interface Category {
  cat_ID: string;
  Catégorie: string;
  Icone: string;
  'Description de la catégorie': string;
}

export interface OpportunityCategory {
  opp_cat_ID: string;
  Opportunités: string;
  opp_ID: string;
  Catégorie: string;
  cat_ID: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Double quote escape
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

export async function parseCSV<T>(filePath: string): Promise<T[]> {
  try {
    // Add timestamp to force fresh fetch and bypass cache
    const cacheBuster = `?t=${Date.now()}`;
    const response = await fetch(filePath + cacheBuster, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    const buffer = await response.arrayBuffer();
    
    // Try windows-1252 first (for opp_id.csv and opp_cat.csv)
    // Then fallback to UTF-8 if it doesn't look right
    let text: string;
    try {
      const decoder = new TextDecoder('windows-1252');
      text = decoder.decode(buffer);
      
      // If we see valid UTF-8 patterns, re-decode as UTF-8
      // Check if it's actually UTF-8 by looking for cat_id.csv pattern
      if (filePath.includes('cat_id.csv')) {
        const utf8Decoder = new TextDecoder('utf-8');
        text = utf8Decoder.decode(buffer);
      }
    } catch {
      // Fallback to UTF-8
      const utf8Decoder = new TextDecoder('utf-8');
      text = utf8Decoder.decode(buffer);
    }
    
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) return [];
    
    // Parse headers and normalize them
    const rawHeaders = parseCSVLine(lines[0]).map(h => h.trim());
    const headers = rawHeaders.map(h => {
      // Normalize common CSV header variations caused by encoding issues
      if (h.includes('Opportunit') && h.length < 15) return 'Opportunité';
      if (h.includes('Description') && h.includes('opportunit')) return "Description de l'opportunité";
      if (h.includes('affiliation')) return "Lien d'affiliation";
      if (h.includes('cat') && h.includes('gorie') && h.length < 15) return 'Catégorie';
      if (h.includes('Description') && h.includes('cat')) return 'Description de la catégorie';
      return h;
    });
    
    const data: T[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const obj: any = {};
      
      headers.forEach((header, index) => {
        obj[header] = values[index] ? values[index].trim() : '';
      });
      
      data.push(obj as T);
    }
    
    return data;
  } catch (error) {
    console.error(`Error parsing CSV from ${filePath}:`, error);
    return [];
  }
}

export async function loadOpportunities(): Promise<Opportunity[]> {
  return parseCSV<Opportunity>('/data/opp_id.csv');
}

export async function loadCategories(): Promise<Category[]> {
  return parseCSV<Category>('/data/cat_id.csv');
}

export async function loadOpportunityCategories(): Promise<OpportunityCategory[]> {
  return parseCSV<OpportunityCategory>('/data/opp_cat.csv');
}

export function getOpportunitiesByCategory(
  opportunities: Opportunity[],
  oppCats: OpportunityCategory[],
  categoryId: string
): Opportunity[] {
  const oppIds = oppCats
    .filter(oc => oc.cat_ID === categoryId)
    .map(oc => oc.opp_ID);
  
  return opportunities.filter(opp => oppIds.includes(opp.opp_ID));
}

export function searchOpportunities(
  opportunities: Opportunity[],
  searchTerm: string
): Opportunity[] {
  const term = searchTerm.toLowerCase();
  return opportunities.filter(opp => 
    opp.Opportunité.toLowerCase().includes(term) ||
    opp["Description de l'opportunité"].toLowerCase().includes(term)
  );
}