import Link from "next/link"

export default function Post(props: any) {
  return (
    <div className="flex flex-col items-center rounded-lg shadow-lg border border-sky-100 p-4">
      <h3 className="font-md text-3xl py-2">Message #{props.id}</h3>
      <p className="text-left">{props.text}</p>
      <Link
        href={{
          pathname: `/post/${props.source_id}`,
          query: { id: props.id }
        }}
        className="bg-sky-500 text-white text-xl font-md py-2 px-4 mt-4 mb-2 rounded-lg shadow-lg hover:bg-sky-600 transition-all">
        Details
      </Link>
    </div>
  )
}
