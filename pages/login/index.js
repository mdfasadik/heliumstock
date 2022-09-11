import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import auth from "../../services/authService";
import Loading from "../../components/loading";

const schema = Joi.object({
  email: Joi.string().min(5).max(255).required().label("Email"),
  password: Joi.string().min(4).max(255).required().label("Password"),
});

export default function Login() {
  const [isLoading, steLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const router = useRouter();
  useEffect(() => {
    const user = auth.getCurrentUser();
    if (user) router.replace("/");
  }, []);
  const { register, handleSubmit } = useForm({
    resolver: joiResolver(schema),
  });

  const onSubmit = async (data) => {
    steLoading(true);
    const response = await auth.login(data);
    if (response.message) {
      setLoginError(response.message);
      steLoading(false);
      return;
    }

    const token = response.data;
    auth.setAuthToken(token);
    steLoading(false);
    router.reload();
  };
  return (
    <>
      {isLoading && <Loading />}
      <div className='min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full bg-white p-6 rounded-lg shadow-sm space-y-8'>
          <div>
            <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
              Sign in to your account
            </h2>
          </div>
          <form
            className='mt-8 space-y-6'
            action='#'
            method='POST'
            onSubmit={handleSubmit(onSubmit)}>
            <div className='rounded-md shadow-sm -space-y-px flex flex-col gap-3'>
              <div className='flex flex-col gap-3'>
                <label htmlFor='email-address' className='font-semibold'>
                  Email address
                </label>
                <input
                  {...register("email")}
                  id='email-address'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  className='appearance-none relative block w-full px-3 py-2 border  border-gray-400  text-gray-900 rounded-lg focus:outline-4 focus:ring-secondary focus:border-secring-secondary focus:z-10 sm:text-sm'
                />
              </div>
              <div className='flex flex-col gap-3'>
                <label htmlFor='password' className='font-semibold'>
                  Password
                </label>
                <input
                  {...register("password")}
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  required
                  className='appearance-none relative block w-full px-3 py-2 border  border-gray-400  text-gray-900 rounded-lg focus:outline-4 focus:ring-secondary focus:border-secring-secondary focus:z-10 sm:text-sm'
                />
              </div>
            </div>
            {loginError && (
              <div className='w-full py-2 px-4 bg-red-100 text-center font-semibold border border-red-600 text-red-600 rounded-lg'>
                {loginError}
              </div>
            )}
            <div>
              <button
                type='submit'
                className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
