import Link from "next/link";

export default function PostsContent({ posts }: { posts: string[] }) {
  return (
    <ul>
      no posts yet
      {/* {posts.map((slug) => (
        <li key={slug} className="mb-2 last:mb-0">
          <Link href={`/posts/${slug}`} className="">
            {slug}
          </Link>
        </li>
      ))} */}
    </ul>
  );
}
