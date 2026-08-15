/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { DEFAULT_GAMES } from './data/defaultGames.js';
import { Header } from './components/Header.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { JsonManagerModal } from './components/JsonManagerModal.jsx';
import {
  Gamepad2,
  Flame,
  Search,
  Plus,
  FileCode2,
  RotateCcw,
  LayoutGrid,
  Trophy
} from 'lucide-react';

const STORAGE_KEY_GAMES = 'unblocked_vault_games_v1';
const STORAGE_KEY_FAVS = 'unblocked_vault_favorites_v1';

export default function App() {
  const [games, setGames] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GAMES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse saved games from storage:', e);
    }
    return DEFAULT_GAMES;
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['neon-snake', 'puzzle-2048', 'space-defender'];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeGame, setActiveGame] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);

  // Sync to local storage when games change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GAMES, JSON.stringify(games));
    } catch (e) {
      console.error('Failed to save games to localStorage:', e);
    }
  }, [games]);

  // Sync favorites
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites]);

  const handleToggleFavorite = (id, e) => {
    if (e) e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddGame = (newGame) => {
    setGames((prev) => [newGame, ...prev]);
  };

  const handleSaveJsonGames = (updatedList) => {
    setGames(updatedList);
  };

  const handleResetToDefault = () => {
    setGames(DEFAULT_GAMES);
    localStorage.removeItem(STORAGE_KEY_GAMES);
  };

  // Filtered games
  const filteredGames = useMemo(() => {
    return games.filter((g) => {
      // Category filter
      if (selectedCategory !== 'All' && g.category !== selectedCategory) {
        return false;
      }
      // Favorites filter
      if (showFavoritesOnly && !favorites.includes(g.id)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = g.title.toLowerCase().includes(q);
        const matchDesc = g.description.toLowerCase().includes(q);
        const matchCat = g.category.toLowerCase().includes(q);
        const matchTags = g.tags?.some((t) => t.toLowerCase().includes(q));
        const matchControls = g.controls?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCat && !matchTags && !matchControls) {
          return false;
        }
      }
      return true;
    });
  }, [games, selectedCategory, showFavoritesOnly, favorites, searchQuery]);

  // Featured games for spotlight
  const featuredGames = useMemo(() => {
    return games.filter((g) => g.featured);
  }, [games]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sticky Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly((prev) => !prev)}
        favoriteCount={favorites.length}
        totalGamesCount={games.length}
        filteredCount={filteredGames.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenJsonModal={() => setIsJsonModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6">
        
        {/* Spotlight / Hero banner (Only shown when not searching & on 'All' category) */}
        {!searchQuery && selectedCategory === 'All' && !showFavoritesOnly && (
          <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800/90 p-6 sm:p-8 shadow-xl shadow-black/20">
            {/* Background grid accent */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-xl space-y-2.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold tracking-wide">
                  <Flame className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
                  <span>UNBLOCKED IFRAME GAMES PORTAL</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Instant Web Games Collection
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  Every game runs seamlessly inside a responsive sandbox iframe. Manage and expand your catalog directly using the built-in <code className="text-emerald-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">games.json</code> file or add new titles with custom URLs.
                </p>
              </div>

              {/* Quick action pill cards */}
              <div className="flex flex-wrap gap-2.5 sm:shrink-0">
                <button
                  id="hero-quick-play-featured"
                  onClick={() => featuredGames[0] && setActiveGame(featuredGames[0])}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/25 transition-all active:scale-95"
                >
                  <Trophy className="w-4 h-4 text-amber-300" />
                  <span>Featured: {featuredGames[0]?.title || 'Neon Snake'}</span>
                </button>
                <button
                  id="hero-open-json"
                  onClick={() => setIsJsonModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-emerald-400 text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                  <FileCode2 className="w-4 h-4" />
                  <span>Edit JSON File</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Gallery Section Header */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2.5">
            <LayoutGrid className="w-4 h-4 text-indigo-400" />
            <h2 className="font-bold text-base text-slate-100">
              {showFavoritesOnly
                ? 'Your Favorited Games'
                : selectedCategory === 'All'
                ? 'All Available Games'
                : `${selectedCategory} Games`}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono border border-slate-700/50">
              {filteredGames.length}
            </span>
          </div>

          {/* Filter Status Reset button */}
          {(searchQuery || selectedCategory !== 'All' || showFavoritesOnly) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setShowFavoritesOnly(false);
              }}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors px-2 py-1 rounded-lg hover:bg-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Game Gallery Grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isFavorite={favorites.includes(game.id)}
                onPlay={(g) => setActiveGame(g)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="py-16 px-4 flex flex-col items-center justify-center text-center bg-slate-900/40 rounded-2xl border border-slate-800/80">
            <div className="h-12 w-12 rounded-xl bg-slate-800/90 flex items-center justify-center text-slate-400 mb-3.5 border border-slate-700/60">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No Games Found</h3>
            <p className="text-xs text-slate-400 max-w-md mb-5 leading-relaxed">
              No games matched your query "{searchQuery || selectedCategory}". You can add this title or adjust your search.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setShowFavoritesOnly(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                Clear Search
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition-all"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add This Game</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#0b0f19]/90 py-5 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">Unblocked Games Vault</span>
            <span className="text-slate-500">— JSON Powered Game Catalog</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsJsonModalOpen(true)}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>games.json File</span>
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="hover:text-indigo-400 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Title</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Active Game Iframe Viewport Modal */}
      {activeGame && (
        <GamePlayer
          game={activeGame}
          onClose={() => setActiveGame(null)}
          isFavorite={favorites.includes(activeGame.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Add Game Modal */}
      {isAddModalOpen && (
        <AddGameModal
          onClose={() => setIsAddModalOpen(false)}
          onAddGame={handleAddGame}
        />
      )}

      {/* JSON File Manager Modal */}
      {isJsonModalOpen && (
        <JsonManagerModal
          games={games}
          onClose={() => setIsJsonModalOpen(false)}
          onSaveGames={handleSaveJsonGames}
          onResetToDefault={handleResetToDefault}
        />
      )}
    </div>
  );
}
