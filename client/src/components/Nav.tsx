import Link from "next/link"

export default function Nav() {
  return (
    <nav className="max-w-xs md:max-w-2xl lg:max-w-6xl my-5 mx-auto flex justify-between items-center text-lg md:text-xl">
      <Link href={"/"} className="text-3xl">
        StaffAI
      </Link>
      <div className="flex gap-8 mr-0 md:mr-10 lg:mr-20">
        <Link href={"/sources"}>Sources</Link>
        <Link href={"/analytics"}>Analytics</Link>
      </div>
    </nav>
  )
}
