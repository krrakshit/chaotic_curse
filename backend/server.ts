import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// Helper: map period to file name
const periodFileMap: Record<string, string> = {
  'all': 'all.json',
  'moreThanSixMonths': 'more-than-six-months.json',
  'underSixMonths': 'six-months.json',
  'threeMonths': 'three-months.json',
  'thirtyDays': 'thirty-days.json',
};
function getPeriodFileName(period: string) {
  return periodFileMap[period] || `${period}.json`;
}

// Endpoint to get the full companies list
app.get('/api/companies-list', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'companies-list.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read companies list.' });
    }
    res.type('application/json').send(data);
  });
});
// Endpoint to get a specific company file by period (e.g., /api/company/:slug/:period)
app.get('/api/company/:slug/:period', (req, res) => {
  const { slug, period } = req.params;
  const fileName = getPeriodFileName(period);
  const filePath = path.join(__dirname, 'data', 'companies', slug, fileName);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).json({ error: 'Company period file not found.' });
    }
    // If the file contains an array, return as questions for compatibility
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        res.json(parsed);
      } else {
        res.json({ questions: parsed });
      }
    } catch (e) {
      res.status(500).json({ error: 'Invalid JSON format.' });
    }
  });
});

// Endpoint to get all questions for a company across all periods
app.get('/api/company/:slug', (req, res) => {
  const { slug } = req.params;
  const periods = Object.keys(periodFileMap);
  const questions: Record<string, any[]> = {};
  let foundAny = false;
  periods.forEach(period => {
    const fileName = getPeriodFileName(period);
    const filePath = path.join(__dirname, 'data', 'companies', slug, fileName);
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        questions[period] = JSON.parse(data);
        foundAny = true;
      }
    } catch (e) {
      // skip missing or invalid files
    }
  });
  if (!foundAny) {
    return res.status(404).json({ error: 'No questions found for this company.' });
  }
  res.json({ questions });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
