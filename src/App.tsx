import { useState, useMemo } from 'react';
import { Search, Layers, SlidersHorizontal } from 'lucide-react';
import { pokemonData } from './data/pokemon';
import { Pokemon, PokemonType } from './types';
import { PokemonCard } from './components/PokemonCard';
import { PokemonDetail } from './components/PokemonDetail';
import { FilterBar } from './components/FilterBar';

const SORT_OPTIONS = [
  { label: 'Name', value: 'name' },
  { label: 'Level', value: 'level' },
  { label: 'HP', value: 'hp' },
  { label: 'Attack', value: 'attack' },
  { label: 'Defense', value: 'defense' },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]['value'];

export default function App() {
  const [selected, setSelected] = useState<Pokemon | null>(null);
  const [activeType, setActiveType] = useState<PokemonType | null>(null);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [showSort, setShowSort] = useState(false);

  // Generate random fire particles
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 30 + 10}px`,
      height: `${Math.random() * 30 + 10}px`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 2}s`,
    }));
  }, []);

  const filtered = useMemo(() => {
    return pokemonData
      .filter((p) => {
        const matchType = activeType ? p.type === activeType || p.secondaryType === activeType : true;
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchType && matchSearch;
      })
      .sort((a, b) => {
        if (sortKey === 'name') return a.name.localeCompare(b.name);
        return b[sortKey] - a[sortKey];
      });
  }, [activeType, search, sortKey]);

  return (
    <div 
      className="min-h-screen text-slate-100 relative overflow-hidden bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url('/images/pokemon_bg.jpeg')` }}
    >
      {/* 50% Dark Overlay (50% clarity) */}
      <div className="fixed inset-0 bg-black/50 z-0 pointer-events-none" />

      {/* Fire Effects */}
      <div className="fire-glow pointer-events-none" />
      {particles.map((p) => (
        <div
          key={p.id}
          className="fire-particle pointer-events-none"
          style={{
            left: p.left,
            width: p.width,
            height: p.height,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
          }}
        />
      ))}

      {/* Removed noise texture to keep background clear */}

      <div className="relative z-10">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/40 bg-slate-950/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-900/40">
              <div className="w-4 h-4 rounded-full bg-white border-2 border-slate-900" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-50 leading-none">
                Pokemon Nexus
              </h1>
              <p className="text-[11px] text-slate-500 mt-0.5">Nexus & Details</p>
            </div>
          </div>

          <div className="flex-1 max-w-sm relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search Pokémon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:bg-slate-800 transition-colors"
            />
          </div>

          <div className="relative shrink-0">
            <button
              onClick={() => setShowSort((s) => !s)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold border-2 border-orange-500 shadow-[0_4px_15px_rgba(0,0,0,0.6)] transition-all"
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">Sort: {SORT_OPTIONS.find((o) => o.value === sortKey)?.label}</span>
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortKey(opt.value); setShowSort(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      sortKey === opt.value
                        ? 'bg-slate-700 text-slate-100 font-semibold'
                        : 'text-slate-400 hover:bg-slate-700/60 hover:text-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-2">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            Pokémon Nexus
          </h2>
          <p className="text-slate-500 text-base">
            {pokemonData.length} Pokémon across {7} types — click any card to view details
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold uppercase tracking-widest">
            <Layers size={12} />
            Filter by type
          </div>
          <FilterBar activeType={activeType} onTypeChange={setActiveType} />
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="text-slate-300 font-semibold">{filtered.length}</span> Pokémon
          </p>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((p) => (
              <PokemonCard key={p.id} pokemon={p} onClick={setSelected} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
            <span className="text-6xl">🔍</span>
            <p className="text-xl font-bold text-slate-400">No Pokémon found</p>
            <p className="text-slate-600 text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      {/* Detail modal */}
      {selected && (
        <PokemonDetail pokemon={selected} onClose={() => setSelected(null)} />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/60 mt-16 py-6 text-center text-xs text-slate-600">
        PokéDex Nexus System · Sprites via PokéAPI
      </footer>
      </div>
    </div>
  );
}
