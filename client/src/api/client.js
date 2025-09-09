export async function generateSegments(data) {
  console.log('[API Client] Calling /api/generate with:', data);
  
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  console.log('[API Client] Response status:', response.status);
  
  if (!response.ok) {
    const error = await response.json();
    console.error('[API Client] Error response:', error);
    throw new Error(error.message || 'Failed to generate segments');
  }
  
  const result = await response.json();
  console.log('[API Client] Success response:', result);
  return result;
}