import JobsByEnglishChart from "@/components/JobsByEnglishChart"
import JobsByStackChart from "@/components/JobsByStackChart"
import JobsTimelineChart from "@/components/JobsTimelineChart"
import NumberOfJobsChart from "@/components/NumberOfJobsChart"
import axios from "axios"
import { useEffect, useState } from "react"

export default function Analytics() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  const [jobs, setJobs] = useState()
  const [typeAnalytics, setTypeAnalytics] = useState<{
    total: number
    lookfor: number
    available: number
  }>()

  const [stackAnalytics, setStackAnalytics] = useState<{
    candidates: {
      frontend: number
      backend: number
      databases: number
      management: number
    }
    jobs: {
      frontend: number
      backend: number
      databases: number
      management: number
    }
  }>()

  const [englishAnalytics, setEnglishAnalytics] = useState<{
    candidates: {
      basic: number
      intermediate: number
      upperIntermediate: number
      fluent: number
    }
    jobs: {
      basic: number
      intermediate: number
      upperIntermediate: number
      fluent: number
    }
  }>()

  const getJobs = async (): Promise<void> => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/jobs/`)
      setJobs(data)
    } catch ({ response }: any) {
      console.log(response.data.detail)
    }
  }

  useEffect(() => {
    getJobs()
  }, [])

  return (
    <div className="text-center my-10">
      <h2 className="font-bold my-16 text-4xl">Analytics 01.01 - 31.03</h2>
      <div>
        <div>
          <h3 className="text-3xl font-bold my-10">
            Total number of propositions by type
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            <div className="w-[80%] m-auto">
              {jobs ? (
                <NumberOfJobsChart
                  jobs={jobs}
                  setTypeAnalytics={setTypeAnalytics}
                />
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="flex flex-col gap-5 text-lg">
              {typeAnalytics ? (
                <>
                  <p className="py-5">
                    <span className="font-bold">
                      Total number of propositions:
                    </span>{" "}
                    {typeAnalytics.total}
                  </p>
                  <p className="py-5">
                    <span className="font-bold">Candidates total:</span>{" "}
                    {typeAnalytics.available}
                  </p>
                  <p className="py-5">
                    <span className="font-bold">Jobs total:</span>{" "}
                    {typeAnalytics.lookfor}
                  </p>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-bold my-10">Propositions timeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-5 items-center">
            <div className="w-[100%] m-auto">
              {jobs ? <JobsTimelineChart jobs={jobs} /> : <p>Loading...</p>}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-bold my-10">
            Total number of propositions by stack
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-5 items-center">
            <div className="w-[100%] m-auto">
              {jobs ? (
                <JobsByStackChart
                  jobs={jobs}
                  setStackAnalytics={setStackAnalytics}
                />
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="text-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {stackAnalytics ? (
                <>
                  <div>
                    <h4 className="font-bold text-2xl py-3">Frontend</h4>
                    <p>Candidates:{stackAnalytics.candidates.frontend}</p>
                    <p>Jobs:{stackAnalytics.jobs.frontend}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-2xl py-3">Backend</h4>
                    <p>Candidates:{stackAnalytics.candidates.backend}</p>
                    <p>Jobs:{stackAnalytics.jobs.backend}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-2xl py-3">Databases</h4>
                    <p>Candidates:{stackAnalytics.candidates.databases}</p>
                    <p>Jobs:{stackAnalytics.jobs.databases}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-2xl py-3">Management</h4>
                    <p>Candidates:{stackAnalytics.candidates.management}</p>
                    <p>Jobs:{stackAnalytics.jobs.management}</p>
                  </div>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-bold my-10">
            Total number of propositions by English level
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-5 items-center">
            <div className="w-[100%] m-auto">
              {jobs ? (
                <JobsByEnglishChart
                  jobs={jobs}
                  setEnglishAnalytics={setEnglishAnalytics}
                />
              ) : (
                <p>Loading...</p>
              )}
            </div>

            <div className="text-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {englishAnalytics ? (
                <>
                  <div>
                    <h4 className="font-bold text-2xl py-3">Basic</h4>
                    <p>Candidates:{englishAnalytics.candidates.basic}</p>
                    <p>Jobs:{englishAnalytics.jobs.basic}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-2xl py-3">Intermediate</h4>
                    <p>Candidates:{englishAnalytics.candidates.intermediate}</p>
                    <p>Jobs:{englishAnalytics.jobs.intermediate}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-2xl py-3">
                      Upper-Intermediate
                    </h4>
                    <p>
                      Candidates:
                      {englishAnalytics.candidates.upperIntermediate}
                    </p>
                    <p>Jobs:{englishAnalytics.jobs.upperIntermediate}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-2xl py-3">Fluent</h4>
                    <p>Candidates:{englishAnalytics.candidates.fluent}</p>
                    <p>Jobs:{englishAnalytics.jobs.fluent}</p>
                  </div>
                </>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
