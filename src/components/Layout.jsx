import { useContext } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"
import { SidebarContext } from "../context/sidebarContext"



const Layout = ({ children })=>{

    const {openSidebar, setOpenSidebar} = useContext(SidebarContext);

    return( 
        <>
            <Header/>
            <div className={`page-container ${openSidebar ? 'lg:pl-[250px]' : 'lg:pl-[85px]'} `}>
                <Sidebar/>
                <div className="main-content-box  p-[25px] pt-[120px]"> 
                    {children} 
                </div>
            </div>
        </>
    )
}

export default Layout