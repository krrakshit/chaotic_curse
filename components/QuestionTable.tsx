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
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select 
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="all">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Question
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Difficulty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => {
                    if (sortField === 'frequency') {
                      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortField('frequency');
                      setSortDirection('desc');
                    }
                  }}>
                Frequency %
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acceptance %
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedQuestions.map((question, index) => (
              <tr key={`${question.id}-${index}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <a 
                    href={question.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {question.title}
                  </a>
                  {question.isPremium && (
                    <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                      Premium
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {question.frequency.toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {question.acceptanceRate.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}