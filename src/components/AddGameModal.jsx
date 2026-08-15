import React, { useState } from 'react';
import { X, Plus, Image as ImageIcon, Link2, Gamepad2, Info, Sparkles } from 'lucide-react';

const PRESET_THUMBNAILS = [
  { label: 'Arcade / Cyber', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80' },
  { label: 'Space / Action', url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80' },
  { label: 'Puzzle / Abstract', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80' },
  { label: 'Retro / Pixel', url: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=600&q=80' },
  { label: 'Sports / Table', url: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=600&q=80' },
  { label: 'Neon / Gaming', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80' },
];

export const AddGameModal = ({ onClose, onAddGame }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [iframeUrl, setIframeUrl] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(PRESET_THUMBNAILS[0].url);
  const [tagsInput, setTagsInput] = useState('unblocked, html5');
  const [controls, setControls] = useState('Arrow Keys or Mouse to play');
  const [author, setAuthor] = useState('');
  const [customHtml, setCustomHtml] = useState('');
  const [embedMode, setEmbedMode] = useState('url');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for the game.');
      return;
    }
    if (embedMode === 'url' && !iframeUrl.trim()) {
      setError('Please provide an iframe URL.');
      return;
    }
    if (embedMode === 'srcdoc' && !customHtml.trim()) {
      setError('Please provide custom HTML/JS code for the game.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newGame = {
      id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4),
      title: title.trim(),
      category,
      description: description.trim() || 'A fun unblocked web game.',
      thumbnail: thumbnail.trim() || PRESET_THUMBNAILS[0].url,
      iframeUrl: embedMode === 'url' ? iframeUrl.trim() : 'about:blank',
      srcDoc: embedMode === 'srcdoc' ? customHtml : undefined,
      tags: tags.length ? tags : ['unblocked', 'game'],
      controls: controls.trim(),
      author: author.trim() || 'Custom Added',
      rating: 5.0,
      featured: false,
    };

    onAddGame(newGame);
    onClose();
  };

  return (
    <div
      id="add-game-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add New Game to JSON Collection</h2>
              <p className="text-xs text-slate-400">Add an iframe URL or embedded HTML5 game</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Game Title <span className="text-rose-400">*</span>
              </label>
              <input
                id="input-game-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Cyber Dash 3D"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-100 placeholder-slate-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                id="select-game-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:border-indigo-500 outline-none text-slate-100"
              >
                <option value="Arcade">Arcade</option>
                <option value="Action">Action</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Retro">Retro</option>
                <option value="Sports">Sports</option>
                <option value="Strategy">Strategy</option>
                <option value="Casual">Casual</option>
              </select>
            </div>
          </div>

          {/* Embed Mode Switcher */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Embed Type
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEmbedMode('url')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  embedMode === 'url'
                    ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Iframe Web URL
              </button>
              <button
                type="button"
                onClick={() => setEmbedMode('srcdoc')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  embedMode === 'srcdoc'
                    ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Custom HTML / JS Code
              </button>
            </div>
          </div>

          {/* Iframe URL Input */}
          {embedMode === 'url' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Iframe URL <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="input-game-iframe-url"
                  type="url"
                  value={iframeUrl}
                  onChange={(e) => setIframeUrl(e.target.value)}
                  placeholder="https://example.com/game-embed"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-100 placeholder-slate-500 font-mono text-xs"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Enter any valid web link to embed in the game iframe.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                HTML5 Code (Self-Contained) <span className="text-rose-400">*</span>
              </label>
              <textarea
                id="input-game-srcdoc"
                rows={4}
                value={customHtml}
                onChange={(e) => setCustomHtml(e.target.value)}
                placeholder="<!DOCTYPE html><html><head>...</head><body><canvas id='c'></canvas><script>...</script></body></html>"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:border-indigo-500 outline-none text-slate-100 font-mono"
              />
            </div>
          )}

          {/* Thumbnail Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Thumbnail Image URL
            </label>
            <input
              id="input-game-thumbnail"
              type="text"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:border-indigo-500 outline-none text-slate-100 placeholder-slate-500 mb-2"
            />
            
            {/* Quick preset thumbnail pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[10px] text-slate-400 shrink-0 font-medium">Presets:</span>
              {PRESET_THUMBNAILS.map((pt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setThumbnail(pt.url)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border whitespace-nowrap transition-all ${
                    thumbnail === pt.url
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {pt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description & Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description of gameplay..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:border-indigo-500 outline-none text-slate-100 placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Controls Guide
              </label>
              <textarea
                rows={2}
                value={controls}
                onChange={(e) => setControls(e.target.value)}
                placeholder="e.g. Arrow Keys to move, Space to Jump"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:border-indigo-500 outline-none text-slate-100 placeholder-slate-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="action, arcade, 2player, retro"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:border-indigo-500 outline-none text-slate-100 placeholder-slate-500"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              id="btn-submit-add-game"
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Game to Catalog</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
