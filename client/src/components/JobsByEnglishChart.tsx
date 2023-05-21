import { BarElement, CategoryScale, Chart, LinearScale } from "chart.js"
import { useEffect } from "react"
import { Bar } from "react-chartjs-2"

Chart.register(LinearScale, CategoryScale, BarElement)

export default function JobsByEnglishChart({ jobs, setEnglishAnalytics }: any) {
  const levels: string[] = ["Basic", "Intermediate", "Upper-Intermediate", "Fluent"]
  const candidatesCounts: number[] = [0, 0, 0, 0]
  const jobsCounts: number[] = [0, 0, 0, 0]
  const totalCounts: number[] = [0, 0, 0, 0]

  useEffect(() => {
    setEnglishAnalytics({
      candidates: {
        basic: candidatesCounts[0],
        intermediate: candidatesCounts[1],
        upperIntermediate: candidatesCounts[2],
        fluent: candidatesCounts[3]
      },
      jobs: {
        basic: jobsCounts[0],
        intermediate: jobsCounts[1],
        upperIntermediate: jobsCounts[2],
        fluent: jobsCounts[3]
      }
    })
  }, [])

  console.log(jobs)
  jobs.forEach((job: any) => {
    if (job.english_level === "Basic") {
      if (job.type === "lookfor") jobsCounts[0]++
      else if (job.type === "available") candidatesCounts[0]++
      totalCounts[0]++
    } else if (job.english_level === "Intermediate") {
      if (job.type === "lookfor") jobsCounts[1]++
      else if (job.type === "available") candidatesCounts[1]++
      totalCounts[1]++
    } else if (job.english_level === "Upper-intermediate") {
      if (job.type === "lookfor") jobsCounts[2]++
      else if (job.type === "available") candidatesCounts[2]++
      totalCounts[2]++
    } else if (job.english_level === "Fluent") {
      if (job.type === "lookfor") jobsCounts[3]++
      else if (job.type === "available") candidatesCounts[3]++
      totalCounts[3]++
    }
  })

  const chartData = {
    labels: levels,
    datasets: [
      {
        label: "Job Propositions by English level",
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
