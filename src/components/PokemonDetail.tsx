import { useEffect } from 'react';
import { ArrowLeft, Shield, Sword, Heart, Star } from 'lucide-react';
import { Pokemon } from '../types';
import { PokemonSprite } from './PokemonSprite';
import { TypeBadge } from './TypeBadge';
import { StatBar } from './StatBar';

interface PokemonDetailProps {
  pokemon: Pokemon;
  onClose: () => void;
}

const MAX_STAT = 160;

const typeGlow: Record<string, string> = {
  Fire: 'shadow-orange-500/30',
  Water: 'shadow-blue-500/30',
  Electric: 'shadow-yellow-400/30',
  Grass: 'shadow-green-500/30',
  Rock: 'shadow-stone-400/30',
  Ghost: 'shadow-purple-500/30',
  Dragon: 'shadow-cyan-500/30',
};

const typeBgAccent: Record<string, string> = {
  Fire: 'from-orange-900/30',
  Water: 'from-blue-900/30',
  Electric: 'from-yellow-800/30',
  Grass: 'from-green-900/30',
  Rock: 'from-stone-800/30',
  Ghost: 'from-purple-900/30',
  Dragon: 'from-cyan-900/30',
};

const statBarColors: Record<string, string> = {
  hp: 'bg-gradient-to-r from-red-500 to-rose-400',
  attack: 'bg-gradient-to-r from-orange-500 to-amber-400',
  defense: 'bg-gradient-to-r from-blue-500 to-sky-400',
};

export function PokemonDetail({ pokemon, onClose }: PokemonDetailProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const glow = typeGlow[pokemon.type] ?? '';
  const bgAccent = typeBgAccent[pokemon.type] ?? '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* panel — flex column, capped at 92vh so it always fits */}
      <div
        className={`relative w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-700/60 shadow-2xl ${glow} flex flex-col max-h-[92vh]`}
      >
        {/* sticky top nav — never scrolls away */}
        <div className="flex items-center px-4 pt-4 pb-2 shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-600 text-slate-400 hover:text-slate-100 transition-all duration-200 text-sm font-medium"
            aria-label="Back to nexus"
          >
            <ArrowLeft size={15} />
            Back to Nexus
          </button>
        </div>

        {/* scrollable body */}
        <div className="overflow-y-auto flex-1 rounded-b-3xl">
          {/* art area */}
          <div className={`relative bg-gradient-to-b ${bgAccent} to-slate-900 px-8 pt-2 pb-3 flex flex-col items-center`}>
            <span className="text-slate-500 text-xs font-bold mb-1">
              #{String(pokemon.spriteId).padStart(3, '0')}
            </span>
            <PokemonSprite
              spriteId={pokemon.spriteId}
              name={pokemon.name}
              className="w-32 h-32 object-contain drop-shadow-2xl transition-all duration-300"
            />
          </div>

          {/* content */}
          <div className="px-6 pb-6 pt-3 space-y-4">
            {/* name + type */}
            <div>
              <h2 className="text-2xl font-extrabold text-slate-50 tracking-tight">{pokemon.name}</h2>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                <TypeBadge type={pokemon.type} size="md" />
                {pokemon.secondaryType && <TypeBadge type={pokemon.secondaryType} size="md" />}
              </div>
            </div>

            {/* description + level in one row */}
            <div className="flex items-start gap-3">
              <p className="text-slate-400 text-sm leading-relaxed flex-1">{pokemon.description}</p>
              <div className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/60 rounded-full px-3 py-1.5 shrink-0">
                <Star size={12} className="text-yellow-400" fill="currentColor" />
                <span className="text-xs text-slate-400 font-medium">Lv.</span>
                <span className="text-xs font-bold text-slate-100">{pokemon.level}</span>
              </div>
            </div>

            {/* stat bars */}
            <div className="space-y-2.5 bg-slate-800/40 rounded-2xl p-4 border border-slate-700/40">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Base Stats</h3>
              <StatBar label="HP" value={pokemon.hp} max={MAX_STAT} color={statBarColors.hp} />
              <StatBar label="Attack" value={pokemon.attack} max={MAX_STAT} color={statBarColors.attack} />
              <StatBar label="Defense" value={pokemon.defense} max={MAX_STAT} color={statBarColors.defense} />
            </div>

            {/* quick stat cards */}
            <div className="grid grid-cols-3 gap-3">
              <QuickStat icon={<Heart size={15} className="text-red-400" />} value={pokemon.hp} sub="Health Points" />
              <QuickStat icon={<Sword size={15} className="text-orange-400" />} value={pokemon.attack} sub="Attack Power" />
              <QuickStat icon={<Shield size={15} className="text-blue-400" />} value={pokemon.defense} sub="Defense" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStat({ icon, value, sub }: { icon: React.ReactNode; value: number; sub: string }) {
  return (
    <div className="flex flex-col items-center bg-slate-800/60 border border-slate-700/40 rounded-xl py-3 gap-1">
      {icon}
      <span className="text-base font-extrabold text-slate-100">{value}</span>
      <span className="text-[10px] text-slate-500 text-center leading-tight">{sub}</span>
    </div>
  );
}
