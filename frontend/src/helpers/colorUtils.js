const hslToHex = (h, s, l) => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const generateRandomColor = () => {
    const h = Math.floor(Math.random() * 360); // Hue: 0 to 360
    const s = Math.floor(Math.random() * 30) + 45; // Saturation: 40% to 70%
    const l = Math.floor(Math.random() * 10) + 50; // Lightness: 60% to 80%
    return hslToHex(h, s, l);
};


export {
    hslToHex,
    generateRandomColor
}