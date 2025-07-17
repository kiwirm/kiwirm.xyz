import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const postsDir = path.join(process.cwd(), 'src/posts');
  let slugs: string[] = [];
  try {
    slugs = fs.readdirSync(postsDir)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace(/\.md$/, ''));
  } catch (e) {}
  return NextResponse.json(slugs);
}
