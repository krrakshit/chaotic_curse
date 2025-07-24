// src/lib/csv-parser.ts
import Papa from 'papaparse';
import { Question } from './types';

export async function parseCSV(csvContent: string): Promise<Question[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // Keep as strings initially
      complete: (results) => {
        try {
          const questions: Question[] = results.data.map((row: any, index: number) => ({
            id: parseInt(row.ID) || index + 1,
            title: row.Title || '',
            difficulty: row.Difficulty || 'Medium',
            acceptanceRate: parseFloat(row['Acceptance %']?.replace('%', '') || '0'),
            frequency: parseFloat(row['Frequency %']?.replace('%', '') || '0'),
            url: row.URL || '',
            tags: [], // Not present in your CSV structure
            isPremium: false // Not present in your CSV structure
          }));
          resolve(questions.filter(q => q.title)); // Filter out empty rows
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => reject(error)
    });
  });
}