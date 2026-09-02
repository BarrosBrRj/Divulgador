/**
 * Utility to compress and resize images client-side before storing in localStorage or sending over network.
 */
export async function compressAndResizeImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    mimeType?: string;
  } = {}
): Promise<string> {
  const {
    maxWidth = 1000,
    maxHeight = 1000,
    quality = 0.82,
    mimeType = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    // Check if the uploaded file is an image
    if (!file.type.startsWith('image/')) {
      reject(new Error('O arquivo selecionado não é uma imagem válida.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo de imagem.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Falha ao processar a imagem. Formato incompatível.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while bounding within maxWidth & maxHeight
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(width, 1);
        canvas.height = Math.max(height, 1);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Não foi possível inicializar o canvas de renderização.'));
          return;
        }

        // Draw resized image
        ctx.drawImage(img, 0, 0, width, height);

        // Export as compressed dataURL
        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
