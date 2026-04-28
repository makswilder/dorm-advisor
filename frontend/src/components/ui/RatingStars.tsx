import { Star } from "lucide-react";

interface Props {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
}

export function RatingStars({ value, max = 5, size = "md" }: Props) {
  const sizeClass = size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-6 h-6" : "w-4.5 h-4.5";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${i < Math.round(value) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`}
        />
      ))}
    </div>
  );
}
