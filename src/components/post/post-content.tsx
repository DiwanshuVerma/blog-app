import { PostContentProps } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { formatDate } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";
import { DeletePostButton } from "./delete-post-btn";
import { Pencil } from "lucide-react";

export function PostContent({ post, isAuthor }: PostContentProps) {
    return (
        <Card className="">
            <CardHeader>
                <CardTitle className="text-3xl">
                    {post.title}
                </CardTitle>
                <CardDescription>
                    <span>By {post.author.name} — {formatDate(post.createdAt)}</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-lg mb-6">{post.description}</p>
                <p className="text-2xl mb-6 break-words">{post.content}</p>
            </CardContent>

            {isAuthor && (
                <CardFooter>
                    <div className="flex gap-2">
                        <Button asChild variant={"outline"}>
                            <Link href={`/post/edit/${post.slug}`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                            </Link>
                        </Button>
                        <DeletePostButton postId={post.id} />
                    </div>
                </CardFooter>
            )}
        </Card>
    )
}