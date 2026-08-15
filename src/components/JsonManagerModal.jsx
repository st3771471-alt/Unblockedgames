import React, { useState } from 'react';
import {
  X,
  FileCode2,
  Copy,
  Download,
  Upload,
  RotateCcw,
  Check,
  AlertCircle,
  Save
} from 'lucide-react';

export const JsonManagerModal = ({
  games,
  onClose,
  onSaveGames,
  onResetToDefault,
}) => {
  // Format clean JSON without giant srcDoc clutter if desired or format cleanly
  const cleanGamesForExport = games.map((g) => ({
    id: g.id,
    title: g.title,
    category: g.category,
    description: g.description,
    thumbnail: g.thumbnail,
    iframeUrl: g.iframeUrl,
    tags: g.tags,
    controls: g.controls,
    author: g.author,
    rating: g.rating,
    featured: g.featured,
    ...(g.srcDoc ? { srcDoc: g.srcDoc } : {})
  }));

  const initialJson = JSON.stringify(
    {
      version: '1.0.0',
      title: 'Unblocked Games Vault Catalog',
      description: 'Collection of unblocked iframe games and retro arcades',
      games: cleanGamesForExport,
    },
    null,
    2
  );

  const [jsonText, setJsonText] = useState(initialJson);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        const parsed = JSON.parse(text);
        setJsonText(JSON.stringify(parsed, null, 2));
        setError(null);
      } catch (err) {
        setError(`Failed to parse uploaded JSON file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonText);
      let list = [];
      if (Array.isArray(parsed)) {
        list = parsed;
      } else if (parsed && Array.isArray(parsed.games)) {
        list = parsed.games;
      } else {
        throw new Error('JSON must contain a "games" array or be an array of games.');
      }

      // Basic validation
      for (const item of list) {
        if (!item.id || !item.title) {
          throw new Error('Every game object must include at least an "id" and "title".');
        }
        if (!item.category) item.category = 'Arcade';
        if (!item.tags) item.tags = ['unblocked'];
        if (!item.thumbnail) item.thumbnail = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80';
        if (!item.iframeUrl && !item.srcDoc) item.iframeUrl = 'about:blank';
      }

      onSaveGames(list);
      setError(null);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      setError(`JSON Syntax/Format Error: ${err.message}`);
    }
  };

  return (
    <div
      id="json-manager-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>games.json File Manager</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {games.length} titles stored
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Directly edit, export, import, and sync your iframe game catalog JSON
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2.5 bg-slate-950/90 border-b border-slate-800 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <button
              id="btn-copy-json"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
            </button>

            <button
              id="btn-download-json"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors font-medium"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Download games.json</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-colors font-medium">
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Upload JSON</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <button
            id="btn-reset-default-json"
            onClick={() => {
              if (window.confirm('Reset catalog to the default unblocked games list?')) {
                onResetToDefault();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 transition-colors font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="px-5 py-2.5 bg-rose-500/15 border-b border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 p-5 overflow-hidden flex flex-col bg-slate-950/60">
          <label className="block text-xs font-mono text-slate-400 mb-1.5">
            JSON Document Editor:
          </label>
          <textarea
            id="json-editor-textarea"
            value={jsonText}
            onChange={(e) => {
              setJsonText(e.target.value);
              setError(null);
            }}
            spellCheck={false}
            className="w-full flex-1 p-4 bg-slate-950/90 border border-slate-800 rounded-xl font-mono text-xs text-emerald-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none leading-relaxed selection:bg-emerald-900 selection:text-white"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-800 bg-slate-900 shrink-0">
          <p className="text-xs text-slate-400">
            Changes to the JSON file will immediately update the gallery view and storage.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Close
            </button>
            <button
              id="btn-save-json-changes"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5 active:scale-95"
            >
              {savedSuccess ? <Check className="w-4 h-4 stroke-[3]" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Catalog Saved!' : 'Apply & Save JSON'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
