
import DashboardSidebar from "@/components/bar/DashboardSidebar"
import FooterTagline from "@/components/bar/FooterTagline"

export const metadata = {
  title: 'Manage',
  description: 'Management site'
}


const PosLayout = async ({ children, }) => {
  
  return (
    <div className="w-full pl-16 flex flex-col items-center justify-between min-h-screen py-4 gap-4 relative">
      <DashboardSidebar />
      {children}
      <FooterTagline />
    </div>
  )
}

export default PosLayout
