import React from 'react';
import { Search, Gamepad2, Bookmark, Plus, FileCode2, Sparkles, X } from 'lucide-react';
import { CATEGORIES } from '../types';

export const Header = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  showFavoritesOnly,
  onToggleFavorites,
  favoriteCount,
  totalGamesCount,
  filteredCount,
  onOpenAddModal,
  onOpenJsonModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/90 shadow-lg shadow-black/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Top bar: Brand + Search + Action Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          
          {/* Brand Logo & stats */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/15">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-base sm:text-lg text-white tracking-tight">UNBLOCKED VAULT</h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    JSON Catalog
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  {filteredCount} {filteredCount === 1 ? 'game' : 'games'} available <span className="text-slate-600">•</span> {totalGamesCount} total in collection
                </p>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                id="btn-fav-mobile"
                onClick={onToggleFavorites}
                className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
                  showFavoritesOnly
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Favorites"
              >
                <Bookmark className={`w-4 h-4 ${showFavoritesOnly ? 'fill-amber-400' : ''}`} />
              </button>
              <button
                id="btn-json-mobile"
                onClick={onOpenJsonModal}
                className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white"
                title="Manage JSON"
              >
                <FileCode2 className="w-4 h-4 text-emerald-400" />
              </button>
              <button
                id="btn-add-mobile"
                onClick={onOpenAddModal}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                title="Add Game"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="game-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search games by title, tag, or controls..."
              className="w-full pl-10 pr-9 py-2 bg-slate-950/80 border border-slate-800/90 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-sm text-slate-100 placeholder-slate-500 transition-all outline-none"
            />
            {searchQuery && (
              <button
                id="btn-clear-search"
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Desktop action buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              id="btn-toggle-favorites"
              onClick={onToggleFavorites}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                showFavoritesOnly
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/10'
                  : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>Favorites</span>
              {favoriteCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[11px] text-slate-300 font-mono">
                  {favoriteCount}
                </span>
              )}
            </button>

            <button
              id="btn-open-json-manager"
              onClick={onOpenJsonModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-emerald-400 hover:text-emerald-300 transition-all"
              title="Manage and Edit games.json file"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>JSON File</span>
            </button>

            <button
              id="btn-open-add-game"
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Game</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 mt-1 pb-0.5 border-t border-slate-800/80">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1 pr-2 hidden sm:inline-block">
            Category:
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat && !showFavoritesOnly;
            return (
              <button
                key={cat}
                id={`cat-filter-${cat.toLowerCase()}`}
                onClick={() => {
                  if (showFavoritesOnly) onToggleFavorites();
                  onSelectCategory(cat);
                }}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 ring-1 ring-indigo-400/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/90 border border-slate-800/80'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
