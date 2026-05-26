/**
 * Fetches JSON data safely by reading response as text first
 * to avoid NUL/encoding issues with certain API endpoints
 */
export async function fetchJsonSafe(url, options) {
  try {
    const response = await fetch(url, options);
    
    // Read response as text to avoid NUL character issues
    const text = await response.text();
    
    // Log for debugging
    console.log(`[fetchJsonSafe] Status: ${response.status}, URL: ${url}`);
    console.log(`[fetchJsonSafe] First 200 chars:`, text.substring(0, 200));
    
    // Parse JSON
    const data = JSON.parse(text);
    return data;
    
  } catch (error) {
    console.error('[fetchJsonSafe] JSON parse error:', error);
    return { 
      error: 'invalid-json', 
      raw: error.text || 'Unable to read response' 
    };
  }
}
