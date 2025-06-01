

export type IContextType = {
  user: IUser;
  isPending: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
}



export type INavLink = {
    imageUrl: string | URL;
    route: string;
    label: string;
  };
  
  
  
  export type INewPost = {
    userId: string;
    caption: string;
    file: File[];
    location?: string;
    tags?: string;
  };
  
  export type IUpdatePost = {
    postId: string;
    caption: string;
    imageId: string;
    imageUrl: URL | string;
    file: File[];
    location?: string;
    tags?: string;
  };
  
  export type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    imageUrl: string | URL;
    bio: string;
    
  };
  
  export type INewUser = {
    name: string;
    email: string;
    username: string;
    password: string;
  };

  export type IUpdateUser = {
    userId: string;
    name: string;
    bio: string;
    imageId: string;
    imageUrl: URL | string;
    file: File[];
     };