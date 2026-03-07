/**
 * API utility for posting grade data to backend
 */

export async function postGrades(formData) {
  try {
    console.log('Sending POST request to http://localhost:8000/grades');
    
    const response = await fetch('http://localhost:8000/grades', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      throw new Error(`Server error (${response.status}): ${errorText || 'Failed to process request'}`);
    }

    const data = await response.json();
    console.log('Received response from backend:', data);
    
    // Validate response format
    if (!data.success) {
      throw new Error(data.message || 'Backend returned unsuccessful response');
    }
    
    if (!data.results || !Array.isArray(data.results)) {
      throw new Error('Invalid response format: missing results array');
    }
    
    console.log(`Successfully processed data for ${data.results.length} student(s)`);
    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('Network error - is the backend server running?');
      throw new Error('Cannot connect to backend server. Make sure it is running at http://localhost:8000');
    }
    console.error('Error posting grades:', error);
    throw error;
  }
}