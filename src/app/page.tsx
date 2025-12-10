import { PostList } from "@/components/post/post-list";
import { getAllPosts } from "@/lib/db/queries";

export default async function Home() {
  const posts = await getAllPosts()
  return (
    <main className="py-10">
      <div className="max-w-7xl m-auto px-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to the blog</h1>
        {
          posts.length === 0 ?
            <h2 className="text-xl font-medium text-center py-10">No Posts Yet.</h2> :
            <PostList posts={posts} />
        }

      </div>
    </main>
  );
}
