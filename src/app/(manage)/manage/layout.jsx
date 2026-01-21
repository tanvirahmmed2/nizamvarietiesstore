
import ManageNavbar from "@/components/bar/ManageNavbar"
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
    <div className='w-full flex flex-col'>
        <ManageNavbar/>
        <div className=" flex flex-row w-full mt-14 justify-between">
            {children}
        </div>
    </div>
  )
}

export default PosLayout
