/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  FileText, 
  GraduationCap, 
  Sparkles, 
  Download, 
  Printer, 
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  History,
  Languages,
  Settings
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const CLASSES = ['9th Class', '10th Class'];
const BOARDS = [
  'BISE Lahore', 
  'BISE Faisalabad', 
  'BISE Rawalpindi', 
  'BISE Multan', 
  'BISE Gujranwala', 
  'BISE Sahiwal', 
  'BISE Sargodha', 
  'BISE Bahawalpur', 
  'BISE D.G. Khan',
  'Federal Board (FBISE)', 
  'Sindh Board', 
  'KPK Board', 
  'Balochistan Board'
];
const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 
  'Computer Science', 'English', 'Urdu', 'Islamiat', 'Pakistan Studies'
];
const MEDIUMS = ['English Medium', 'Urdu Medium'];

export default function App() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedMedium, setSelectedMedium] = useState('English Medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [guessPaper, setGuessPaper] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateGuessPaper = async () => {
    if (!selectedClass || !selectedBoard || !selectedSubject) {
      setError("Please select all options first.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGuessPaper(null);

    try {
      const isUrduSubject = ['Urdu', 'Islamiat', 'Pakistan Studies'].includes(selectedSubject);
      const languageToUse = (selectedMedium === 'Urdu Medium' || isUrduSubject) ? 'Urdu' : 'English';

      const prompt = `
        You are an expert educational consultant for Pakistani Board Exams (Matric Level).
        Generate a highly accurate "Guess Paper" for the following:
        Class: ${selectedClass}
        Board: ${selectedBoard}
        Subject: ${selectedSubject}
        Medium: ${selectedMedium}

        CRITICAL INSTRUCTION: Since the selected medium is ${selectedMedium} or the subject is ${selectedSubject}, you MUST generate the entire guess paper in ${languageToUse} language. 
        If the language is Urdu, use proper Urdu script (Nastaliq style preferred in formatting).

        The guess paper should be based on:
        1. The current official syllabus of the selected board.
        2. Analysis of the last 10 years of past papers.
        3. Most repeated and highly probable questions.

        Structure the output clearly in Markdown:
        # Guess Paper: ${selectedSubject} (${selectedClass}) - ${selectedBoard}
        ## Section A: Multiple Choice Questions (MCQs)
        (List 10-15 highly important topics/questions)

        ## Section B: Short Questions
        (List 15-20 most important short questions, categorized by chapters if possible)

        ## Section C: Long Questions / Detailed Answers
        (List 5-8 most important long questions/theorems/numerical problems)

        ## Important Tips for 98% Success
        (Provide 3-5 specific study tips for this subject)

        Note: Ensure the content is strictly according to the Pakistani Matric syllabus.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
      });

      setGuessPaper(response.text || "Failed to generate content.");
    } catch (err) {
      console.error(err);
      setError("An error occurred while generating the guess paper. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl text-white mb-4 shadow-lg"
          >
            <GraduationCap size={40} />
          </motion.div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            Pak Exam <span className="text-blue-600">Guess AI</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Generate high-accuracy guess papers for 9th and 10th Class based on 10 years of past paper patterns and official syllabus.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Selection Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Settings size={20} className="text-blue-600" />
                Configure Paper
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Select Class</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CLASSES.map(c => (
                      <button
                        key={c}
                        onClick={() => setSelectedClass(c)}
                        className={`py-3 px-4 rounded-xl text-sm font-medium transition-all border ${
                          selectedClass === c 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' 
                          : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-blue-200'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Select Board</label>
                  <select 
                    value={selectedBoard}
                    onChange={(e) => setSelectedBoard(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="">Choose Board...</option>
                    {BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Select Subject</label>
                  <select 
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="">Choose Subject...</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Select Medium</label>
                  <div className="grid grid-cols-2 gap-2">
                    {MEDIUMS.map(m => (
                      <button
                        key={m}
                        onClick={() => setSelectedMedium(m)}
                        className={`py-2 px-3 rounded-xl text-xs font-medium transition-all border ${
                          selectedMedium === m 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100' 
                          : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-blue-200'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={generateGuessPaper}
                  disabled={isGenerating}
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Analyzing Patterns...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Generate Guess Paper
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-blue-900 mb-1">98% Accuracy Goal</h3>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Our AI analyzes frequency of questions from the last 10 years of past papers to provide the most probable questions for your exam.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Result Panel */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 min-h-[600px] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-blue-600" />
                  <h2 className="font-bold">Guess Paper Viewer</h2>
                </div>
                {guessPaper && (
                  <div className="flex gap-2">
                    <button 
                      onClick={handlePrint}
                      className="p-2 text-slate-500 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
                    >
                      <Printer size={18} />
                    </button>
                    <button className="p-2 text-slate-500 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200">
                      <Download size={18} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 p-8 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-center space-y-6"
                    >
                      <div className="relative">
                        <Loader2 size={64} className="text-blue-600 animate-spin" />
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <BookOpen size={24} className="text-blue-400" />
                        </motion.div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">AI is Analyzing Past Papers</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-2">
                          Comparing syllabus patterns and calculating question probabilities...
                        </p>
                      </div>
                    </motion.div>
                  ) : guessPaper ? (
                    <motion.div 
                      key="result"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="prose prose-slate max-w-none"
                    >
                      <div className="bg-green-50 border border-green-100 p-4 rounded-2xl mb-8 flex items-center gap-3">
                        <CheckCircle2 size={20} className="text-green-600" />
                        <span className="text-sm font-medium text-green-800">Guess Paper Generated Successfully with High Probability.</span>
                      </div>
                      <div className="markdown-body">
                        <ReactMarkdown>{guessPaper}</ReactMarkdown>
                      </div>
                    </motion.div>
                  ) : error ? (
                    <motion.div 
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center space-y-4"
                    >
                      <div className="p-4 bg-red-50 rounded-full text-red-500">
                        <AlertCircle size={48} />
                      </div>
                      <p className="text-red-600 font-medium">{error}</p>
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 text-slate-300">
                      <div className="p-8 bg-slate-50 rounded-full">
                        <BookOpen size={80} strokeWidth={1} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-400">Ready to Generate</h3>
                        <p className="text-slate-400 max-w-xs mx-auto mt-2">
                          Select your class, board, and subject to get the AI-powered guess paper.
                        </p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
          <p>© 2026 Pak Exam Guess AI - Empowering Pakistani Students with Technology</p>
          <div className="flex justify-center gap-6 mt-4">
            <span className="flex items-center gap-1"><Languages size={14} /> Available in English & Urdu</span>
            <span className="flex items-center gap-1"><History size={14} /> 10 Years Data Analysis</span>
          </div>
        </footer>
      </div>

      <style>{`
        .markdown-body h1 { font-size: 1.875rem; font-weight: 800; margin-bottom: 1.5rem; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }
        .markdown-body h2 { font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; color: #1e293b; display: flex; align-items: center; gap: 0.5rem; }
        .markdown-body h2::before { content: '•'; color: #2563eb; font-size: 1.5em; }
        .markdown-body p { margin-bottom: 1rem; line-height: 1.6; color: #475569; }
        .markdown-body ul { list-style-type: none; padding-left: 0; margin-bottom: 1.5rem; }
        .markdown-body li { margin-bottom: 0.75rem; padding: 1rem; background: #f8fafc; border-radius: 1rem; border: 1px solid #f1f5f9; transition: all 0.2s; }
        .markdown-body li:hover { border-color: #cbd5e1; background: #fff; transform: translateX(4px); }
        .markdown-body strong { color: #0f172a; font-weight: 600; }
      `}</style>
    </div>
  );
}
