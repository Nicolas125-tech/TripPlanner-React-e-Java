export const generateAvatar = (name) => {
  const safeName = name || "Visitante";
  // Handle surrogate pairs properly (e.g. for emojis)
  const initial = Array.from(safeName)[0].toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <rect width="100" height="100" fill="#2563eb" />
    <text x="50%" y="50%" font-family="Arial" font-size="40" fill="#ffffff" dominant-baseline="central" text-anchor="middle">${initial}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
