// src/hooks/useProducts.js
import { useState, useEffect } from 'react';
import Papa from 'papaparse';

const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQZfUZS0IdRbBX8FB0RWmFmlagUv9i2EfQaDXfQoXA010TTxJSJSjmwlQfcpzJceArBz0KmmoYUqixK/pub?output=csv";

// 👇 Función hacker para saltar el bloqueo de Google Drive 👇
const fixGoogleDriveImage = (url) => {
  if (!url) return url;
  
  // Si detecta que es de Google Drive, le extrae el ID
  if (url.includes('drive.google.com')) {
    const idMatch = url.match(/id=([^&]+)/);
    if (idMatch && idMatch[1]) {
      // Usamos el endpoint secreto "thumbnail" con sz=w1000 (ancho de 1000px)
      return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
    }
  }
  
  return url;
};

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        Papa.parse(sheetUrl, {
          download: true,
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (results) => {
            const validProducts = results.data
              .filter(item => item.id && item.title)
              .map(item => ({
                ...item,
                sizes: item.sizes ? String(item.sizes).split(',').map(s => s.trim()) : null,
                colors: item.colors ? String(item.colors).split(',').map(c => c.trim()) : null,
                
                // Pasa la imagen por nuestra nueva función mágica
                image: fixGoogleDriveImage(item.image),
                images: item.images 
                  ? String(item.images).split(',').map(img => fixGoogleDriveImage(img.trim())) 
                  : [fixGoogleDriveImage(item.image)],
                  
                isNew: item.isNew === 'TRUE' || item.isNew === true || item.isNew === 1,
              }));

            setProducts(validProducts);
            setLoading(false);
          },
          error: (err) => {
            console.error("Error leyendo el CSV:", err);
            setError(err.message);
            setLoading(false);
          }
        });
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};