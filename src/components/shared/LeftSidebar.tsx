
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations';
import { useEffect } from 'react';
import { useUserContext } from '@/context/AuthContext';
import { sidebarLinks } from '@/constants';
import { INavLink } from '@/types';
import { account } from '@/lib/appwrite/config';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const LeftSidebar = () => {
  const  { pathname } = useLocation();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();

  //  const handleLogout = async () => {
  //   try {
  //     await account.deleteSession("current");
  //     navigate("/login");
  //   } catch (error) {
  //     console.error("Çıkış hatası:", error);
  //   }
  // };

  useEffect(() => {
     if (isSuccess) window.location.href = '/sign-in';
  },[isSuccess])

  return (
    <nav className="leftsidebar">
        <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
         
         <div 
               className="fixed z-50"
               style={{
                 top: '62px',
                 left: '110px',
                 height: '85px',
                       
               }}
             >
               <DotLottieReact
               src="https://lottie.host/ad4a5500-7271-467a-a261-69b1900f4377/zwqIzu1dke.lottie"
               loop
               autoplay
               
             />
             </div> 
             <img 
          src="/assets/images/logo.svg"
           alt="logo"
           width={170}
           height={36}
            />
          </Link>

          <Link to={`/profile/${user.id}`}
          className="flex gap-3 items-center">
            <img src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
             alt="profile"
            className="h-14 w-14 rounded-full"/>
            <div className="flex flex-col">
               <p className="body-bold">
                {user.name}
               </p>
               <p className="small-regular text-dark-4">
                @{user.username}
               </p>
            </div>
          </Link>

          <ul className="flex flex-col gap-6">
              {sidebarLinks.map((link: INavLink )=> {
                const isActive = pathname === link.route;
                return(
                  <li key={link.label} className={`leftsidebar-link group ${
                    isActive && 'bg-vg-4'
                  }`}>
                    <NavLink 
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                  >
                    <img 
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && 'invert-white'}`}
                       />
                      {link.label}
                  </NavLink>
                  </li>
                )
              })}
          </ul>
        </div>

        <Button 
        variant="ghost" 
        className="shad-button_ghost" 
        onClick={() => signOut()}>
             <svg xmlns="http://www.w3.org/2000/svg" width=" 100" height="100 "  viewBox="0 0 520 520"><path fill="#141118" d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"/></svg>
        <p className="small-medium lg:base-medium"> Logout </p>
        </Button>
    </nav>
  )
}

export default LeftSidebar