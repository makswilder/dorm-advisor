interface Props {
  label: string;
  value: number | null;
  max?: number;
}

export function SubRatingBar({ label, value, max = 5 }: Props) {
  if (value === null) return null;
  const pct = Math.min((value / max) * 100, 100);
  const color =
    pct >= 70 ? "bg-green-500" : pct >= 45 ? "bg-yellow-400" : "bg-red-400";

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-28 text-gray-500 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-right font-semibold text-gray-700">{value.toFixed(1)}</span>
    </div>
  );
}
