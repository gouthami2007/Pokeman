interface StatBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
}

export function StatBar({ label, value, max, color }: StatBarProps) {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
        <span className="text-sm font-bold text-slate-200">{value}</span>
      </div>
      <div className="h-2 bg-slate-700/60 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
