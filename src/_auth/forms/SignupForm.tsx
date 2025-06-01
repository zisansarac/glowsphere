
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
import { SignupValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";



const SignupForm = () => {

  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isPending: isUserLoading } = useUserContext(); 
  
  

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name:'',
      username:'',
      email:'',
      password:'',

    },
  });

  
  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigningInUser } = useSignInAccount();


   // Handler
   const handleSignup = async (values: z.infer<typeof SignupValidation>) => {
    try {
      const newUser = await createUserAccount(values);

      if (!newUser) {
        return toast({ title: "Sign up failed. Please try again."});
        
        
      }

      const session = await signInAccount({
        email: values.email,
        password: values.password,
      });

      if (!session) {
        return toast({ title: "Sign in failed. Please try again."});
        
        //navigate("/sign-in");
        
       
      }
        

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();

        navigate("/");
      } else {
        return toast({ title: "Sign up failed. Please try again."});
        
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    
      <Form {...form}>
      <div className="sm:w-420 flex-center flex-col" >
        <img src= "/assets/images/logo.svg"  />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
        <p className="text-dark-3 small-medium md:base-regular mt-2">To use GlowSphere, please enter your account details</p>


      
        <form onSubmit={form.handleSubmit(handleSignup)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text"className="shad-input" {...field} />
                </FormControl>
                
                <FormMessage>{form.formState.errors.username?.message}</FormMessage> {/* Hata mesajını göster */}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text"className="shad-input" {...field} />
                </FormControl>
                
                <FormMessage>{form.formState.errors.username?.message}</FormMessage> {/* Hata mesajını göster */}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email"className="shad-input" {...field} />
                </FormControl>
                
                <FormMessage>{form.formState.errors.username?.message}</FormMessage> {/* Hata mesajını göster */}
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
                
                <FormMessage>{form.formState.errors.username?.message}</FormMessage> {/* Hata mesajını göster */}
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
              {isCreatingAccount || isSigningInUser || isUserLoading ? (
                <div className="flex-center gap-2">
                   <Loader/>Loading...
                </div> 
              ) : ("Sign up")}

          </Button>

          <p className="text-small-regular text-dark-2 text-center mt-2">
            Already have an account? 
            <Link to="/sign-in" className="text-green-1 text-small-semibold ml-1"> Login</Link>
          </p>
        </form>

        </div>
      </Form>
    
  );
};

export default SignupForm;
