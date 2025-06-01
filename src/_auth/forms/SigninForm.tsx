
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Link, useNavigate } from "react-router-dom";
// import { useToast } from "@/hooks/use-toast"

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { SigninValidation} from "@/lib/validation";
// import Loader from "@/components/shared/Loader";
// import {  useSignInAccount } from "@/lib/react-query/queriesAndMutations";
// import { useUserContext } from "@/context/AuthContext";
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';


// const SigninForm = () => {
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const { checkAuthUser, isPending: isUserLoading } = useUserContext(); 
  
   
//   const { mutateAsync: signInAccount, isPending } = useSignInAccount();

//   // 1. Define your form.
//   const form = useForm<z.infer<typeof SigninValidation>>({
//     resolver: zodResolver(SigninValidation),
//       defaultValues: {     
//       email:'',
//       password:'',
//     },
//   });


//   const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
//   try {
//     const session = await signInAccount(user);
//     console.log("Session Data:", session);

//     if (!session) {
//       toast({ title: "Sign in failed. Please try again." });
//       return;
//     }

//     // Bekleme ekleyelim
//     setTimeout(async () => {
//       const isLoggedIn = await checkAuthUser();
//       console.log({ isLoggedIn });

//       if (isLoggedIn) {
//         form.reset();
//         navigate("/");
//       } else {
//         toast({ title: "Login failed.. Please try again." });
//       }
//     }, 200); // 200ms yeterli olur genelde

//   } catch (error) {
//     console.error("Giriş sırasında hata:", error);
//     toast({
//       title: "Login failed",
//       description: "An unexpected error occurred. Please try again."
//     });
//   }
// };



// return (
   
//       <Form {...form}>
      
//        <div className="absolute top-0 left-0 justify-start">
//       <DotLottieReact
//               src="https://lottie.host/26e7598c-4f55-405a-b45a-958db364b232/dtCOZU8j67.lottie"
//               loop
//               autoplay
//               style={{
//                 width: '600px',  // Animasyonun genişliğini artırmak için
//                 height: '300px', // Animasyonun yüksekliğini artırmak için
//               }}
              
//               //className="absolute top-0 left-0 flex-col"
//           />
//       </div> 
      
//       <div className="sm:w-420 flex-center flex-col" >
       
//         <img src= "/assets/images/logo.svg"  />
               
//         <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Log in to your account</h2>
//         <p className="text-dark-3 small-medium md:base-regular mt-2"> Welcome back to GlowSphere! Please enter your details</p>
      
//         <form onSubmit={form.handleSubmit(handleSignin)} className="flex flex-col gap-5 w-full mt-4">
          
//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Email</FormLabel>
//                 <FormControl>
//                   <Input type="email"className="shad-input" {...field} />
//                 </FormControl>
//                 <FormMessage />
//                  </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="password"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Password</FormLabel>
//                 <FormControl>
//                   <Input type="password" className="shad-input" {...field} />
//                 </FormControl>
                
//                 <FormMessage /> {/* Hata mesajını göster */}
//               </FormItem>
//             )}
//           />
//           <Button type="submit" className="shad-button_primary">
//               {isUserLoading ? (
//                 <div className="flex-center gap-2">
//                    <Loader/>Loading...
//                 </div>
//               ) : ( "Sign in" )}

//           </Button>

//           <p className="text-small-regular text-dark-2 text-center mt-2">
//             Don't have an account?
//             <Link to="/sign-up" className="text-green-1 text-small-semibold ml-1"> Sign up</Link>
//           </p>
//         </form>

//         </div>
//       </Form>
    
//   );
// };

// export default SigninForm;




import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SigninValidation } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
//import { account } from "@/lib/appwrite/config";
//import { Models } from "appwrite";
import Loader from "@/components/shared/Loader";
import { useState } from "react";
import { signInAccount } from "@/lib/appwrite/api";
import { useUserContext } from "@/context/AuthContext";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  const { checkAuthUser } = useUserContext();

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignin = async (values: z.infer<typeof SigninValidation>) => {
  try {
    setIsPending(true);

    // 1. Önce giriş yap
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      toast({ title: "Giriş başarısız. Lütfen tekrar deneyin." });
      return;
    }

    // 2. Session oluştuktan sonra kısa bir bekleme ekle
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 3. Şimdi kullanıcı bilgilerini çek
    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      navigate("/");
    } else {
      toast({ title: "Giriş başarısız. Lütfen tekrar deneyin." });
    }
  } catch (error) {
    console.log("Login error:", error);
    toast({ 
      title: "Giriş sırasında bir hata oluştu.",
      description: "Lütfen bilgilerinizi kontrol edip tekrar deneyin."
    });
  } finally {
    setIsPending(false);
  }
};

 return (
    <>
      <div 
      className="fixed z-50"
      style={{
        top: '100px',
        left: '50px',
        height: '160px',
              
      }}
    >
      <DotLottieReact
      src="https://lottie.host/ad4a5500-7271-467a-a261-69b1900f4377/zwqIzu1dke.lottie"
      loop
      autoplay
      
    />
    </div>

      {/* Mevcut Form */}
      <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
          <img src="/assets/images/logo.svg" alt="Logo" />
          
          
          <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Log in to your account</h2>
          <p className="text-dark-3 small-medium md:base-regular mt-2">
            Welcome back to GlowSphere! Please enter your details
          </p>

          <form
            onSubmit={form.handleSubmit(handleSignin)}
            className="flex flex-col gap-5 w-full mt-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="shad-button_primary">
              {isPending ? (
                <div className="flex-center gap-2">
                  <Loader /> Loading...
                </div>
              ) : (
                "Sign in"
              )}
            </Button>

            <p className="text-small-regular text-dark-2 text-center mt-2">
              Don't have an account?
              <Link
                to="/sign-up"
                className="text-green-1 text-small-semibold ml-1"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </Form>
    </>
  );
};

export default SigninForm;
