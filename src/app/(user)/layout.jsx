import Navbar from "@/components/bar/Navbar"
import Footer from "@/components/bar/Footer"
import BottomBar from "@/components/bar/BottomBar"

export const metadata = {
  title: 'My Account | Nizam Store',
  description: 'Manage user profile, view order history, and update settings.'
}

export default function UserLayout({ children }) {
  return (
    <div className="w-full min-h-screen relative flex flex-col bg-slate-50">
      <Navbar />
      <div className="w-full mt-14 flex-1">{children}</div>
      <Footer />
      <BottomBar />
    </div>
  )
}
