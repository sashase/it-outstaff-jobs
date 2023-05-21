import { JobType } from "@/types/job.type"
import { BarElement, CategoryScale, Chart, LinearScale } from "chart.js"
import { useEffect } from "react"
import { Bar } from "react-chartjs-2"

Chart.register(LinearScale, CategoryScale, BarElement)

export default function JobsByStackChart({ jobs, setStackAnalytics }: any) {
  const stacks: string[] = ["Frontend", "Backend", "Databases", "Management"]
  const candidatesCounts: number[] = [0, 0, 0, 0]
  const jobsCounts: number[] = [0, 0, 0, 0]
  const totalCounts: number[] = [0, 0, 0, 0]

  useEffect(() => {
    setStackAnalytics({
      candidates: {
        frontend: candidatesCounts[0],
        backend: candidatesCounts[1],
        databases: candidatesCounts[2],
        management: candidatesCounts[3]
      },
      jobs: {
        frontend: jobsCounts[0],
        backend: jobsCounts[1],
        databases: jobsCounts[2],
        management: jobsCounts[3]
      }
    })
  }, [])

  jobs.forEach((job: JobType) => {
    if (
      job.stack === "React" ||
      job.stack === "Vue.js" ||
      job.stack === "Angular" ||
      job.stack === "JavaScript"
    ) {
      if (job.type === "lookfor") jobsCounts[0]++
      else if (job.type === "available") candidatesCounts[0]++
      totalCounts[0]++
    } 
    else if (
      job.stack === "PHP" ||
      job.stack === "Node.js" ||
      job.stack === ".Net" ||
      job.stack === "Django" ||
      job.stack === "Flask" ||
      job.stack === "Ruby on Rails" ||
      job.stack === "Spring Boot" ||
      job.stack === "Express.js"
    ) {
      if (job.type === "lookfor") jobsCounts[1]++
      else if (job.type === "available") candidatesCounts[1]++
      totalCounts[1]++
    } 
    else if (job.stack === "SQL" || job.stack === "MongoDB") {
      if (job.type === "lookfor") jobsCounts[2]++
      else if (job.type === "available") candidatesCounts[2]++
      totalCounts[2]++
    } 
    else if (
      job.stack === "Management" ||
      job.stack === "HR" ||
      job.stack === "PM"
    ) {
      if (job.type === "lookfor") jobsCounts[3]++
      else if (job.type === "available") candidatesCounts[3]++
      totalCounts[3]++
    }
  })

  const chartData = {
    labels: stacks,
    datasets: [
      {
        label: "Job Propositions by Stack",
        data: totalCounts,
        backgroundColor: "rgba(75, 192, 192)"
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  }

  return (
    <div>
      <Bar data={chartData} options={chartOptions} />
    </div>
  )
}
