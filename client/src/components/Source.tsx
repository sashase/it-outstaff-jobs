import Link from "next/link"

export default function Source(props: any) {
  return (
    <div className="flex gap-7 items-center auto-cols-min auto-rows-min">
      <h2 className="text-center text-xl font-lg py-">{props.name}</h2>
      <Link
        href={`https://t.me/${props.link}`}
        className="bg-sky-500 text-white text-md font-md py-1.5 px-3 rounded-lg shadow-lg hover:bg-sky-600 transition-all">
        Go to source
      </Link>
      <button className="mx-3" onClick={(e) => props.handleDelete(e)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id={props.id}
          viewBox="0 0 128 128"
          width="40"
          fill="#4BA3E3">
          <title />
          <path d="M64,0a64,64,0,1,0,64,64A64.07,64.07,0,0,0,64,0Zm0,122a58,58,0,1,1,58-58A58.07,58.07,0,0,1,64,122Z" />
          <path d="M92.12,35.79a3,3,0,0,0-4.24,0L64,59.75l-23.87-24A3,3,0,0,0,35.88,40L59.76,64,35.88,88a3,3,0,0,0,4.25,4.24L64,68.25l23.88,24A3,3,0,0,0,92.13,88L68.24,64,92.13,40A3,3,0,0,0,92.12,35.79Z" />
        </svg>
      </button>
    </div>
  )
}
