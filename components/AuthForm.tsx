"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.actions";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (type: FormType) => {
    return z.object({
        name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3),
      });
};

interface FormValues {
  email: string;
  password: string;
  name?: string;
}

interface AuthFormProps {
  type: FormType;
}

const AuthForm = ({ type }: AuthFormProps) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(`${type.toUpperCase()} values:`, values); // Debug log
      if (type === "sign-up") {
        const { name, email, password } = values;
          const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });
         if (!result.success) {
          toast.error(result.message);
          return;
        }
        toast.success("Account created successfully. Please sign in.");
        form.reset();
        router.push("/sign-in");
      } else {
        const{email , password} = values;
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        });
        toast.success("Signed in successfully.");
        form.reset();
        router.push("/");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      console.error("Authentication error:", error); // Debug log
      toast.error(message);
      form.setError("root", { message });
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border max-w-[600px] lg:min-w-[566px] mx-auto">
      <Toaster position="top-right" richColors />
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="MockMate logo" height={32} width={38} />
          <h2 className="text-primary-100">MockMate</h2>
        </div>

        <h3>Practice job interviews with AI</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {form.formState.errors.root && (
              <p className="text-red-500 text-center">{form.formState.errors.root.message}</p>
            )}

            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <Button
              className="btn w-full"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Loading..."
                : isSignIn
                ? "Sign In"
                : "Create an Account"}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1 hover:underline"
          >
            {!isSignIn ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;