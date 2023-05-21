import React from "react"
import { Chart, LineElement, PointElement } from "chart.js"
import { Line } from "react-chartjs-2"
import { JobType } from "@/types/job.type"

Chart.register(PointElement, LineElement)

export default function JobsTimelineChart({ jobs }: any) {
  const months: any = []
  const jobCounts: number[] = []

  jobs.forEach((job: JobType) => {
    const jobDate = new Date(job.date)
    const monthYear = `${jobDate.getMonth() + 1}/${jobDate.getFullYear()}`

    const monthIndex = months.indexOf(monthYear)
    if (monthIndex === -1) {
      months.push(monthYear)
      jobCounts.push(1)
    } else {
      jobCounts[monthIndex]++
    }
  })

  months.reverse()
  jobCounts.reverse()

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Job Propositions Timeline",
        data: jobCounts,
        fill: false,
        borderColor: "rgba(75, 192, 192)"
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Month"
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Number of Jobs"
        },
        ticks: {
          precision: 0
        }
      }
    }
  }

  return (
    <div>
      <h2>Propositions Timeline</h2>
      <Line data={chartData} options={chartOptions} />
    </div>
  )
}
