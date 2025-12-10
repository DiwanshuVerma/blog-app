'use client'
import { useQuery } from "@tanstack/react-query"

interface PostResponse {
    id: number,
    title: string
}

export default function Posts() {
    const { isPending, error, data } = useQuery({
        queryKey: ["posts"],
        queryFn: () =>
            fetch("https://dummyjson.com/posts").then(res =>
                res.json()
            )
    })
    console.log(data)
    if(error || !data) return <h1>Error while loading posts</h1>
    if(isPending) return <h1>Loading...</h1>

    return (
        <div>
            {
                data?.map((post: PostResponse) => (
                    <h1>{post.title}</h1>
                ))
            }
        </div>
    )
}