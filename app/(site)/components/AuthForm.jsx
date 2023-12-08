'use client'

import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState('LOGIN');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/users');
    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    setVariant(variant === 'LOGIN' ? 'REGISTER' : 'LOGIN');
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const onSubmit = (data) => {
    setIsLoading(true);

    if (variant === 'REGISTER') {
      axios.post('/api/register', data)
      .then(() => signIn('credentials', data))
      .catch(() => toast.error('Something went wrong!'))
      .finally(() => setIsLoading(false))
    }

    if (variant === 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false
      })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials');
        }

        if (callback?.ok && !callback?.error) {
          toast.success('Logged in!');
          router.push('/users');
        }
      })
      .finally(() => setIsLoading(false));
    }
  }

  const socialAction = (action) => {
    setIsLoading(true);

    signIn(action, { redirect: false })
    .then((callback) => {
      if (callback?.error) {
        toast.error('Invalid credentials');
      }

      if (callback?.ok && !callback?.error) {
        toast.success('Logged in!');
      }
    })
    .finally(() => setIsLoading(false));
  }

  if (isLoading) {
    return (
      <div className="
        fixed
        inset-0
        bg-slate-800
        bg-opacity-75
        flex
        justify-center
        items-center
        h-screen
      ">
        <ClipLoader loading={isLoading} size={50} />
      </div>
    );
  }

  return (
    <div
      className="
        mt-8
        sm:mx-auto
        sm:w-full
        sm:max-w-md
      "
    >
      <div
        className="
          bg-white
          px-4
          py-8
          shadow
          sm:rounded-lg
          sm:px-10
        "
      >
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          {variant === 'REGISTER' && (
            <Input 
              id="name" 
              label="Name" 
              register={register} 
              validation={ { required: "Name is required"} }
              errors={errors}
              disabled={isLoading}
            />
          )}
            <Input 
              id="email" 
              label="Email address" 
              type="email"
              register={register}
              validation={ { required: "Email is required"} } 
              errors={errors}
              disabled={isLoading}
            />
            <Input 
              id="password" 
              label="Password" 
              type="password"
              register={register}
              validation={ { required: "Password is required"} }
              errors={errors}
              disabled={isLoading}
            />
            <div>
              <Button
                disabled={isLoading}
                fullWidth
                type="submit"
              >
                {variant === 'LOGIN' ? 'Sign In' : 'Register'}
              </Button>
            </div>
        </form>

        <div className="mt-6">
            <div className="relative">
              <div 
                className="
                  absolute
                  inset-0
                  flex
                  items-center
                "
              >
                <div 
                  className="
                  w-full border-t
                border-gray-300" 
                />
              </div>
              <div className="
                relative 
                flex 
                justify-center 
                text-sm
              "
              >
                <span className="
                bg-white 
                  px-2 
                text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <AuthSocialButton 
                icon={BsGithub}
                onClick={() => socialAction('github')}
              />
              <AuthSocialButton 
                icon={BsGoogle}
                onClick={() => socialAction('google')}
              />
            </div>
        </div>

        <div className="
          flex
          gap-2
          justify-center
          text-sm
          mt-6
          px-2
          text-gray-500
        ">
          <div>
            {variant === 'LOGIN' ? 'New to MembersOnly?' : 'Already have an account?'}
          </div>
          <div
            onClick={toggleVariant}
            className="underline cursor-pointer"
          >
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
