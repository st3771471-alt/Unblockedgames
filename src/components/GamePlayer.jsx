import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  RotateCcw,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Gamepad,
  Bookmark,
} from 'lucide-react';

export const GamePlayer = ({
  game,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const containerRef = useRef(null);

  const handleFullscreenToggle = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      id="game-player-modal"
      className="fixed inset-0 z-50 flex flex-col bg-[#0b0f19]/95 backdrop-blur-xl animate-in fade-in duration-200"
    >
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/95 border-b border-slate-800/90 text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
            <Gamepad className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm sm:text-base text-slate-100">{game.title}</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 uppercase font-semibold">
                {game.category}
              </span>
            </div>
            {game.author && (
              <p className="text-[11px] text-slate-400">By {game.author}</p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Favorite button */}
          <button
            id="btn-player-fav"
            onClick={() => onToggleFavorite(game.id)}
            className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
              isFavorite
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800/90 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>

          {/* Toggle Controls Info */}
          <button
            id="btn-player-controls-toggle"
            onClick={() => setShowControls((v) => !v)}
            className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
              showControls
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-800/90 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Toggle Controls Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Reload Game */}
          <button
            id="btn-player-reload"
            onClick={handleReload}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all"
            title="Restart / Reload Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Open Direct / External */}
          {game.iframeUrl && game.iframeUrl !== 'about:blank' && (
            <a
              id="btn-player-external"
              href={game.iframeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all hidden sm:flex items-center"
              title="Open direct URL in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {/* Fullscreen Toggle */}
          <button
            id="btn-player-fullscreen"
            onClick={handleFullscreenToggle}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Game */}
          <button
            id="btn-player-close"
            onClick={onClose}
            className="p-2 ml-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 hover:text-rose-200 transition-all font-bold"
            title="Close game (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div
        ref={containerRef}
        className="relative flex-1 flex flex-col items-center justify-center bg-[#0b0f19] overflow-hidden p-2 sm:p-4"
      >
        <div className="relative w-full h-full max-w-6xl max-h-[88vh] bg-black rounded-2xl overflow-hidden border border-slate-800/90 shadow-2xl shadow-black/50 flex flex-col">
          
          {/* The Iframe Component */}
          {game.srcDoc ? (
            <iframe
              key={`srcdoc-${iframeKey}`}
              id="game-frame"
              title={game.title}
              srcDoc={game.srcDoc}
              className="w-full h-full border-0 bg-slate-950 flex-1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen; gamepad"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
            />
          ) : (
            <iframe
              key={`url-${iframeKey}`}
              id="game-frame"
              title={game.title}
              src={game.iframeUrl}
              className="w-full h-full border-0 bg-slate-950 flex-1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen; gamepad"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
              onError={() => setLoadError(true)}
            />
          )}

          {/* Controls / Info Drawer */}
          {showControls && (
            <div className="absolute bottom-3 inset-x-3 sm:inset-x-auto sm:left-4 sm:max-w-md bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl p-3.5 text-slate-300 shadow-2xl transition-all animate-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Controls & Guide
                </span>
                <button
                  onClick={() => setShowControls(false)}
                  className="text-slate-400 hover:text-white text-xs p-0.5 rounded hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-slate-200 font-medium mb-1 leading-relaxed">
                {game.controls || 'Use Arrow Keys / Mouse to control this game.'}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {game.tags?.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
