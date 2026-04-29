const PAIRS = [
  { from: "#1d4ed8", to: "#1e3a8a" },
  { from: "#7c3aed", to: "#4c1d95" },
  { from: "#059669", to: "#065f46" },
  { from: "#dc2626", to: "#7f1d1d" },
  { from: "#d97706", to: "#78350f" },
  { from: "#0891b2", to: "#164e63" },
  { from: "#4f46e5", to: "#312e81" },
  { from: "#0d9488", to: "#134e4a" },
];

export function colorFromName(name: string): { from: string; to: string } {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PAIRS[Math.abs(hash) % PAIRS.length];
}
