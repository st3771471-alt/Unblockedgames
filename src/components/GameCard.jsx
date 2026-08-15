import React from 'react';
import { Play, Star, Bookmark, Sparkles } from 'lucide-react';

const CATEGORY_COLORS = {
  Arcade: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Puzzle: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  Action: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  Retro: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  Sports: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  Strategy: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  Casual: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
};

export const GameCard = ({
  game,
  isFavorite,
  onPlay,
  onToggleFavorite,
}) => {
  const badgeColor = CATEGORY_COLORS[game.category] || 'bg-slate-800 text-slate-300 border-slate-700';

  return (
    <div
      id={`game-card-${game.id}`}
      onClick={() => onPlay(game)}
      className="group relative flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800/90 hover:border-indigo-500/60 transition-all duration-200 overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-indigo-950/40 hover:-translate-y-1"
    >
      {/* Thumbnail Container */}
      <div className="relative w-full aspect-[16/10] bg-slate-950 overflow-hidden">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback gradient if thumbnail fails to load
            e.target.src = `https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80`;
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-85 group-hover:opacity-65 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md pointer-events-auto ${badgeColor}`}>
            {game.category}
          </span>

          <button
            id={`btn-fav-${game.id}`}
            onClick={(e) => onToggleFavorite(game.id, e)}
            className="p-1.5 rounded-lg bg-slate-950/75 hover:bg-slate-900 border border-white/10 text-slate-300 hover:text-amber-400 backdrop-blur-md transition-all pointer-events-auto shadow-sm"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        {/* Featured Star */}
        {game.featured && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-md">
            <Sparkles className="w-3 h-3 fill-slate-950" />
            <span>FEATURED</span>
          </div>
        )}

        {/* Hover Quick Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-950/40 backdrop-blur-[2px]">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/40 transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>PLAY NOW</span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          <div className="flex items-start justify-between gap-1.5 mb-1">
            <h3 className="font-bold text-sm text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
              {game.title}
            </h3>
            {game.rating && (
              <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 shrink-0">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{Number(game.rating).toFixed(1)}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-normal">
            {game.description}
          </p>
        </div>

        {/* Tags footer */}
        <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 overflow-hidden">
            {game.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/40 whitespace-nowrap"
              >
                #{tag}
              </span>
            ))}
          </div>

          <span className="text-[11px] font-semibold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-0.5 shrink-0">
            Play <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
