import { JobType } from "@/types/job.type"
import { ArcElement, Chart, Legend, Tooltip } from "chart.js"
import { useEffect } from "react"
import { Pie } from "react-chartjs-2"

Chart.register(ArcElement, Tooltip, Legend)

export default function NumberOfJobsChart({ jobs, setTypeAnalytics }: any) {
  const jobTypes: string[] = ["Jobs", "Candidates"]
  const jobsCounts: number[] = [0, 0]

  useEffect(() => {
    setTypeAnalytics({
      total: jobs.length,
      lookfor: jobsCounts[0],
      available: jobsCounts[1]
    })
  }, [])

  jobs.forEach((job: JobType) => {
    if (
      (job.type === "look for",
      job.type === "lookfor" || job.type === "lookingfor")
    ) {
      jobsCounts[0]++
    } else if (job.type === "available") {
      jobsCounts[1]++
    }
  })

  const chartData = {
    labels: jobTypes,
    datasets: [
      {
        label: "Job Propositions",
        data: jobsCounts,
        backgroundColor: ["rgba(75, 192, 192)", "rgba(255, 99, 132)"]
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom"
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = jobTypes[context.dataIndex]
            const count = jobsCounts[context.dataIndex]
            return `${label}: ${count}`
          }
        }
      }
    }
  }
  return <Pie data={chartData} options={chartOptions} />
}
