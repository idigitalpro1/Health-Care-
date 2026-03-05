import React, { useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Upload, Trash2, Image as ImageIcon, FileText, Download, Eye, AlertCircle, ArrowUpDown, Volume2, Loader2, X, Save, Tag, Search, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'logo' | 'document';
  url: string;
  size: string;
  date: string;
  description?: string;
  tags?: string[];
}

const initialAssets: Asset[] = [
  {
    id: '1',
    name: 'Dr. Sarah Mitchell - Headshot (High Res)',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    size: '2.4 MB',
    date: '2024-03-15',
    description: 'Professional headshot for press releases and speaking engagements.',
    tags: ['headshot', 'professional', 'portrait'],
  },
  {
    id: '2',
    name: 'Clinic Logo - Vector',
    type: 'logo',
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0833860?auto=format&fit=crop&q=80&w=300&h=300',
    size: '1.1 MB',
    date: '2024-01-10',
    description: 'Official clinic logo in vector format. Use on light backgrounds.',
    tags: ['branding', 'logo', 'vector'],
  },
  {
    id: '3',
    name: 'Press Release - New Location',
    type: 'document',
    url: '',
    size: '450 KB',
    date: '2024-02-28',
    description: 'Press release announcing the opening of the new downtown branch.',
    tags: ['press release', 'announcement', 'location'],
  },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

type SortOption = 'date' | 'name' | 'type';

const MediaAssetsTab: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [hoveredAsset, setHoveredAsset] = useState<Asset | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [descriptionInput, setDescriptionInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Derived state for all unique tags across assets
  const allUniqueTags = useMemo(() => {
    const tags = new Set<string>();
    assets.forEach(asset => {
      asset.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [assets]);

  // Search suggestions based on query
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    
    const matchingTags = allUniqueTags.filter(tag => tag.toLowerCase().includes(query));
    const matchingNames = assets
      .filter(asset => asset.name.toLowerCase().includes(query))
      .map(asset => asset.name);

    return [
      ...matchingTags.map(tag => ({ type: 'tag' as const, value: tag })),
      ...matchingNames.map(name => ({ type: 'asset' as const, value: name }))
    ].slice(0, 5); // Limit to 5 suggestions
  }, [searchQuery, allUniqueTags, assets]);

  // Suggested tags for the modal (tags that exist but aren't on the current asset)
  const suggestedTags = useMemo(() => {
    if (!selectedAsset) return [];
    return allUniqueTags.filter(tag => !currentTags.includes(tag)).slice(0, 5);
  }, [selectedAsset, currentTags, allUniqueTags]);

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setAssets(assets.filter((a) => a.id !== id));
    if (selectedAsset?.id === id) setSelectedAsset(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload JPG, PNG, or PDF.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 10MB limit.');
      return;
    }

    setError(null);

    // Mock upload - in a real app, this would upload to server/S3
    const newAsset: Asset = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type === 'application/pdf' ? 'document' : 'image',
      url: URL.createObjectURL(file), // Create local preview URL
      size: formatFileSize(file.size),
      date: new Date().toISOString().split('T')[0],
      description: '',
      tags: [],
    };

    setAssets([newAsset, ...assets]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handlePlayDescription = async (asset: Asset, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (playingId) return; // Prevent multiple plays
    setPlayingId(asset.id);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Media Asset: ${asset.name}. Type: ${asset.type}. Size: ${asset.size}. Tags: ${asset.tags?.join(', ') || 'None'}. Description: ${asset.description || 'No description provided.'}` }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
        audio.onended = () => setPlayingId(null);
        await audio.play();
      } else {
        setPlayingId(null);
      }
    } catch (err) {
      console.error("TTS Error:", err);
      setPlayingId(null);
    }
  };

  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setDescriptionInput(asset.description || '');
    setCurrentTags(asset.tags || []);
    setTagsInput('');
  };

  const handleSaveDetails = () => {
    if (!selectedAsset) return;
    
    const updatedAssets = assets.map(a => 
      a.id === selectedAsset.id ? { ...a, description: descriptionInput, tags: currentTags } : a
    );
    setAssets(updatedAssets);
    setSelectedAsset({ ...selectedAsset, description: descriptionInput, tags: currentTags });
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagsInput.trim()) {
      e.preventDefault();
      if (!currentTags.includes(tagsInput.trim())) {
        setCurrentTags([...currentTags, tagsInput.trim()]);
      }
      setTagsInput('');
    }
  };

  const addTag = (tag: string) => {
    if (!currentTags.includes(tag)) {
      setCurrentTags([...currentTags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentTags(currentTags.filter(tag => tag !== tagToRemove));
  };

  const applySearchSuggestion = (value: string) => {
    setSearchQuery(value);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAndSortedAssets = useMemo(() => {
    let result = [...assets];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(asset => 
        asset.name.toLowerCase().includes(query) || 
        asset.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    return result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'type') return a.type.localeCompare(b.type);
      // Default to date (newest first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [assets, sortBy, searchQuery]);

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Media Assets</h2>
          <p className="text-gray-500">Manage your public-facing media files for press kits and articles.</p>
        </div>
        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
          <button 
            onClick={triggerUpload}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm w-full md:w-auto justify-center"
          >
            <Upload size={18} />
            Upload New Asset
          </button>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-xs flex items-center gap-1"
            >
              <AlertCircle size={12} />
              {error}
            </motion.div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept=".jpg,.jpeg,.png,.pdf"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between bg-white p-2 rounded-lg border border-gray-200 shadow-sm z-20 relative">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64" ref={searchContainerRef}>
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or tag..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            {/* Search Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && searchSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50"
                >
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => applySearchSuggestion(suggestion.value)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      {suggestion.type === 'tag' ? (
                        <Tag size={14} className="text-blue-500" />
                      ) : (
                        <FileText size={14} className="text-gray-400" />
                      )}
                      <span className="truncate">
                        {suggestion.value}
                        {suggestion.type === 'tag' && <span className="ml-2 text-xs text-gray-400 font-normal">(Tag)</span>}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <span className="text-xs font-medium text-gray-500 px-2 uppercase tracking-wider whitespace-nowrap">Sort By:</span>
          <div className="flex gap-1">
            {(['date', 'name', 'type'] as SortOption[]).map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  sortBy === option 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
                {sortBy === option && <ArrowUpDown size={12} className="opacity-50" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedAssets.map((asset) => (
            <motion.div
              key={asset.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group relative cursor-pointer flex flex-col"
              onMouseEnter={() => setHoveredAsset(asset)}
              onMouseLeave={() => setHoveredAsset(null)}
              onClick={() => handleAssetClick(asset)}
            >
              <div className="h-48 bg-gray-100 relative flex items-center justify-center shrink-0">
                {asset.type === 'document' ? (
                  <FileText size={48} className="text-gray-400" />
                ) : (
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 transition-colors" 
                    title="Download"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download size={20} />
                  </button>
                  <button 
                    className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600 transition-colors" 
                    title="Listen to Description"
                    onClick={(e) => handlePlayDescription(asset, e)}
                  >
                    {playingId === asset.id ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} />}
                  </button>
                  <button 
                    className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors" 
                    title="Delete"
                    onClick={(e) => handleDelete(asset.id, e)}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900 truncate" title={asset.name}>{asset.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{asset.type.toUpperCase()} • {asset.size} • {asset.date}</p>
                  </div>
                  {asset.type === 'image' && <ImageIcon size={16} className="text-blue-500 shrink-0 mt-1" />}
                  {asset.type === 'logo' && <ImageIcon size={16} className="text-purple-500 shrink-0 mt-1" />}
                  {asset.type === 'document' && <FileText size={16} className="text-orange-500 shrink-0 mt-1" />}
                </div>
                
                {/* Tags in Card */}
                {asset.tags && asset.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-auto pt-2">
                    {asset.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                        {tag}
                      </span>
                    ))}
                    {asset.tags.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-50 text-gray-400">
                        +{asset.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Upload Placeholder */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={triggerUpload}
          className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center h-full min-h-[250px] cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
        >
          <div className="bg-white p-4 rounded-full shadow-sm mb-3">
            <Upload size={24} className="text-blue-500" />
          </div>
          <p className="font-medium text-gray-900">Upload Asset</p>
          <p className="text-xs text-gray-500 mt-1">JPG, PNG, PDF up to 10MB</p>
        </motion.div>
      </div>

      {/* Large Hover Preview - Rendered via Portal to escape modal clipping */}
      <AnimatePresence mode="wait">
        {hoveredAsset && !selectedAsset && createPortal(
          <motion.div
            key={hoveredAsset.id}
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[9999] pointer-events-none
                       bottom-4 left-4 right-4 md:bottom-auto md:left-auto md:right-8 md:top-1/2 md:-translate-y-1/2 md:w-80
                       bg-white rounded-2xl shadow-2xl border border-gray-200 p-4"
          >
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4 flex items-center justify-center border border-gray-100">
              {hoveredAsset.type === 'document' ? (
                <FileText size={80} className="text-gray-300" />
              ) : (
                <img
                  src={hoveredAsset.url}
                  alt={hoveredAsset.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 leading-tight mb-1">{hoveredAsset.name}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium uppercase tracking-wider text-[10px]">
                  {hoveredAsset.type}
                </span>
                <span>{hoveredAsset.size}</span>
                <span>•</span>
                <span>{hoveredAsset.date}</span>
              </div>
              {hoveredAsset.tags && hoveredAsset.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {hoveredAsset.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-400 italic">
                {hoveredAsset.type === 'document' 
                  ? "Preview not available for documents." 
                  : "High-resolution preview."}
              </p>
            </div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>

      {/* Detail Modal - Rendered via Portal */}
      <AnimatePresence>
        {selectedAsset && createPortal(
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedAsset(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">Asset Details</h3>
                <button 
                  onClick={() => setSelectedAsset(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Preview Column */}
                  <div className="w-full md:w-1/2">
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center mb-4">
                      {selectedAsset.type === 'document' ? (
                        <FileText size={80} className="text-gray-300" />
                      ) : (
                        <img
                          src={selectedAsset.url}
                          alt={selectedAsset.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                    
                    {/* Tags Management */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tags</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {currentTags.map(tag => (
                          <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 group">
                            {tag}
                            <button 
                              onClick={() => removeTag(tag)}
                              className="ml-1.5 text-blue-400 hover:text-blue-600 focus:outline-none"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="relative mb-2">
                        <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                          onKeyDown={handleAddTag}
                          placeholder="Add tag (Press Enter)..."
                          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      {/* Suggested Tags */}
                      {suggestedTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-[10px] text-gray-400 font-medium self-center mr-1">Suggested:</span>
                          {suggestedTags.map(tag => (
                            <button
                              key={tag}
                              onClick={() => addTag(tag)}
                              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 border border-transparent transition-colors flex items-center gap-1"
                            >
                              <Plus size={10} />
                              {tag}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details Column */}
                  <div className="w-full md:w-1/2 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">File Name</label>
                      <p className="text-gray-900 font-medium break-all">{selectedAsset.name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Type</label>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {selectedAsset.type}
                        </span>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Size</label>
                        <p className="text-gray-900 text-sm">{selectedAsset.size}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Uploaded</label>
                        <p className="text-gray-900 text-sm">{selectedAsset.date}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                      <textarea
                        value={descriptionInput}
                        onChange={(e) => setDescriptionInput(e.target.value)}
                        placeholder="Add a description for this asset..."
                        className="w-full h-32 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDetails}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-2 transition-colors"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaAssetsTab;
