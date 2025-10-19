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
    
    if (char === '"') {
      inQuotes = !inQuotes;
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
    const response = await fetch(filePath);
    const text = await response.text();
    const lines = text.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) return [];
    
    const headers = parseCSVLine(lines[0]).map(h => h.trim());
    const data: T[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const obj: any = {};
      
      headers.forEach((header, index) => {
        obj[header] = values[index] || '';
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