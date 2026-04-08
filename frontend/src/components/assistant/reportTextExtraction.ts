const PDFJS_VERSION = '3.4.120';
const WORKER_CDN = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.js`;
const CMAP_URL = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/cmaps/`;

let pdfjsLib: any = null;

async function getPdfjs() {
  if (pdfjsLib) return pdfjsLib;
  
  try {
    // 1. Primary: Use bundled pdfjs-dist (Works on Web & APK)
    pdfjsLib = await import('pdfjs-dist');
    
    if (pdfjsLib.GlobalWorkerOptions) {
      try {
        // @ts-ignore - Dynamic worker entry for bundling
        const worker = await import('pdfjs-dist/build/pdf.worker.entry');
        pdfjsLib.GlobalWorkerOptions.workerSrc = worker;
      } catch (workerError) {
        console.warn("[Goku PDF] Local worker failed, using CDN.", workerError);
        pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_CDN;
      }
    }
  } catch (e) {
    console.warn("[Goku PDF] Bundled import failed, falling back to CDN ESM...", e);
    try {
      // 2. Secondary: Fallback to direct CDN for legacy environments
      pdfjsLib = await import(/* @vite-ignore */ `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/+esm`);
      if (pdfjsLib.GlobalWorkerOptions) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_CDN;
      }
    } catch (cdnError) {
      console.error("[Goku PDF] CRITICAL: PDF engine unavailable.", cdnError);
      throw new Error("Unable to initialize PDF clinical scanner.");
    }
  }
  
  return pdfjsLib;
}

export interface TextExtractionResult {
  success: boolean;
  text?: string;
  error?: string;
}

/**
 * Extracts text from a PDF file using the clinical PDFjs engine.
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const pdfjs = await getPdfjs();
    
    const loadingTask = pdfjs.getDocument({
      url: URL.createObjectURL(file),
      cMapUrl: CMAP_URL,
      cMapPacked: true
    });
    
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => (item as any).str)
        .join(' ');
      fullText += pageText + '\n\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('PDF text extraction failed:', error);
    throw new Error('PDF parsing failed. Please ensure the document is not password-protected.');
  }
}

/**
 * Core text extraction from binary bytes.
 */
export async function extractTextFromBytes(
  bytes: Uint8Array
): Promise<TextExtractionResult> {
  try {
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const text = decoder.decode(bytes);

    if (isValidText(text)) {
      return {
        success: true,
        text: text.trim(),
      };
    }

    return {
      success: false,
      error: 'invalid-text',
    };
  } catch (error) {
    console.error('Text extraction error:', error);
    return {
      success: false,
      error: 'extraction-failed',
    };
  }
}

/**
 * Validates if the string is likely printable clinical text.
 */
export function isValidText(text: string): boolean {
  if (!text || text.length === 0) return false;

  let controlCharCount = 0;
  const sampleSize = Math.min(text.length, 1000);

  for (let i = 0; i < sampleSize; i++) {
    const code = text.charCodeAt(i);
    if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
      controlCharCount++;
    }
  }

  const controlRatio = controlCharCount / sampleSize;
  return controlRatio < 0.1;
}
