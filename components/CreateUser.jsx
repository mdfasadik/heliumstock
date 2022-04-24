import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { toast } from "react-toastify";

import http from "../services/httpService";

const schema = Joi.object({
  username: Joi.string().min(3).max(50).required().label("Username"),
  email: Joi.string().min(5).max(255).required().label("Email"),
  password: Joi.string().min(4).max(255).required().label("Password"),
  role: Joi.string().min(3).max(50).required().label("Role"),
});

export default function CreateUser({ api, token }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
  });
  const [loginError, setLoginError] = useState("");
  const router = useRouter();

  const onSubmit = async (data) => {
    const response = await http.post(api + "/users/", data, {
      "x-auth-token": token,
    });
    if (response.data) {
      toast.success(response.message);
      setTimeout(() => {
        router.reload();
      }, 1000);
    } else {
      setLoginError(response.message);
      toast.error(response.message);
    }
    console.log(data);
  };

  return (
    <div className='w-full'>
      <h1 className='text-lg font-medium mb-8'>Create User</h1>

      <form className='p-4' onSubmit={handleSubmit(onSubmit)}>
        <div className='rounded-md shadow-sm -space-y-px flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='username' className='text-lg font-medium'>
              Username
            </label>
            <input
              {...register("username")}
              id='username'
              type='text'
              required
              className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
              placeholder='Username'
            />
            {errors.username && (
              <div className='w-full py-2 px-4 bg-red-100 text-center font-semibold border border-red-600 text-red-600 rounded-lg'>
                {errors.username.message}
              </div>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='email-address' className='text-lg font-medium'>
              Email address
            </label>
            <input
              {...register("email")}
              id='email-address'
              type='email'
              autoComplete='email'
              required
              className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
              placeholder='Email address'
            />
            {errors.email && (
              <div className='w-full py-2 px-4 bg-red-100 text-center font-semibold border border-red-600 text-red-600 rounded-lg'>
                {errors.email.message}
              </div>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='password' className='text-lg font-medium'>
              Password
            </label>
            <input
              {...register("password")}
              id='password'
              name='password'
              type='password'
              autoComplete='current-password'
              required
              className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
              placeholder='Password'
            />
            {errors.password && (
              <div className='w-full py-2 px-4 bg-red-100 text-center font-semibold border border-red-600 text-red-600 rounded-lg'>
                {errors.password.message}
              </div>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='role' className='text-lg font-medium'>
              Role
            </label>
            <select
              {...register("role")}
              id='role'
              className='appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'>
              <option>Select Role</option>
              <option value='admin'>Admin</option>
              <option value='cashier'>Cashier</option>
              <option value='kitchenMan'>Kitchen Man</option>
            </select>
            {errors.role && (
              <div className='w-full py-2 px-4 bg-red-100 text-center font-semibold border border-red-600 text-red-600 rounded-lg'>
                {errors.role.message}
              </div>
            )}
          </div>
          {loginError && (
            <div className='w-full py-2 px-4 bg-red-100 text-center font-semibold border border-red-600 text-red-600 rounded-lg'>
              {loginError}
            </div>
          )}
          <div>
            <button
              type='submit'
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-tertiary hover:bg-tertiary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary'>
              Create User
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
