
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SigninValidation} from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import {  useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';



const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext(); 
  
  
  const { mutateAsync: signInAccount } = useSignInAccount();



  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
      defaultValues: {
      
      email:'',
      password:'',

    },
  });

 // Handler
 const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
  
   
  const session = await signInAccount(user);
  console.log("Session Data:", session); // Burada session çıktısını kontrol et
  
  if (!session) {
    return toast({ title: "Sign in failed. Please try again." });
  }
  

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();

      navigate("/");
    } else {
      return toast({ title: "Login failed. Please try again.", });
      
    }
  
  
};


  
  return (

   
    
      <Form {...form}>
      
       <div className="absolute top-0 left-0 justify-start">
      <DotLottieReact
              src="https://lottie.host/26e7598c-4f55-405a-b45a-958db364b232/dtCOZU8j67.lottie"
              loop
              autoplay
              style={{
                width: '600px',  // Animasyonun genişliğini artırmak için
                height: '300px', // Animasyonun yüksekliğini artırmak için
              }}
              
              //className="absolute top-0 left-0 flex-col"
          />
      </div> 

      
      
      
      
      
      
      <div className="sm:w-420 flex-center flex-col" >
       

        <img src= "/assets/images/logo.svg"  />
        
       
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Log in to your account</h2>
        <p className="text-dark-3 small-medium md:base-regular mt-2"> Welcome back to GlowSphere! Please enter your details</p>



      
        <form onSubmit={form.handleSubmit(handleSignin)} className="flex flex-col gap-5 w-full mt-4">
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email"className="shad-input" {...field} />
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
                
                <FormMessage /> {/* Hata mesajını göster */}
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
              {isUserLoading ? (
                <div className="flex-center gap-2">
                   <Loader/>Loading...
                </div>
              ) : "Sign in"}

          </Button>

          <p className="text-small-regular text-dark-2 text-center mt-2">
            Don't have an account?
            <Link to="/sign-up" className="text-green-1 text-small-semibold ml-1"> Sign up</Link>
          </p>
        </form>

        </div>
      </Form>
    
  );
};

export default SigninForm;
