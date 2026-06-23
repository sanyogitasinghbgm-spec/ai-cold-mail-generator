import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/axios';
import { 
  Sparkles, Mail, Send, Check, Copy, History, Search, 
  ExternalLink, MessageSquare, Plus, ChevronRight, X, AlertCircle 
} from 'lucide-react';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const formatParagraphs = (text) => {
    if (!text) return null;
    return text.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') {
        return <div key={index} className="h-3" />;
      }
      return (
        <p key={index} className="mb-3 last:mb-0">
          {paragraph}
        </p>
      );
    });
  };

  // States
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Professional');
  const [targetAudience, setTargetAudience] = useState('Recruiter');
  
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Results & History
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('email'); // email, linkedin, followup
  
  // Copy notifications
  const [copiedSection, setCopiedSection] = useState(null);
  
  // Modal for expanding history item
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  // Fetch History
  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const res = await API.get('/api/email/history');
      if (res.data && res.data.success) {
        setHistory(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a description for your cold email outreach.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const res = await API.post('/api/email/generate', {
        prompt,
        tone,
        targetAudience
      });

      if (res.data && res.data.success) {
        setCurrentCampaign(res.data.data);
        setActiveTab('email');
        setPrompt(''); // Clear prompt input
        // Refresh history list
        fetchHistory();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate email campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => {
      setCopiedSection(null);
    }, 2000);
  };

  // Filtering history
  const filteredHistory = history.filter(item => 
    item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-80px)] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {loading && <Loader message="AI is crafting your outreach campaign... (Subject, Email, LinkedIn DM & Follow-Up)" />}

      {/* Header Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white">
          Outreach Workspace
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mt-1">
          Welcome back, {user?.name}. Describe your campaign target and watch AI generate the sequence.
        </p>
      </div>

      {/* Grid Layout: Controls (Left) vs Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Generator Input Section */}
        <div className="lg:col-span-5 glass-panel p-6 border-white/5">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-400" />
            Campaign Parameters
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-4">
            
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-1.5 ml-1">
                Outreach Prompt / Describe Goal
              </label>
              <textarea
                value={prompt}
                onChange={(e) => { setPrompt(e.target.value); setError(''); }}
                placeholder="e.g. Reach out to the Hiring Manager at Optum for a React developer contract position. Highlight my 3 years of building full-stack applications with Mongoose and Express."
                rows={5}
                className="glass-input w-full resize-none text-sm leading-relaxed"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1.5 ml-1">
                  Tone Style
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="glass-input w-full text-sm bg-cosmic-bg border-white/10 text-white"
                >
                  <option value="Professional">💼 Professional</option>
                  <option value="Persuasive">🔥 Persuasive</option>
                  <option value="Casual">☕ Casual</option>
                  <option value="Assertive">🎯 Bold / Direct</option>
                  <option value="Creative">💡 Creative</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1.5 ml-1">
                  Target Recipient
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="glass-input w-full text-sm bg-cosmic-bg border-white/10 text-white"
                >
                  <option value="Recruiter">Hiring Manager / Recruiter</option>
                  <option value="Lead Developer">Engineering Lead</option>
                  <option value="Client">Potential Client</option>
                  <option value="VP / Executive">Executive / VP</option>
                  <option value="General">General / Other</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-4">
              Craft Campaign Sequence
              <Sparkles className="h-4 w-4" />
            </button>

          </form>
        </div>

        {/* Campaign Results Preview (Right) */}
        <div className="lg:col-span-7 glass-panel border-white/5 min-h-[420px] flex flex-col justify-between overflow-hidden">
          
          {currentCampaign ? (
            <div className="flex flex-col h-full justify-between">
              
              {/* Tab Header */}
              <div className="flex border-b border-white/5 bg-white/2">
                
                <button
                  onClick={() => setActiveTab('email')}
                  className={`flex-1 py-4 text-center text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'email' 
                      ? 'border-brand-500 text-white bg-white/5' 
                      : 'border-transparent text-gray-400 hover:text-white hover:bg-white/1'
                  }`}
                >
                  <Mail className="h-4 w-4" />
                  Cold Email
                </button>

                <button
                  onClick={() => setActiveTab('linkedin')}
                  className={`flex-1 py-4 text-center text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'linkedin' 
                      ? 'border-brand-500 text-white bg-white/5' 
                      : 'border-transparent text-gray-400 hover:text-white hover:bg-white/1'
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                  LinkedIn DM
                </button>

                <button
                  onClick={() => setActiveTab('followup')}
                  className={`flex-1 py-4 text-center text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'followup' 
                      ? 'border-brand-500 text-white bg-white/5' 
                      : 'border-transparent text-gray-400 hover:text-white hover:bg-white/1'
                  }`}
                >
                  <Send className="h-4 w-4" />
                  Follow-Up Mail
                </button>

              </div>

              {/* Tab Content Display */}
              <div className="p-6 flex-grow select-text">
                {activeTab === 'email' && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Subject Line</span>
                        <button
                          onClick={() => handleCopy(currentCampaign.subject, 'subj')}
                          className="text-gray-400 hover:text-white transition-colors p-1"
                        >
                          {copiedSection === 'subj' ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-sm text-gray-200 font-semibold select-all">
                        {currentCampaign.subject}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Email Body</span>
                        <button
                          onClick={() => handleCopy(currentCampaign.body, 'body')}
                          className="text-gray-400 hover:text-white transition-colors p-1"
                        >
                          {copiedSection === 'body' ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-sm text-gray-300 font-sans min-h-[180px] select-all leading-relaxed">
                        {formatParagraphs(currentCampaign.body)}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'linkedin' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">LinkedIn Connection Note</span>
                      <button
                        onClick={() => handleCopy(currentCampaign.linkedinDm, 'linkedin')}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                      >
                        {copiedSection === 'linkedin' ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-sm text-gray-300 font-sans min-h-[220px] select-all leading-relaxed">
                      {formatParagraphs(currentCampaign.linkedinDm)}
                    </div>
                  </div>
                )}

                {activeTab === 'followup' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Follow-Up Email Sequence</span>
                      <button
                        onClick={() => handleCopy(currentCampaign.followUp, 'followup')}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                      >
                        {copiedSection === 'followup' ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-sm text-gray-300 font-sans min-h-[220px] select-all leading-relaxed">
                      {formatParagraphs(currentCampaign.followUp)}
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="p-12 flex flex-col items-center justify-center text-center m-auto">
              <div className="p-4 bg-white/5 text-gray-500 rounded-3xl mb-4 border border-white/5">
                <Send className="h-8 w-8 text-brand-500/40" />
              </div>
              <h3 className="text-lg font-bold text-gray-300">Workspace Inactive</h3>
              <p className="text-gray-500 text-sm mt-2 max-w-sm">
                Complete and submit the outreach generator form on the left to see your personalized outreach copywriting templates.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* History Section (Bottom) */}
      <div className="mt-16 border-t border-white/5 pt-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-gray-400" />
            <h2 className="text-xl font-bold text-white">Campaign Generation History</h2>
          </div>
          
          {/* Search bar */}
          <div className="relative max-w-xs w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Filter by prompt or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input pl-9 py-1.5 text-xs w-full"
            />
          </div>
        </div>

        {/* History Grid */}
        {historyLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-white/10 border-t-brand-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredHistory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map((item) => (
              <div 
                key={item._id}
                onClick={() => setSelectedHistoryItem(item)}
                className="glass-panel p-5 border-white/5 hover:border-brand-500/20 hover:bg-white/3 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                      {item.tone}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-bold text-white mb-2 line-clamp-1 group-hover:text-brand-300 transition-colors">
                    {item.subject}
                  </h4>
                  
                  <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-4">
                    {item.prompt}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-brand-400 font-semibold border-t border-white/5 pt-3 mt-2">
                  <span>Target: {item.targetAudience}</span>
                  <span className="flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    Expand Details
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 text-center text-gray-500 border-white/5">
            No history found. Create your first campaign above to build an archive!
          </div>
        )}
      </div>

      {/* History Detail Modal Overlay */}
      {selectedHistoryItem && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-panel max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-glow-primary border-brand-500/20">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/2">
              <div>
                <h3 className="font-bold text-lg text-white">Campaign Archive Details</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Generated on {new Date(selectedHistoryItem.createdAt).toLocaleString()} | Tone: {selectedHistoryItem.tone}
                </p>
              </div>
              <button 
                onClick={() => setSelectedHistoryItem(null)}
                className="p-1.5 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              
              {/* User Prompt */}
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">User Prompt</span>
                <p className="p-3 bg-white/3 rounded-xl border border-white/5 text-gray-300 text-xs italic leading-relaxed">
                  "{selectedHistoryItem.prompt}"
                </p>
              </div>

              {/* Subject */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Email Subject</span>
                  <button 
                    onClick={() => handleCopy(selectedHistoryItem.subject, 'h_sub')}
                    className="text-gray-400 hover:text-white flex items-center gap-1 text-xs"
                  >
                    {copiedSection === 'h_sub' ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                    Copy
                  </button>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-gray-200 font-semibold select-all">
                  {selectedHistoryItem.subject}
                </div>
              </div>

              {/* Tabs inside modal for content blocks */}
              <div className="space-y-4">
                
                {/* Cold Email */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">1. Cold Email Body</span>
                    <button 
                      onClick={() => handleCopy(selectedHistoryItem.body, 'h_body')}
                      className="text-gray-400 hover:text-white flex items-center gap-1 text-xs"
                    >
                      {copiedSection === 'h_body' ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                      Copy
                    </button>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-gray-300 select-all leading-relaxed font-sans max-h-48 overflow-y-auto">
                    {formatParagraphs(selectedHistoryItem.body)}
                  </div>
                </div>

                {/* LinkedIn DM */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">2. LinkedIn Connection Note</span>
                    <button 
                      onClick={() => handleCopy(selectedHistoryItem.linkedinDm, 'h_li')}
                      className="text-gray-400 hover:text-white flex items-center gap-1 text-xs"
                    >
                      {copiedSection === 'h_li' ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                      Copy
                    </button>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-gray-300 select-all leading-relaxed font-sans max-h-40 overflow-y-auto">
                    {formatParagraphs(selectedHistoryItem.linkedinDm)}
                  </div>
                </div>

                {/* Follow Up */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">3. Follow-Up Email</span>
                    <button 
                      onClick={() => handleCopy(selectedHistoryItem.followUp, 'h_fu')}
                      className="text-gray-400 hover:text-white flex items-center gap-1 text-xs"
                    >
                      {copiedSection === 'h_fu' ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                      Copy
                    </button>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-gray-300 select-all leading-relaxed font-sans max-h-40 overflow-y-auto">
                    {formatParagraphs(selectedHistoryItem.followUp)}
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/5 bg-white/2 flex justify-between items-center">
              <span className="text-xs text-gray-500">Target Recipient: {selectedHistoryItem.targetAudience}</span>
              <button 
                onClick={() => {
                  setPrompt(selectedHistoryItem.prompt);
                  setTone(selectedHistoryItem.tone);
                  setTargetAudience(selectedHistoryItem.targetAudience);
                  setSelectedHistoryItem(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/30 transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                Load to Workspace
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
