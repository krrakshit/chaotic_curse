// src/components/QuestionTable.tsx
'use client';

import { useState } from 'react';
import { Question } from '@/lib/types';

interface QuestionTableProps {
  questions: Question[];
}

export default function QuestionTable({ questions }: QuestionTableProps) {
  const [sortField, setSortField] = useState<keyof Question>('frequency');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const filteredQuestions = questions.filter(q => 
    difficultyFilter === 'all' || q.difficulty === difficultyFilter
  );

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    
    return sortDirection === 'asc' ? 
      (aVal as number) - (bVal as number) : 
      (bVal as number) - (aVal as number);
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-300 bg-green-500/20 border-green-400/30';
      case 'Medium': return 'text-yellow-300 bg-yellow-500/20 border-yellow-400/30';
      case 'Hard': return 'text-red-300 bg-red-500/20 border-red-400/30';
      default: return 'text-gray-300 bg-gray-500/20 border-gray-400/30';
    }
  };

  return (
    <div className="glass rounded-2xl p-6">
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="glass rounded-xl px-4 py-2">
          <select 
            title='Difficulty Filter'
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="bg-transparent text-white border-none outline-none cursor-pointer"
          >
            <option value="all" className="bg-gray-800">All Difficulties</option>
            <option value="Easy" className="bg-gray-800">Easy</option>
            <option value="Medium" className="bg-gray-800">Medium</option>
            <option value="Hard" className="bg-gray-800">Hard</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <div className="w-2 h-2 bg-blue-400 rounded-full" />
          <span>{sortedQuestions.length} questions</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                Question
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                Difficulty
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors duration-300"
                  onClick={() => {
                    if (sortField === 'frequency') {
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortField('frequency');
                      setSortDirection('desc');
                    }
                  }}>
                <div className="flex items-center gap-2">
                  Frequency %
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                Acceptance %
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {sortedQuestions.map((question, index) => (
              <tr key={`${question.id}-${index}`} className="hover:bg-white/5 transition-colors duration-300">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <a 
                      href={question.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-purple-300 font-medium transition-colors duration-300 flex items-center gap-2"
                    >
                      {question.title}
                      <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    {question.isPremium && (
                      <span className="px-2 py-1 text-xs bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 rounded-full border border-yellow-400/30">
                        Premium
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-white font-medium">
                  {question.frequency.toFixed(1)}%
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {question.acceptanceRate.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {sortedQuestions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-400">No questions found for the selected criteria.</p>
        </div>
      )}
    </div>
  );
}