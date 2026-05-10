const cloudName =
  process.env.REACT_APP_CLOUDINARY_CLOUD_NAME ||
  "dhtrcj8yk";

// Default fallback image hosted on Cloudinary (banana image)
export const DEFAULT_FALLBACK_IMAGE =
  "https://res.cloudinary.com/dhtrcj8yk/image/upload/v1/06_bmhz0b.jpg";

export function cloudinaryImage(publicId, fallbackImage, options = {}) {
  if (!cloudName || !publicId) {
    return fallbackImage || DEFAULT_FALLBACK_IMAGE;
  }

  const {
    width = 700,
    height,
    crop = "fill"
  } = options;

  const transforms = [
    "f_auto",
    "q_auto",
    `c_${crop}`,
    `w_${width}`
  ];

  if (height) {
    transforms.push(`h_${height}`);
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(",")}/${publicId}`;
}

export function setFallbackImage(event, fallbackImage) {
  const target = event.currentTarget;
  const useFallback = fallbackImage || DEFAULT_FALLBACK_IMAGE;
  // Prevent infinite loop if fallback itself fails
  if (target.src === useFallback) {
    return;
  }
  target.src = useFallback;
}
