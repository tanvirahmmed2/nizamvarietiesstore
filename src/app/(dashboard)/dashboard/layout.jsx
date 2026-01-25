
import DashboardSidebar from "@/components/bar/DashboardSidebar"
import FooterTagline from "@/components/bar/FooterTagline"
import { isManager } from "@/lib/middleware"
import { redirect } from "next/navigation"

export const metadata={
  title:'Manage',
  description:'Management site'
}


const PosLayout = async({children, }) => {
  const auth= await isManager()
  if(!auth.success){
    return redirect('/login')
  }
  return (
    <div className='w-full flex flex-row items-center justify-between'>
        <DashboardSidebar/>
        <div className="w-full flex flex-col items-center justify-between min-h-screen py-4 gap-4">
          {children}
          <FooterTagline/>
        </div>
    </div>
  )
}

export default PosLayout
