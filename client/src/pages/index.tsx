import Post from "@/components/Post"
import { PostType } from "@/types/post.type"
import axios from "axios"
import { useEffect, useState } from "react"

export default function Home() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  const [posts, setPosts] = useState<PostType[]>()

  const getPosts = async (): Promise<void> => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/posts`)
      setPosts(data)
    } catch ({ response }: any) {
      console.log(response.data.detail)
    }
  }

  useEffect(() => {
    getPosts()
  }, [])

  return (
    <main>
      {posts ? (
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-8 items-baseline">
          {posts.map((post, key) => {
            return (
              <Post
                key={key}
                id={post.id}
                text={post.text}
                structured_text={post.structured_text}
                author={post.author}
                date={post.date}
                source_id={post.source_id}
                post_link={post.post_link}
              />
            )
          })}
        </main>
      ) : (
        <h3 className="text-center text-4xl font-md my-8">No posts</h3>
      )}
    </main>
  )
}
