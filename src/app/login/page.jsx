"use client";
import { authClient } from "@/lib/auth-client";
import { Check } from "@gravity-ui/icons";
import {
  Button,
  Card,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { GrGoogle } from "react-icons/gr";
import { useRouter } from "next/navigation";
import Link from "next/link"; 
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isPending && session) {
      router.push("/");
    }
  }, [session, isPending, mounted, router]);

  if (!mounted) {
    return null; 
  }

  if (isPending) {
    return <div className="text-center mt-20 font-medium text-slate-500">Checking session...</div>;
  }

  if (session) {
    return null;
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const { data, error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/",
    });

    if (error) {
      toast.error("Wrong email or password!"); 
    } else {
      toast.success("Login Successful!");
      router.push("/");
    }
    console.log({ data, error });
  };
  
  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Google sign in failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
      <Card className="border mx-auto w-full max-w-sm py-6 px-5 mt-5 shadow-lg rounded-2xl">
        <h1 className="text-center text-xl font-bold text-slate-800 mb-1">Login</h1>
        <p className="text-center text-xs text-slate-400 mb-4">Welcome back to BloodSync!</p>

        <Form className="flex w-full flex-col gap-3" onSubmit={onSubmit}>
          <Button 
            type="button"
            onClick={handleGoogleSignIn} 
            variant="flat" 
            className="w-full font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 h-9 text-sm rounded-lg transition flex items-center justify-center gap-2"
          >
            <GrGoogle className="text-base text-red-500" /> Sign In With Google
          </Button>

          {/* Brand Themed Divider */}
          <div className="flex items-center my-0.5">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Or</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Email Input */}
          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label className="text-sm font-semibold text-slate-700">Email</Label>
            <Input placeholder="john@example.com" className="max-h-9" />
            <FieldError className="text-xs" />
          </TextField>

          {/* Password Input */}
          <TextField
            isRequired
            minLength={8}
            name="password"
            type="password"
            validate={(value) => {
              if (value.length < 8) {
                return "Password must be at least 8 characters";
              }
              if (!/[A-Z]/.test(value)) {
                return "Password must contain at least one uppercase letter";
              }
              if (!/[0-9]/.test(value)) {
                return "Password must contain at least one number";
              }
              return null;
            }}
          >
            <Label className="text-sm font-semibold text-slate-700">Password</Label>
            <Input placeholder="Enter your password" className="max-h-9" />
          
            <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
              Must be 8+ chars with 1 uppercase & 1 number
            </p>
            <FieldError className="text-xs" />
          </TextField>

          {/* Buttons */}
          <div className="flex gap-2 mt-1">
            <Button 
              type="submit"
              className="text-red-600 hover:bg-[#E09200] text-white font-bold h-9 text-sm px-5 rounded-lg transition shadow-md flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              Login
            </Button>
            <Button 
              type="reset" 
              variant="flat"
              className="font-bold text-slate-600 h-9 text-sm rounded-lg"
            >
              Reset
            </Button>
          </div>

          {/* Register/Sign Up Link */}
          <div className="text-center mt-3 text-xs text-slate-500">
            Don't have an account?{" "}
            <Link href="/signup" className="text-red-600 font-bold hover:underline">
              Sign Up
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}