// Local deterministic text extraction from report files

export interface TextExtractionResult {
  success: boolean;
  text?: string;
  error?: string;
}

/**
 * Attempts to extract text from file bytes.
 * Only works for plain text-like formats.
 */
export async function extractTextFromBytes(
  bytes: Uint8Array,
  filename: string,
  contentType?: string
): Promise<TextExtractionResult> {
  try {
    // Check if it's likely a text-based format
    const isTextFormat = isLikelyTextFile(filename, contentType);
    
    if (!isTextFormat) {
      return {
        success: false,
        error: 'binary-format',
      };
    }

    // Try to decode as UTF-8
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const text = decoder.decode(bytes);

    // Check if the decoded text looks reasonable (not binary garbage)
    if (!isValidText(text)) {
      return {
        success: false,
        error: 'invalid-text',
      };
    }

    return {
      success: true,
      text: text.trim(),
    };
  } catch (error) {
    console.error('Text extraction error:', error);
    return {
      success: false,
      error: 'extraction-failed',
    };
  }
}

function isLikelyTextFile(filename: string, contentType?: string): boolean {
  const textExtensions = ['.txt', '.text', '.log', '.csv', '.json', '.xml', '.html', '.md'];
  const textContentTypes = ['text/', 'application/json', 'application/xml'];

  // Check file extension
  const lowerFilename = filename.toLowerCase();
  if (textExtensions.some(ext => lowerFilename.endsWith(ext))) {
    return true;
  }

  // Check content type
  if (contentType) {
    const lowerContentType = contentType.toLowerCase();
    if (textContentTypes.some(type => lowerContentType.startsWith(type))) {
      return true;
    }
  }

  return false;
}

function isValidText(text: string): boolean {
  if (!text || text.length === 0) {
    return false;
  }

  // Check for excessive binary/control characters
  let controlCharCount = 0;
  const sampleSize = Math.min(text.length, 1000);
  
  for (let i = 0; i < sampleSize; i++) {
    const code = text.charCodeAt(i);
    // Count non-printable characters (excluding common whitespace)
    if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
      controlCharCount++;
    }
  }

  // If more than 10% are control characters, likely binary
  const controlRatio = controlCharCount / sampleSize;
  return controlRatio < 0.1;
