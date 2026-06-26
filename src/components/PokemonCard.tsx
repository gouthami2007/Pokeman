import { Shield, Sword, Heart, Zap } from 'lucide-react';
import { Pokemon } from '../types';
import { PokemonSprite } from './PokemonSprite';
import { TypeBadge } from './TypeBadge';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: (pokemon: Pokemon) => void;
}

export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  return (
    <div
      onClick={() => onClick(pokemon)}
      className="group relative cursor-pointer rounded-2xl bg-slate-800/70 border border-slate-700/60 hover-holo-plate transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl overflow-hidden"
    >
      {/* glow gradient top accent */}
      <div
        className={`absolute inset-x-0 top-0 h-px ${
          pokemon.type === 'Fire'
            ? 'bg-gradient-to-r from-transparent via-orange-500 to-transparent'
            : pokemon.type === 'Water'
            ? 'bg-gradient-to-r from-transparent via-blue-500 to-transparent'
            : pokemon.type === 'Electric'
            ? 'bg-gradient-to-r from-transparent via-yellow-400 to-transparent'
            : pokemon.type === 'Grass'
            ? 'bg-gradient-to-r from-transparent via-green-500 to-transparent'
            : pokemon.type === 'Rock'
            ? 'bg-gradient-to-r from-transparent via-stone-400 to-transparent'
            : pokemon.type === 'Ghost'
            ? 'bg-gradient-to-r from-transparent via-purple-500 to-transparent'
            : 'bg-gradient-to-r from-transparent via-cyan-500 to-transparent'
        }`}
      />

      {/* sprite area */}
      <div className="relative flex justify-center items-center pt-6 pb-2 bg-slate-900/40">
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <div
            className={`absolute inset-0 ${
              pokemon.type === 'Fire'
                ? 'bg-gradient-radial from-orange-500'
                : pokemon.type === 'Water'
                ? 'bg-gradient-radial from-blue-500'
                : pokemon.type === 'Electric'
                ? 'bg-gradient-radial from-yellow-400'
                : pokemon.type === 'Grass'
                ? 'bg-gradient-radial from-green-500'
                : pokemon.type === 'Rock'
                ? 'bg-gradient-radial from-stone-400'
                : pokemon.type === 'Ghost'
                ? 'bg-gradient-radial from-purple-500'
                : 'bg-gradient-radial from-cyan-500'
            } to-transparent`}
          />
        </div>
        <PokemonSprite
          spriteId={pokemon.spriteId}
          name={pokemon.name}
          className="w-28 h-28 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-300 z-10 relative"
          loading="lazy"
        />
        <span className="absolute top-3 right-3 text-xs font-bold text-slate-500 tabular-nums">
          #{String(pokemon.spriteId).padStart(3, '0')}
        </span>
      </div>

      {/* info area */}
      <div className="px-4 pb-4 pt-2 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-slate-100 leading-tight">{pokemon.name}</h3>
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            <TypeBadge type={pokemon.type} />
            {pokemon.secondaryType && <TypeBadge type={pokemon.secondaryType} />}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Stat icon={<Heart size={12} className="text-red-400" />} label="HP" value={pokemon.hp} />
          <Stat icon={<Sword size={12} className="text-orange-400" />} label="ATK" value={pokemon.attack} />
          <Stat icon={<Shield size={12} className="text-blue-400" />} label="DEF" value={pokemon.defense} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Zap size={12} className="text-yellow-400" />
            <span className="text-xs text-slate-400">Level</span>
            <span className="text-xs font-bold text-slate-200">{pokemon.level}</span>
          </div>
          <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">View details →</span>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex flex-col items-center bg-slate-900/50 rounded-lg py-2 gap-0.5">
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-sm font-bold text-slate-200">{value}</span>
    </div>
  );
}
