import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default function PostsPage() {
  const postsDir = path.join(process.cwd(), 'public/posts');
  const files = fs.readdirSync(postsDir);
  const posts = files.filter(f => f.endsWith('.md')).map(f => ({
    slug: f.replace(/\.md$/, ''),
    filename: f,
  }));

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.slug} className="mb-2">
            <Link href={`/posts/${post.slug}`} className="text-blue-600 underline">
              {post.slug}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
