import { PokemonType } from '../types';

const typeConfig: Record<PokemonType, { bg: string; text: string; border: string; icon: string }> = {
  Fire: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/40', icon: '🔥' },
  Water: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/40', icon: '💧' },
  Electric: { bg: 'bg-yellow-400/20', text: 'text-yellow-300', border: 'border-yellow-400/40', icon: '⚡' },
  Grass: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/40', icon: '🌿' },
  Rock: { bg: 'bg-stone-500/20', text: 'text-stone-300', border: 'border-stone-500/40', icon: '🪨' },
  Ghost: { bg: 'bg-purple-600/20', text: 'text-purple-400', border: 'border-purple-600/40', icon: '👻' },
  Dragon: { bg: 'bg-cyan-600/20', text: 'text-cyan-400', border: 'border-cyan-600/40', icon: '🐉' },
};

interface TypeBadgeProps {
  type: PokemonType;
  size?: 'sm' | 'md';
}

export function TypeBadge({ type, size = 'sm' }: TypeBadgeProps) {
  const config = typeConfig[type];
  const padding = size === 'md' ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold border ${config.bg} ${config.text} ${config.border} ${padding}`}
    >
      <span>{config.icon}</span>
      {type}
    </span>
  );
}

export { typeConfig };
