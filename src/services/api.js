const API_URL = "http://localhost:4000"; // Importante colocar la url de tu api

export const api = {
  get: async (endpoint) => {
    try {
      const fullUrl = `${API_URL}${endpoint}`;
      console.log("Conectando a:", fullUrl);
      
      const response = await fetch(fullUrl);
      
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
      
      return { data };
    } catch (error) {
      console.error("Error en GET:", error);
      throw error;
    }
  },

  
  post: async (endpoint, body) => {
    try {
      const fullUrl = `${API_URL}${endpoint}`;
      console.log("POST a:", fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
      
      return { data };
    } catch (error) {
      console.error("Error en POST:", error);
      throw error;
    }
  }
  
};