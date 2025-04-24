
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations';
import { useEffect } from 'react';
import { useUserContext } from '@/context/AuthContext';

const Topbar = () => {

   const { mutate: signOut, isSuccess } = useSignOutAccount();
   const navigate = useNavigate();
   const { user } = useUserContext();

   useEffect(() => {
      if (isSuccess) navigate(0);
   },[isSuccess])

  return (
    <section className="topbar">
       <div className="flex-between py-4 px-5">
          <Link to="/" className="flex gap-3 items-center">
          <img 
          src="/assets/images/logo.svg"
           alt="logo"
           width={130}
           height={325}
            />
          </Link>

          <div className="flex gap-4">
             <Button variant="ghost" className="shad-button_ghost" onClick={() => signOut()}>
             <svg xmlns="http://www.w3.org/2000/svg" width=" 100" height="100 "  viewBox="0 0 520 520"><path fill="#141118" d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"/></svg>
             </Button>
             <Link to={`/profile/${user.id}`} className="flex-center gap-3">
               <img
                src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
                 alt="profile"
                 className='h-8 w-8 rounded-full' />
             </Link>
          </div>
       </div>

    </section>
  )
}

export default Topbar