import { PokemonType } from '../types';

const ALL_TYPES: PokemonType[] = ['Fire', 'Water', 'Electric', 'Grass', 'Rock', 'Ghost', 'Dragon'];

const typeIcons: Record<PokemonType, string> = {
  Fire: '🔥',
  Water: '💧',
  Electric: '⚡',
  Grass: '🌿',
  Rock: '🪨',
  Ghost: '👻',
  Dragon: '🐉',
};

const typeActive: Record<PokemonType, string> = {
  Fire: 'bg-orange-500/20 border-orange-500/60 text-orange-300',
  Water: 'bg-blue-500/20 border-blue-500/60 text-blue-300',
  Electric: 'bg-yellow-400/20 border-yellow-400/60 text-yellow-300',
  Grass: 'bg-green-500/20 border-green-500/60 text-green-300',
  Rock: 'bg-stone-500/20 border-stone-400/60 text-stone-300',
  Ghost: 'bg-purple-600/20 border-purple-500/60 text-purple-300',
  Dragon: 'bg-cyan-600/20 border-cyan-500/60 text-cyan-300',
};

interface FilterBarProps {
  activeType: PokemonType | null;
  onTypeChange: (type: PokemonType | null) => void;
}

export function FilterBar({ activeType, onTypeChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onTypeChange(null)}
        className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all duration-200 ${
          activeType === null
            ? 'bg-slate-900 text-white border-2 border-orange-500 shadow-[0_4px_15px_rgba(0,0,0,0.6)]'
            : 'bg-slate-900/80 border border-slate-600 text-slate-200 hover:border-slate-400 hover:text-white shadow-md'
        }`}
      >
        All
      </button>
      {ALL_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => onTypeChange(activeType === type ? null : type)}
          className={`px-3 py-1.5 rounded-full text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${
            activeType === type
              ? typeActive[type] + ' shadow-[0_4px_15px_rgba(0,0,0,0.6)]'
              : 'bg-slate-900/80 border border-slate-600 text-slate-200 hover:border-slate-400 hover:text-white shadow-md'
          }`}
        >
          <span>{typeIcons[type]}</span>
          {type}
        </button>
      ))}
    </div>
  );
}
