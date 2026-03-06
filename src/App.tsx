import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { 
  Send, 
  History, 
  Book, 
  GraduationCap, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  ChevronDown, 
  Info, 
  Code,
  Terminal,
  Activity,
  Zap,
  Shield,
  Layers,
  Search,
  X
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { HttpMethod, KeyValue, ApiRequest, ApiResponse, HistoryItem } from './types';
import { cn, formatBytes } from './utils';
import { explainApiResponse, generateCodeSnippet } from './services/geminiService';

const DEFAULT_REQUEST: ApiRequest = {
  id: 'default',
  name: 'New Request',
  method: 'GET',
  url: 'https://jsonplaceholder.typicode.com/posts/1',
  headers: [{ key: 'Content-Type', value: 'application/json', enabled: true }],
  params: [],
  body: '',
  timestamp: Date.now(),
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'explorer' | 'history' | 'docs' | 'learn'>('explorer');
  const [request, setRequest] = useState<ApiRequest>(DEFAULT_REQUEST);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeRequestTab, setActiveRequestTab] = useState<'params' | 'headers' | 'body'>('params');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState('javascript');

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem('api_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Save history
  useEffect(() => {
    localStorage.setItem('api_history', JSON.stringify(history));
  }, [history]);

  const handleSend = async () => {
    setIsLoading(true);
    setResponse(null);
    setExplanation(null);
    setCodeSnippet(null);
    
    const startTime = Date.now();
    
    try {
      const headers = request.headers
        .filter(h => h.enabled && h.key)
        .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});
      
      const params = request.params
        .filter(p => p.enabled && p.key)
        .reduce((acc, p) => ({ ...acc, [p.key]: p.value }), {});

      const res = await axios({
        method: request.method,
        url: request.url,
        headers,
        params,
        data: request.method !== 'GET' ? (request.body ? JSON.parse(request.body) : undefined) : undefined,
        validateStatus: () => true, // Don't throw on 4xx/5xx
      });

      const endTime = Date.now();
      const apiRes: ApiResponse = {
        status: res.status,
        statusText: res.statusText,
        data: res.data,
        headers: res.headers as any,
        time: endTime - startTime,
        size: formatBytes(JSON.stringify(res.data).length),
      };

      setResponse(apiRes);
      
      // Add to history
      const newHistoryItem: HistoryItem = {
        ...request,
        id: Date.now().toString(),
        timestamp: Date.now(),
        response: apiRes
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 50));
    } catch (error: any) {
      setResponse({
        status: 0,
        statusText: 'Error',
        data: { error: error.message },
        headers: {},
        time: Date.now() - startTime,
        size: '0 B',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplain = async () => {
    if (!response) return;
    setIsExplaining(true);
    const text = await explainApiResponse(request, response);
    setExplanation(text || "No explanation available.");
    setIsExplaining(false);
  };

  const handleGenerateCode = async (lang: string) => {
    setSelectedLang(lang);
    setCodeSnippet(null);
    const code = await generateCodeSnippet(request, lang);
    setCodeSnippet(code || "// Error generating code");
  };

  const addRow = (type: 'params' | 'headers') => {
    const newRow = { key: '', value: '', enabled: true };
    if (type === 'params') {
      setRequest(prev => ({ ...prev, params: [...prev.params, newRow] }));
    } else {
      setRequest(prev => ({ ...prev, headers: [...prev.headers, newRow] }));
    }
  };

  const updateRow = (type: 'params' | 'headers', index: number, field: keyof KeyValue, value: any) => {
    if (type === 'params') {
      const newParams = [...request.params];
      newParams[index] = { ...newParams[index], [field]: value };
      setRequest(prev => ({ ...prev, params: newParams }));
    } else {
      const newHeaders = [...request.headers];
      newHeaders[index] = { ...newHeaders[index], [field]: value };
      setRequest(prev => ({ ...prev, headers: newHeaders }));
    }
  };

  const removeRow = (type: 'params' | 'headers', index: number) => {
    if (type === 'params') {
      setRequest(prev => ({ ...prev, params: prev.params.filter((_, i) => i !== index) }));
    } else {
      setRequest(prev => ({ ...prev, headers: prev.headers.filter((_, i) => i !== index) }));
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-16 md:w-64 bg-[#141414] text-[#E4E3E0] flex flex-col border-r border-white/10">
        <div className="p-6 flex items-center gap-3">
          <Terminal className="w-8 h-8 text-white" />
          <span className="hidden md:block font-serif italic text-xl font-bold">API Master</span>
        </div>
        
        <nav className="flex-1 px-3 space-y-2 mt-4">
          {[
            { id: 'explorer', icon: Zap, label: 'Explorer' },
            { id: 'history', icon: History, label: 'History' },
            { id: 'docs', icon: Book, label: 'Documentation' },
            { id: 'learn', icon: GraduationCap, label: 'Learn' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                activeTab === item.id 
                  ? "bg-[#E4E3E0] text-[#141414]" 
                  : "hover:bg-white/5 text-white/60 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="hidden md:block font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3 opacity-50">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-mono">System Online</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#E4E3E0]">
        <AnimatePresence mode="wait">
          {activeTab === 'explorer' && (
            <motion.div 
              key="explorer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Header / URL Bar */}
              <div className="p-6 border-b border-[#141414]/10 bg-white/50">
                <div className="flex gap-2">
                  <select 
                    value={request.method}
                    onChange={(e) => setRequest(prev => ({ ...prev, method: e.target.value as HttpMethod }))}
                    className="bg-[#141414] text-white px-4 py-2 rounded font-mono text-sm outline-none focus:ring-2 ring-black/20"
                  >
                    {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <input 
                    type="text"
                    value={request.url}
                    onChange={(e) => setRequest(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://api.example.com/v1/resource"
                    className="flex-1 bg-white border border-[#141414]/20 px-4 py-2 rounded font-mono text-sm outline-none focus:border-[#141414]"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={isLoading}
                    className="bg-[#141414] text-[#E4E3E0] px-6 py-2 rounded flex items-center gap-2 hover:bg-black transition-colors disabled:opacity-50"
                  >
                    {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                    <span className="font-medium">Send</span>
                  </button>
                </div>
              </div>

              {/* Request Details */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
                <div className="flex flex-col border-r border-[#141414]/10 overflow-hidden">
                  <div className="flex border-b border-[#141414]/10 px-6">
                    {['params', 'headers', 'body'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveRequestTab(tab as any)}
                        className={cn(
                          "px-4 py-3 text-xs uppercase tracking-widest font-bold transition-all border-b-2",
                          activeRequestTab === tab 
                            ? "border-[#141414] text-[#141414]" 
                            : "border-transparent text-[#141414]/40 hover:text-[#141414]"
                        )}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 overflow-y-auto p-6">
                    {activeRequestTab === 'params' && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-[30px_1fr_1fr_30px] gap-2 mb-2">
                          <div />
                          <span className="col-header">Key</span>
                          <span className="col-header">Value</span>
                          <div />
                        </div>
                        {request.params.map((p, i) => (
                          <div key={i} className="grid grid-cols-[30px_1fr_1fr_30px] gap-2 items-center">
                            <input 
                              type="checkbox" 
                              checked={p.enabled}
                              onChange={(e) => updateRow('params', i, 'enabled', e.target.checked)}
                              className="accent-[#141414]"
                            />
                            <input 
                              type="text" 
                              value={p.key}
                              onChange={(e) => updateRow('params', i, 'key', e.target.value)}
                              placeholder="key"
                              className="bg-white border border-[#141414]/10 px-2 py-1 rounded text-xs font-mono"
                            />
                            <input 
                              type="text" 
                              value={p.value}
                              onChange={(e) => updateRow('params', i, 'value', e.target.value)}
                              placeholder="value"
                              className="bg-white border border-[#141414]/10 px-2 py-1 rounded text-xs font-mono"
                            />
                            <button onClick={() => removeRow('params', i)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => addRow('params')}
                          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#141414]/60 hover:text-[#141414] mt-4"
                        >
                          <Plus className="w-3 h-3" /> Add Parameter
                        </button>
                      </div>
                    )}

                    {activeRequestTab === 'headers' && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-[30px_1fr_1fr_30px] gap-2 mb-2">
                          <div />
                          <span className="col-header">Key</span>
                          <span className="col-header">Value</span>
                          <div />
                        </div>
                        {request.headers.map((h, i) => (
                          <div key={i} className="grid grid-cols-[30px_1fr_1fr_30px] gap-2 items-center">
                            <input 
                              type="checkbox" 
                              checked={h.enabled}
                              onChange={(e) => updateRow('headers', i, 'enabled', e.target.checked)}
                              className="accent-[#141414]"
                            />
                            <input 
                              type="text" 
                              value={h.key}
                              onChange={(e) => updateRow('headers', i, 'key', e.target.value)}
                              placeholder="key"
                              className="bg-white border border-[#141414]/10 px-2 py-1 rounded text-xs font-mono"
                            />
                            <input 
                              type="text" 
                              value={h.value}
                              onChange={(e) => updateRow('headers', i, 'value', e.target.value)}
                              placeholder="value"
                              className="bg-white border border-[#141414]/10 px-2 py-1 rounded text-xs font-mono"
                            />
                            <button onClick={() => removeRow('headers', i)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => addRow('headers')}
                          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#141414]/60 hover:text-[#141414] mt-4"
                        >
                          <Plus className="w-3 h-3" /> Add Header
                        </button>
                      </div>
                    )}

                    {activeRequestTab === 'body' && (
                      <div className="h-full flex flex-col">
                        <textarea 
                          value={request.body}
                          onChange={(e) => setRequest(prev => ({ ...prev, body: e.target.value }))}
                          placeholder='{ "key": "value" }'
                          className="flex-1 bg-white border border-[#141414]/10 p-4 rounded font-mono text-xs resize-none outline-none focus:border-[#141414]"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Response Section */}
                <div className="flex flex-col overflow-hidden bg-white/30">
                  {response ? (
                    <div className="flex-1 flex flex-col overflow-hidden">
                      <div className="p-4 border-b border-[#141414]/10 flex items-center justify-between bg-white/50">
                        <div className="flex gap-6">
                          <div className="flex flex-col">
                            <span className="col-header">Status</span>
                            <span className={cn(
                              "font-mono text-sm font-bold",
                              response.status >= 200 && response.status < 300 ? "text-green-600" : "text-red-600"
                            )}>
                              {response.status} {response.statusText}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="col-header">Time</span>
                            <span className="font-mono text-sm font-bold">{response.time}ms</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="col-header">Size</span>
                            <span className="font-mono text-sm font-bold">{response.size}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleGenerateCode(selectedLang)}
                            className="bg-white border border-[#141414]/10 p-2 rounded hover:bg-[#141414] hover:text-white transition-all flex items-center gap-2 text-xs"
                          >
                            <Code className="w-3 h-3" />
                            Code Snippet
                          </button>
                          <button 
                            onClick={handleExplain}
                            disabled={isExplaining}
                            className="bg-[#141414] text-white p-2 rounded hover:bg-black transition-all flex items-center gap-2 text-xs"
                          >
                            {isExplaining ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Zap className="w-3 h-3" />}
                            Explain with AI
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 overflow-hidden flex flex-col">
                        <div className="flex-1 overflow-y-auto p-4">
                          {codeSnippet ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <select 
                                  value={selectedLang}
                                  onChange={(e) => handleGenerateCode(e.target.value)}
                                  className="text-[10px] uppercase font-bold bg-[#141414] text-white px-2 py-1 rounded"
                                >
                                  {['javascript', 'python', 'go', 'curl'].map(l => (
                                    <option key={l} value={l}>{l}</option>
                                  ))}
                                </select>
                                <button onClick={() => setCodeSnippet(null)} className="text-xs text-[#141414]/40 hover:text-[#141414]">Back to JSON</button>
                              </div>
                              <SyntaxHighlighter 
                                language={selectedLang === 'curl' ? 'bash' : selectedLang} 
                                style={atomDark}
                                customStyle={{ margin: 0, borderRadius: '8px', fontSize: '11px' }}
                              >
                                {codeSnippet}
                              </SyntaxHighlighter>
                            </div>
                          ) : (
                            <SyntaxHighlighter 
                              language="json" 
                              style={atomDark}
                              customStyle={{ margin: 0, borderRadius: '8px', fontSize: '11px' }}
                            >
                              {JSON.stringify(response.data, null, 2)}
                            </SyntaxHighlighter>
                          )}
                        </div>
                        
                        {explanation && (
                          <motion.div 
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            className="h-1/3 bg-[#141414] text-[#E4E3E0] p-6 overflow-y-auto border-t border-white/10"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-emerald-400" />
                                <span className="font-serif italic text-lg">AI Explanation</span>
                              </div>
                              <button onClick={() => setExplanation(null)} className="text-white/40 hover:text-white">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="text-sm leading-relaxed opacity-80 whitespace-pre-wrap font-sans">
                              {explanation}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-[#141414]/30 space-y-4">
                      <Activity className="w-16 h-16 opacity-10" />
                      <p className="font-serif italic text-xl">Waiting for request...</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto p-8"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-serif italic text-3xl font-bold">Request History</h2>
                  <button 
                    onClick={() => setHistory([])}
                    className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-red-600 hover:bg-red-50 p-2 rounded"
                  >
                    <Trash2 className="w-4 h-4" /> Clear All
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="data-row bg-[#141414]/5 cursor-default hover:bg-[#141414]/5 hover:text-[#141414]">
                    <div />
                    <span className="col-header">Request</span>
                    <span className="col-header">Status</span>
                    <span className="col-header">Time</span>
                  </div>
                  {history.map((item) => (
                    <div 
                      key={item.id} 
                      className="data-row"
                      onClick={() => {
                        setRequest(item);
                        setResponse(item.response || null);
                        setActiveTab('explorer');
                      }}
                    >
                      <div className="flex items-center justify-center">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          item.method === 'GET' ? "bg-blue-500" :
                          item.method === 'POST' ? "bg-green-500" :
                          item.method === 'PUT' ? "bg-yellow-500" :
                          "bg-red-500"
                        )} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-bold">{item.method}</span>
                        <span className="text-[10px] truncate opacity-60">{item.url}</span>
                      </div>
                      <div className="flex items-center">
                        <span className={cn(
                          "font-mono text-xs",
                          item.response?.status && item.response.status < 300 ? "text-green-500" : "text-red-500"
                        )}>
                          {item.response?.status || '---'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-mono text-xs opacity-60">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {history.length === 0 && (
                    <div className="p-12 text-center text-[#141414]/30">
                      <p className="font-serif italic text-xl">No history yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'docs' && (
            <motion.div 
              key="docs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto p-8"
            >
              <div className="max-w-3xl mx-auto space-y-12">
                <header>
                  <h2 className="font-serif italic text-4xl font-bold mb-4">API Documentation</h2>
                  <p className="text-[#141414]/60 leading-relaxed">
                    Welcome to the API Masterclass documentation. This tool is designed to help you understand how to build and consume RESTful services.
                  </p>
                </header>

                <section className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6" />
                    <h3 className="font-serif italic text-2xl font-bold">Authentication</h3>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-[#141414]/10 shadow-sm">
                    <p className="text-sm mb-4">Most modern APIs use Bearer tokens for authentication. You can add these in the Headers tab:</p>
                    <div className="bg-[#141414] text-white p-4 rounded font-mono text-xs">
                      Authorization: Bearer YOUR_TOKEN_HERE
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Layers className="w-6 h-6" />
                    <h3 className="font-serif italic text-2xl font-bold">Common Endpoints</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { method: 'GET', path: '/users', desc: 'Retrieve a list of users' },
                      { method: 'POST', path: '/users', desc: 'Create a new user' },
                      { method: 'GET', path: '/users/:id', desc: 'Get details for a specific user' },
                      { method: 'PUT', path: '/users/:id', desc: 'Update a user entirely' },
                      { method: 'PATCH', path: '/users/:id', desc: 'Partially update a user' },
                      { method: 'DELETE', path: '/users/:id', desc: 'Remove a user' },
                    ].map((endpoint, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#141414]/5">
                        <div className="flex items-center gap-4">
                          <span className={cn(
                            "px-2 py-1 rounded text-[10px] font-bold font-mono min-w-[60px] text-center",
                            endpoint.method === 'GET' ? "bg-blue-100 text-blue-700" :
                            endpoint.method === 'POST' ? "bg-green-100 text-green-700" :
                            endpoint.method === 'PUT' ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          )}>
                            {endpoint.method}
                          </span>
                          <span className="font-mono text-sm">{endpoint.path}</span>
                        </div>
                        <span className="text-xs text-[#141414]/50">{endpoint.desc}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </motion.div>
          )}

          {activeTab === 'learn' && (
            <motion.div 
              key="learn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto p-8"
            >
              <div className="max-w-4xl mx-auto">
                <h2 className="font-serif italic text-4xl font-bold mb-8">API Fundamentals</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-2xl border border-[#141414]/10 shadow-sm space-y-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                      <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif italic text-2xl font-bold">HTTP Methods</h3>
                    <p className="text-sm text-[#141414]/60 leading-relaxed">
                      Learn about the different verbs used in HTTP requests and when to use each one for CRUD operations.
                    </p>
                    <button className="text-xs uppercase tracking-widest font-bold border-b border-[#141414] pb-1">Read More</button>
                  </div>

                  <div className="bg-white p-8 rounded-2xl border border-[#141414]/10 shadow-sm space-y-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                      <Info className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif italic text-2xl font-bold">Status Codes</h3>
                    <p className="text-sm text-[#141414]/60 leading-relaxed">
                      From 200 OK to 404 Not Found, understand what the server is trying to tell you with its response.
                    </p>
                    <button className="text-xs uppercase tracking-widest font-bold border-b border-[#141414] pb-1">Read More</button>
                  </div>

                  <div className="bg-white p-8 rounded-2xl border border-[#141414]/10 shadow-sm space-y-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
                      <Code className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif italic text-2xl font-bold">JSON Structure</h3>
                    <p className="text-sm text-[#141414]/60 leading-relaxed">
                      Master the syntax of JavaScript Object Notation, the universal language of modern web APIs.
                    </p>
                    <button className="text-xs uppercase tracking-widest font-bold border-b border-[#141414] pb-1">Read More</button>
                  </div>

                  <div className="bg-[#141414] text-white p-8 rounded-2xl shadow-xl space-y-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white mb-4">
                      <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif italic text-2xl font-bold">API Security</h3>
                    <p className="text-sm text-white/60 leading-relaxed">
                      Explore OAuth2, JWT, and API Keys to ensure your services are protected from unauthorized access.
                    </p>
                    <button className="text-xs uppercase tracking-widest font-bold border-b border-white pb-1">Read More</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
