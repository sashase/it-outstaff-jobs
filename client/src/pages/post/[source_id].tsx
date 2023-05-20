import Job from "@/components/Job"
import { JobType } from "@/types/job.type"
import { PostType } from "@/types/post.type"
import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function PostDetails() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  const { query, isReady } = useRouter()

  const [post, setPost] = useState<PostType>()
  const [jobs, setJobs] = useState<JobType[]>()
  const [jobsLength, setJobsLength] = useState<number>(0)

  const getPost = async (): Promise<void> => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/posts/${query.source_id}/${query.id}`
      )
      setPost(data)
    } catch ({ response }: any) {
      console.log(response.data.detail)
    }
  }

  const getJobs = async (): Promise<void> => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/jobs/${query.source_id}/${query.id}`
      )
      setJobs(data)
      setJobsLength(data.length)
    } catch ({ response }: any) {
      console.log(response.data.detail)
    }
  }

  useEffect(() => {
    if (!isReady) return
    getPost()
    getJobs()
  }, [isReady])

  return (
    <main>
      {post ? (
        <div className="flex flex-col gap-5  items-center p-4">
          <h2 className="font-medium text-4xl">Message #{post.id}</h2>
          <hr className="border-1 border-gray-500 border-opacity-10 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col gap-3">
              <h3 className="font-medium text-3xl py-5 text-center">Content</h3>
              <p>{post.text}</p>
              <div className="flex justify-between">
                <p>
                  Posted date: <span className="font-medium">{post.date}</span>
                </p>
                <p>
                  Author id:{" "}
                  <span className="font-medium">
                    {post.author ? post.author : "N/A"}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-3xl py-5 text-center">
                Found <span className="font-bold">{jobsLength}</span> job
                {jobsLength > 1 && "s"}:
              </h3>
              <div className="flex flex-col gap-5">
                {jobs?.map((job, key) => {
                  return (
                    <Job
                      key={key}
                      number={key}
                      id={job.id}
                      post_id={job.post_id}
                      type={job.type}
                      seniority={job.seniority}
                      location={job.location}
                      rate={job.rate}
                      stack={job.stack}
                      english_level={job.english_level}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h3>Not found</h3>
      )}
    </main>
  )
}
