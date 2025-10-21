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
  "Description de la catégorie": string;
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
  let current = "";
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
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Décodage UTF‑8 strict + retrait BOM éventuel (sans repli CP‑1252)
function decodeUtf8(buffer: ArrayBuffer): string {
  const text = new TextDecoder("utf-8").decode(buffer);
  // Retire le BOM (U+FEFF) s'il est présent en tête
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

// Détection simple d'artefacts d'encodage (mojibake) pour aide au diagnostic
function hasMojibake(s: string): boolean {
  return /Ã.|â€™|Â…|Â |â€œ|â€/.test(s);
}

export async function parseCSV<T>(filePath: string): Promise<T[]> {
  try {
    // Forcer un fetch frais pour éviter le cache
    const cacheBuster = `?t=${Date.now()}`;
    const response = await fetch(filePath + cacheBuster, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
    });

    const buffer = await response.arrayBuffer();
    const textRaw = decodeUtf8(buffer);
    const text = textRaw.replace(/\r\n?/g, "\n");

    if (hasMojibake(text)) {
      // Avertissement non bloquant: indique un probable mauvais encodage source
      // (les CSV doivent être UTF‑8 sans BOM selon Q3.8)
      console.warn(`[csvParser] Encodage suspect détecté dans ${filePath}. Vérifie que le fichier source est bien en UTF‑8 sans BOM.`);
    }

    const lines = text.split("\n").filter((line) => line.trim());
    if (lines.length === 0) return [];

    // En-têtes: utilisés tels quels (pas de normalisation)
    const headers = parseCSVLine(lines[0]).map((h) => h.trim());

    const data: T[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] ? values[index].trim() : "";
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
  return parseCSV<Opportunity>("/data/opp_id.csv");
}

export async function loadCategories(): Promise<Category[]> {
  return parseCSV<Category>("/data/cat_id.csv");
}

export async function loadOpportunityCategories(): Promise<OpportunityCategory[]> {
  return parseCSV<OpportunityCategory>("/data/opp_cat.csv");
}

export function getOpportunitiesByCategory(
  opportunities: Opportunity[],
  oppCats: OpportunityCategory[],
  categoryId: string
): Opportunity[] {
  const oppIds = oppCats.filter((oc) => oc.cat_ID === categoryId).map((oc) => oc.opp_ID);
  return opportunities.filter((opp) => oppIds.includes(opp._ID));
}

export function searchOpportunities(
  opportunities: Opportunity[],
  searchTerm: string
): Opportunity[] {
  const term = searchTerm.toLowerCase();
  return opportunities.filter(
    (opp) =>
      opp.Opportunité.toLowerCase().includes(term) ||
      opp["Description de l'opportunité"].toLowerCase().includes(term)
  );
}
