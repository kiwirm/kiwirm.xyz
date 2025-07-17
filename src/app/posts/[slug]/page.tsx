import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { markdownToHtml } from '../../../utils/markdownToHtml';

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'public/posts');
  const files = fs.readdirSync(postsDir);
  return files.filter(f => f.endsWith('.md')).map(f => ({ slug: f.replace(/\.md$/, '') }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const postPath = path.join(process.cwd(), 'public/posts', `${slug}.md`);
  if (!fs.existsSync(postPath)) return notFound();
  const file = fs.readFileSync(postPath, 'utf8');
  const { content, data } = matter(file);
  const html = await markdownToHtml(content);

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">{data.title || slug}</h1>
      <article className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
