import Nav from "./Nav"

export default function Layout({ children }: any) {
  return (
    <div className="mx-6 lg:max-w-6xl md:max-w-2xl md:mx-auto font-openSans">
      <Nav />
      <main className="min-h-screen">{children}</main>
    </div>
  )
}
