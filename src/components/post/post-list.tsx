import { PostsListProps } from "@/lib/types";
import { PostCard } from "./post-card";

export function PostList({ posts }: PostsListProps) {
    return (
        <div className="grid grid-cols-3 gap-6 mt-12">
            {posts.map((post, idx) => (
                <PostCard post={post} key={idx} />
            ))}
        </div>
    )
}