const MAX_DIMENSION = 800;
const MAX_SOURCE_BYTES = 5 * 1024 * 1024;
const JPEG_QUALITY = 0.8;

export class ImageTooLargeError extends Error {}

export function resizeImageFile(file: File): Promise<string> {
  if (file.size > MAX_SOURCE_BYTES) {
    return Promise.reject(new ImageTooLargeError('الملف أكبر من 5 ميجابايت'));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('تعذر قراءة الملف'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('تعذر تحميل الصورة'));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('تعذر معالجة الصورة'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
