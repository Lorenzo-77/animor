// src/hooks/useProducts.js
import { useState, useEffect } from 'react';
import Papa from 'papaparse';
 
const sheetUrl = "https://docs.google.com/spreadsheets/d/1xMNKOx39UQV9Dc2jEp-qtt2QS0HaIpEqKFRh5EB2ans/export?format=csv&gid=1184847363";

// Función hacker para saltar el bloqueo de Google Drive
const fixGoogleDriveImage = (url) => {
  if (!url) return url;
  
  if (url.includes('drive.google.com')) {
    const idMatch = url.match(/id=([^&]+)/);
    if (idMatch && idMatch[1]) {
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
                
                image: fixGoogleDriveImage(item.image),
                images: item.images 
                  ? String(item.images).split(',').map(img => fixGoogleDriveImage(img.trim())) 
                  : [fixGoogleDriveImage(item.image)],
                  
                // MAGIA ANTI-BUGS: El .trim() elimina los saltos de línea invisibles (\r) de la última columna
                isNew: String(item.isNew).trim().toUpperCase() === 'TRUE' || item.isNew === true || item.isNew === 1,
                isFeatured: String(item.isFeatured).trim().toUpperCase() === 'TRUE' || item.isFeatured === true || item.isFeatured === 1,
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