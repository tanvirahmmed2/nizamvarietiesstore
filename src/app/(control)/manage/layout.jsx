import ManageNavbar from "@/components/ui/ManageNavbar"
import ManageSidebar from "@/components/ui/ManageSidebar"
import { isManager } from "@/lib/middleware"
import { redirect } from "next/navigation"

export const metadata={
  title:'Manage | Restaurant',
  description:'Management site'
}


const PosLayout = async({children, }) => {
  const auth= await isManager()
  if(!auth.success){
    return redirect('/login')
  }
  return (
    <div className='w-full flex flex-col'>
        <ManageNavbar/>
        <div className=" flex flex-row w-full justify-between">
            <ManageSidebar/>
            {children}
        </div>
    </div>
  )
}

export default PosLayout
