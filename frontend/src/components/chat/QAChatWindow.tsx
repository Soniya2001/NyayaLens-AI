import React, { useState, useEffect } from 'react';
import { askQuestion } from '../../services/api';
import type { ChatResponse, Citation } from '../../types';
import { Send, Bot, User, Bookmark, ArrowRight, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';

interface Props {
  docId: string;
  docTitle: string;
  isLegalDocument?: boolean;
  documentType?: string;
}

interface MessageItem {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  citations?: Citation[];
  suggestedFollowups?: string[];
}

export const QAChatWindow: React.FC<Props> = ({ docId, docTitle, isLegalDocument = true, documentType = "Document" }) => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Re-initialize greeting when document changes
    const initialMsg: MessageItem = isLegalDocument
      ? {
          id: 'init',
          role: 'assistant',
          text: `Hello! I'm your NyayaLens AI assistant for **${docTitle}**. Ask me any question about terms, obligations, or provisions in this contract. All answers are strictly grounded in your document with page citations.`,
          suggestedFollowups: [
            'What are my main obligations under this contract?',
            'What notice period or exit terms apply?',
            'What are the key terms in this agreement?'
          ]
        }
      : {
          id: 'init',
          role: 'assistant',
          text: `Hello! I'm your NyayaLens AI assistant for **${docTitle}** (${documentType}). Ask me any question about the content, topics, or key information in this document. All answers are strictly grounded in the text.`,
          suggestedFollowups: [
            'What are the main topics covered in this document?',
            'Summarize the key questions or challenges in this text',
            'What are the core takeaways?'
          ]
        };

    setMessages([initialMsg]);
  }, [docId, docTitle, isLegalDocument, documentType]);

  const handleSend = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim() || loading) return;

    const userMsgId = `u_${Date.now()}`;
    const userMsg: MessageItem = { id: userMsgId, role: 'user', text: q };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const res: ChatResponse = await askQuestion(docId, q);
      const aiMsg: MessageItem = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        text: res.answer,
        citations: res.citations,
        suggestedFollowups: res.suggested_followups
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          text: 'Apologies, an error occurred while analyzing the document chunks. Please try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[650px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Bot className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <span>{isLegalDocument ? 'Evidence-Grounded Legal Q&A' : 'Evidence-Grounded Document Q&A'}</span>
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            </h3>
            <p className="text-[11px] text-slate-400 truncate max-w-xs">{docTitle}</p>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Page & Quote Cited</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-2xl rounded-2xl p-4 space-y-3 ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 rounded-br-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              <div className="flex items-center space-x-2 text-xs font-semibold opacity-75">
                {msg.role === 'user' ? (
                  <>
                    <span>You</span>
                    <User className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    <Bot className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-indigo-300">NyayaLens Assistant</span>
                  </>
                )}
              </div>

              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.text}
              </div>

              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                  <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider flex items-center space-x-1">
                    <Bookmark className="w-3 h-3" />
                    <span>Supporting Document Evidence ({msg.citations.length} Sources)</span>
                  </div>
                  <div className="space-y-2">
                    {msg.citations.map((cite, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900 border border-slate-800/80 rounded-lg p-2.5 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-indigo-300 font-medium text-[11px]">
                          <span>Page {cite.page_number}</span>
                          <span className="text-slate-500">{cite.section_title}</span>
                        </div>
                        <p className="text-slate-300 font-mono text-[11px] italic">
                          "{cite.verbatim_quote}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-800/60 space-y-1.5">
                  <span className="text-[11px] font-medium text-slate-400">Suggested Questions:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedFollowups.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sug)}
                        className="text-xs text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/40 px-2.5 py-1 rounded-md transition-colors text-left flex items-center space-x-1"
                      >
                        <span>{sug}</span>
                        <ArrowRight className="w-3 h-3 opacity-70" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3 text-slate-400 text-xs">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              <span>Analyzing document chunks & verifying page citations...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder={isLegalDocument ? "Ask any question about this contract..." : "Ask any question about this document..."}
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white p-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
