import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const PERIOD_FILE_MAP: Record<string, string> = {
  'all': 'all.json',
  'moreThanSixMonths': 'more-than-six-months.json',
  'underSixMonths': 'under-six-months.json',
  'threeMonths': 'three-months.json',
  'thirtyDays': 'thirty-days.json',
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const period = searchParams.get('period') || 'all';

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
  }

  const fileName = PERIOD_FILE_MAP[period] || `${period}.json`;

  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'companies', slug, fileName);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Data not found' }, { status: 404 });
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    const questions = JSON.parse(data);
    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json({ error: 'Server error', details: error instanceof Error ? error.message : error }, { status: 500 });
  }
} 