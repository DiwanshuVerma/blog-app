import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { PostCardProps } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function PostCard({ post }: PostCardProps) {
    return (
        <Card className="">
            <CardHeader>
                <Link href={`/post/${post.slug}`} className="hover:underline">
                    <CardTitle className="text-2xl">
                        {post.title}
                    </CardTitle>
                </Link>
                <CardDescription>
                    By {post.author.name} — {formatDate(post.createdAt)}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <span className="break-words">{post.description}</span>
            </CardContent>
        </Card>
    )
}