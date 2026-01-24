
import DashboardSidebar from "@/components/bar/DashboardSidebar"
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
        {children}
    </div>
  )
}

export default PosLayout
