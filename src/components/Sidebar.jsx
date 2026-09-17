 
import { IoChevronDownOutline } from "react-icons/io5";
import { useContext, useState } from 'react';
import { SidebarContext } from '../context/sidebarContext';
import { Link, useLocation } from 'react-router-dom';

const Sidebar  = () =>{
    const [openDropdown, setOpenDropdown] = useState(false);
    const { openSidebar , setOpenSidebar } = useContext(SidebarContext);

    const location = useLocation();

    const isDashboardActive = location.pathname === "/admin/dashboard";
    const isBlogActive = location.pathname.startsWith("/admin/blog");
    const isProjectActive = location.pathname.startsWith("/admin/project");

    return(
        <>
            <div className={`sidebar-main transition duration-300 transition-all bg-white ${openSidebar ? 'lg:w-[250px] w-[90%]' : 'lg:w-[85px] w-0 not-active'} fixed left-0 top-0 z-9 h-full h-screen pt-[110px]`}>
                <div className='lg:px-5 px-3'>
                    <ul>
                        <li className='lg:mb-3 mb-2 relative'>
                            <Link
                                to="/admin/dashboard"
                                className={`item relative lg:p-[12px] p-[10px] rounded-md bg-transparent text-[#431f0f] hover:text-white font-medium lg:text-[16px] text-[14px] hover:bg-[#431f0f] flex items-center gap-4 w-auto transition transition-all duration-500 ${
                                    isDashboardActive ? "active" : ""
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className='svg-icon'>
                                    <g clip-path="url(#clip0_902_1541)">
                                        <path d="M19.4608 8.69902L19.4594 8.69766L11.301 0.53957C10.9532 0.191602 10.4909 0 9.99911 0C9.50732 0 9.04497 0.191484 8.69708 0.539414L0.542902 8.69336C0.540168 8.69609 0.537433 8.69898 0.534699 8.70176C-0.179442 9.41996 -0.178192 10.5853 0.538214 11.3017C0.86548 11.6291 1.29778 11.8188 1.75997 11.8386C1.77872 11.8405 1.79767 11.8414 1.81673 11.8414H2.14189V17.8453C2.14189 19.0334 3.10853 20 4.29689 20H7.48868C7.8122 20 8.07462 19.7377 8.07462 19.4141V14.707C8.07462 14.1649 8.51564 13.7239 9.05779 13.7239H10.9404C11.4826 13.7239 11.9235 14.1649 11.9235 14.707V19.4141C11.9235 19.7377 12.1858 20 12.5095 20H15.7013C16.8897 20 17.8563 19.0334 17.8563 17.8453V11.8414H18.1578C18.6495 11.8414 19.1118 11.6499 19.4599 11.302C20.177 10.5844 20.1773 9.41711 19.4608 8.69902Z" fill="#431f0f"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_902_1541">
                                            <rect width="20" height="20" fill="white"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                                {
                                    openSidebar &&
                                    <span>Dashboard</span>
                                }
                            </Link>
                        </li>
                        <li className='lg:mb-3 mb-2 relative'>
                            <Link
                                to="/admin/blogs"
                                className={`item relative lg:p-[12px] p-[10px] rounded-md bg-transparent text-[#431f0f] hover:text-white font-medium lg:text-[16px] text-[14px] hover:bg-[#431f0f] flex items-center gap-4 w-auto transition transition-all duration-500 ${
                                    isBlogActive ? "active" : ""
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className='svg-icon'>
                                    <g clip-path="url(#clip0_907_1081)">
                                    <path d="M10.2168 9.63406C11.5404 9.63406 12.6864 9.15934 13.6229 8.22274C14.5593 7.28634 15.034 6.14056 15.034 4.8169C15.034 3.49362 14.5593 2.34773 13.6227 1.41097C12.6861 0.474686 11.5402 0 10.2168 0C8.89314 0 7.74732 0.474686 6.81092 1.41113C5.87452 2.34757 5.39964 3.4935 5.39964 4.8169C5.39964 6.14056 5.87448 7.28649 6.81108 8.22294C7.74768 9.15922 8.89361 9.63406 10.2168 9.63406ZM18.6456 15.379C18.6186 14.9893 18.564 14.5641 18.4835 14.1153C18.4024 13.663 18.2979 13.2354 18.1727 12.8446C18.0435 12.4407 17.8677 12.0419 17.6504 11.6596C17.4249 11.2629 17.16 10.9175 16.8628 10.6332C16.5519 10.3358 16.1714 10.0967 15.7313 9.92227C15.2928 9.74883 14.8068 9.66094 14.2869 9.66094C14.0828 9.66094 13.8853 9.74469 13.504 9.99297C13.233 10.1695 12.9611 10.3447 12.6884 10.5187C12.4264 10.6857 12.0715 10.8421 11.6331 10.9837C11.2054 11.1221 10.7712 11.1923 10.3425 11.1923C9.91396 11.1923 9.47982 11.1221 9.05165 10.9837C8.61377 10.8422 8.25885 10.6859 7.99713 10.5189C7.69361 10.325 7.41901 10.148 7.1808 9.99277C6.79995 9.74453 6.60233 9.66074 6.39819 9.66074C5.87815 9.66074 5.39233 9.74879 4.95394 9.92246C4.51417 10.0966 4.13347 10.3357 3.82234 10.6334C3.52527 10.9178 3.26023 11.263 3.035 11.6596C2.81789 12.0419 2.64211 12.4406 2.5127 12.8448C2.3877 13.2356 2.28321 13.663 2.20203 14.1153C2.1216 14.5635 2.067 14.9888 2.03996 15.3794C2.01307 15.7725 1.99975 16.1664 2 16.5604C2 17.6045 2.33188 18.4496 2.98633 19.0729C3.63269 19.688 4.48792 20.0001 5.52796 20.0001H15.1581C16.1981 20.0001 17.053 19.6882 17.6996 19.073C18.3542 18.4501 18.686 17.6048 18.686 16.5603C18.6859 16.1573 18.6723 15.7598 18.6456 15.379Z" fill="#431f0f"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_907_1081">
                                    <rect width="20" height="20" fill="white"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                                 {
                                    openSidebar &&
                                    <span>Blogs</span>
                                } 
                            </Link> 
                        </li> 
                        
                        <li className='lg:mb-3 mb-2 relative'>
                            <Link
                                to={'/admin/projects'}
                                className={`item relative lg:p-[12px] p-[10px] rounded-md bg-transparent text-[#431f0f] hover:text-white font-medium lg:text-[16px] text-[14px] hover:bg-[#431f0f] flex items-center gap-4 w-auto transition transition-all duration-500 ${
                                    isProjectActive ? "active" : ""
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className='svg-icon'>
                                    <g clip-path="url(#clip0_907_1081)">
                                    <path d="M10.2168 9.63406C11.5404 9.63406 12.6864 9.15934 13.6229 8.22274C14.5593 7.28634 15.034 6.14056 15.034 4.8169C15.034 3.49362 14.5593 2.34773 13.6227 1.41097C12.6861 0.474686 11.5402 0 10.2168 0C8.89314 0 7.74732 0.474686 6.81092 1.41113C5.87452 2.34757 5.39964 3.4935 5.39964 4.8169C5.39964 6.14056 5.87448 7.28649 6.81108 8.22294C7.74768 9.15922 8.89361 9.63406 10.2168 9.63406ZM18.6456 15.379C18.6186 14.9893 18.564 14.5641 18.4835 14.1153C18.4024 13.663 18.2979 13.2354 18.1727 12.8446C18.0435 12.4407 17.8677 12.0419 17.6504 11.6596C17.4249 11.2629 17.16 10.9175 16.8628 10.6332C16.5519 10.3358 16.1714 10.0967 15.7313 9.92227C15.2928 9.74883 14.8068 9.66094 14.2869 9.66094C14.0828 9.66094 13.8853 9.74469 13.504 9.99297C13.233 10.1695 12.9611 10.3447 12.6884 10.5187C12.4264 10.6857 12.0715 10.8421 11.6331 10.9837C11.2054 11.1221 10.7712 11.1923 10.3425 11.1923C9.91396 11.1923 9.47982 11.1221 9.05165 10.9837C8.61377 10.8422 8.25885 10.6859 7.99713 10.5189C7.69361 10.325 7.41901 10.148 7.1808 9.99277C6.79995 9.74453 6.60233 9.66074 6.39819 9.66074C5.87815 9.66074 5.39233 9.74879 4.95394 9.92246C4.51417 10.0966 4.13347 10.3357 3.82234 10.6334C3.52527 10.9178 3.26023 11.263 3.035 11.6596C2.81789 12.0419 2.64211 12.4406 2.5127 12.8448C2.3877 13.2356 2.28321 13.663 2.20203 14.1153C2.1216 14.5635 2.067 14.9888 2.03996 15.3794C2.01307 15.7725 1.99975 16.1664 2 16.5604C2 17.6045 2.33188 18.4496 2.98633 19.0729C3.63269 19.688 4.48792 20.0001 5.52796 20.0001H15.1581C16.1981 20.0001 17.053 19.6882 17.6996 19.073C18.3542 18.4501 18.686 17.6048 18.686 16.5603C18.6859 16.1573 18.6723 15.7598 18.6456 15.379Z" fill="#431f0f"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_907_1081">
                                    <rect width="20" height="20" fill="white"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                                 {
                                    openSidebar &&
                                    <span>Projects</span>
                                } 
                            </Link> 
                        </li>   
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Sidebar