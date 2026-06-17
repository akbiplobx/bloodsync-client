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
  Select,
  ListBox,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import Link from "next/link"; 
import { useState, useEffect } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [passwordValue, setPasswordValue] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; 
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const image = formData.get("image") || ""; 
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const role = formData.get("role"); // Role ডাটা সংগ্রহ করা হলো

    if (password !== confirmPassword) {
      return;
    }

    // authClient-এ role সহ ডাটা পাঠানো হচ্ছে
    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
      image,
      role, 
    });

    console.log({ data, error });

    if (!error) {
      router.push('/');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/", 
      });
    } catch (error) {
      console.error("Google login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border mx-auto w-full max-w-sm py-6 px-5 mt-5 shadow-lg rounded-2xl bg-white dark:bg-slate-900">
      <h1 className="text-center text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Sign Up</h1>

      <Form className="flex w-full flex-col gap-3" onSubmit={onSubmit}>
        
        {/* Name Input */}
        <TextField isRequired name="name" type="text">
          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Name</Label>
          <Input placeholder="Enter your name" className="max-h-9" />
          <FieldError className="text-xs" />
        </TextField>

        {/* Image URL Input */}
        <TextField name="image" type="text">
          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Image URL (Optional)</Label>
          <Input placeholder="Image URL (Optional)" className="max-h-9" />
          <FieldError className="text-xs" />
        </TextField>

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
          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</Label>
          <Input placeholder="john@example.com" className="max-h-9" />
          <FieldError className="text-xs" />
        </TextField>

        {/* Password Input */}
        <TextField
          isRequired
          minLength={8}
          name="password"
          type="password"
          onChange={(value) => setPasswordValue(value)} 
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
          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</Label>
          <Input placeholder="Enter your password" className="max-h-9" />
          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">
            Must be 8+ chars with 1 uppercase & 1 number
          </p>
          <FieldError className="text-xs" />
        </TextField>

        {/* Confirm Password Input */}
        <TextField
          isRequired
          name="confirmPassword"
          type="password"
          validate={(value) => {
            if (value !== passwordValue) {
              return "Passwords do not match!"; 
            }
            return null;
          }}
        >
          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm Password</Label>
          <Input placeholder="Retype your password" className="max-h-9" />
          <FieldError className="text-xs" />
        </TextField>

        {/* Role Base Select Field */}
        <Select isRequired name="role" placeholder="Select one">
          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Signup As</Label>
          <Select.Trigger className="h-9 border rounded-lg bg-transparent text-sm">
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item id="donor" textValue="donor" className="text-sm">
                Donor
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="recipient" textValue="recipient" className="text-sm">
                Recipient
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>

        {/* Form Submit & Reset Buttons */}
        <div className="flex gap-2 mt-2">
          <Button 
            type="submit"
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-9 text-sm px-4 rounded-lg transition shadow-md flex items-center gap-1"
          >
            <Check className="w-4 h-4" />
            Submit
          </Button>
          <Button 
            type="reset" 
            variant="flat"
            className="font-bold text-slate-600 dark:text-slate-400 h-9 text-sm rounded-lg"
            onClick={() => setPasswordValue("")} 
          >
            Reset
          </Button>
        </div>

        {/* OR Divider */}
        <div className="flex items-center my-0.5">
          <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
          <span className="px-2 text-slate-400 text-xs font-medium">OR</span>
          <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        {/* Google Login Button */}
        <Button
          type="button"
          variant="bordered"
          isLoading={isLoading}
          onClick={handleGoogleLogin}
          className="w-full font-bold h-9 text-sm border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300"
        >
          {!isLoading && (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.357 2.72 1.5 6.662l3.766 3.103Z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.275c0-.818-.073-1.609-.21-2.373H12v4.491h6.445c-.277 1.473-1.11 2.718-2.36 3.555l3.664 2.845C21.89 18.745 23.49 15.79 23.49 12.275Z"
              />
              <path
                fill="#FBBC05"
                d="M5.266 14.235 1.5 17.338A11.934 11.934 0 0 0 12 24c3.055 0 5.782-1.145 7.91-3L16.245 18.15c-1.2.8-2.727 1.273-4.245 1.273-3.41 0-6.282-2.3-7.314-5.41l3.58-2.778Z"
              />
              <path
                fill="#34A853"
                d="M12 19.423c-1.518 0-3.045-.473-4.245-1.273L4.09 21A11.934 11.934 0 0 0 12 24c3.055 0 5.782-1.145 7.91-3l-3.664-2.845A7.01 7.01 0 0 1 12 19.423Z"
              />
            </svg>
          )}
          Sign up with Google
        </Button>

        {/* Login Link */}
        <div className="text-center mt-2 text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-rose-600 font-bold hover:underline">
            Login
          </Link>
        </div>

      </Form>
    </Card>
  );
}