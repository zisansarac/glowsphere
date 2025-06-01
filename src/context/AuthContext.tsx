import { getCurrentUser } from '@/lib/appwrite/api';
import { account } from '@/lib/appwrite/config';
import { IUser } from '@/types';
import { createContext, useContext, useEffect, useState } from 'react';
//import { useNavigate } from 'react-router-dom';


export const INITIAL_USER = {
  id: '',
  name: '',
  username: '',
  email: '',
  imageUrl: '',
  bio: ''
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isPending: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

type IContextType = {
  user: IUser;
  isPending: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({children}: { children: React.ReactNode}) {
 // const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isPending, setIsPending] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const checkAuthUser = async () => {
  try {
    // Önce session var mı kontrol et
    const sessions = await account.listSessions();
    if (!sessions.sessions.length) {
      setIsAuthenticated(false);
      return false;
    }

    const currentAccount = await getCurrentUser();
    if (currentAccount) {
      setUser({
        id: currentAccount.$id,
        name: currentAccount.name,
        username: currentAccount.username,
        email: currentAccount.email,
        imageUrl: currentAccount.imageUrl,
        bio: currentAccount.bio,
      });
      setIsAuthenticated(true);
      return true;
    }
    return false;
  } catch (error) {
    console.log("Auth kontrol hatası:", error);
    setIsAuthenticated(false);
    return false;
  }
};

useEffect(() => {
  const initAuth = async () => {
    setIsPending(true);
    try {
      const isLoggedIn = await checkAuthUser();
      if (!isLoggedIn) {

        setIsAuthenticated(false);
        setUser(INITIAL_USER);
      } }
       catch (error) {
    console.log("Init auth hatası:", error);
    setIsAuthenticated(false);
  } finally {
    setIsPending(false);
  }
  };

  // DOM yüklendikten sonra çalıştır
  if (typeof window !== "undefined") {
    initAuth();
  }
}, []);



  const value = {
    user,
    setUser,
    isPending,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);