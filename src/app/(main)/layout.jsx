import Footer from "@/components/bar/Footer"
import Navbar from "@/components/bar/Navbar"


export const metadata = {
  title: 'Home',
  description: 'Home page'
}

const MainLayout = ({ children }) => {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <div className="w-full mb-14 sm:mt-14 sm:mb-0 min-h-screen flex items-center justify-center">{children}</div>

    </div>
  )
}

export default MainLayout
