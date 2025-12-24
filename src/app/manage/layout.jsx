import ManageNavbar from "@/components/ui/ManageNavbar"
import ManageSidebar from "@/components/ui/ManageSidebar"


const PosLayout = ({children, }) => {
  return (
    <div className='w-full flex flex-col'>
        <ManageNavbar/>
        <div className=" flex flex-row w-full  justify-between">
            <ManageSidebar/>
            {children}
        </div>
    </div>
  )
}

export default PosLayout
