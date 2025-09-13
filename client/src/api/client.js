export async function generateSegments(data) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    body: data,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to generate segments');
  }

  return response.json();
}