import Source from "@/components/Source"
import axios from "axios"
import { useEffect, useState } from "react"

export default function Sources() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  const [sources, setSources] =
    useState<{ name: string; link: string; id: number }[]>()
  const [fields, setFields] = useState<{ name: string; link: string }>({
    name: "",
    link: ""
  })
  const [error, setError] = useState<string>("")
  const [message, setMessage] = useState<string>("")

  const getSources = async (): Promise<void> => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/sources`)
      setSources(data)
    } catch ({ response }: any) {
      console.log(response.data.detail)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFields((prevState) => {
      if (e.target.name === "name") {
        return {
          name: e.target.value,
          link: prevState.link
        }
      }
      return {
        name: prevState.name,
        link: e.target.value
      }
    })
  }

  const handleClick = async (e: React.MouseEvent<HTMLElement>): Promise<void> => {
    e.preventDefault()
    if (fields.name === "" || fields.link === "")
      return setError("Fields can not be empty!")
    try {
      const response = await axios.post(`${API_BASE_URL}/sources`, fields)
      if (response.status === 200) {
        setMessage("Success")
        await getSources()
        return setError("")
      }
      return setError("Something went wrong!")
    } catch ({ response }: any) {
      setError(response.data.detail)
    }
  }

  const handleDelete = async (e: any): Promise<void> => {
    const id = e.target.id
    try {
      const response = await axios.delete(`${API_BASE_URL}/sources/${id}`)
      if (response.status === 200) {
        await getSources()
        return setError("")
      }
    } catch ({ response }: any) {
      setError(response.data.detail)
    }
  }

  useEffect(() => {
    getSources()
  }, [])

  return (
    <main className="my-10">
      <div className="flex flex-col gap-3 my-3">
        <h3 className="text-3xl font-md">Add a source</h3>
        <form>
          <p>Name:</p>
          <input
            type="text"
            name="name"
            value={fields.name}
            onChange={handleChange}
            className="w-1/5 px-3 py-1.5 rounded-md shadow-sm border border-sky-100"
          />
          <p>Link:</p>
          <input
            type="text"
            name="link"
            value={fields.link}
            onChange={handleChange}
            className="w-1/5 px-3 py-1.5 rounded-md shadow-sm border border-sky-100"
          />
          <br />
          {error ? (
            <p className="text-red-500 font-md">{error}</p>
          ) : (
            <p className="text-green-500 font-md">{message}</p>
          )}
          <button
            type="submit"
            onClick={handleClick}
            className="w-1/5 bg-sky-500 text-white text-md font-md py-1.5 px-3 my-5 rounded-lg shadow-lg hover:bg-sky-600 transition-all">
            Add
          </button>
        </form>
      </div>
      <div className="flex flex-col gap-5 my-5">
        {sources ? (
          <>
            <h3 className="text-3xl font-md">Current sources:</h3>
            {sources.map((source, key: number) => {
              return (
                <Source
                  name={source.name}
                  link={source.link}
                  id={source.id}
                  key={key}
                  handleDelete={handleDelete}
                />
              )
            })}
          </>
        ) : (
          <h3>No sources</h3>
        )}
      </div>
    </main>
  )
}
