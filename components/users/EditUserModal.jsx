import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { toast } from "react-toastify";
import { RiCloseCircleFill } from "react-icons/ri";

import http from "../../services/httpService";

const schema = Joi.object({
  username: Joi.string().min(3).max(50).required().label("Username"),
  email: Joi.string().min(5).max(255).required().label("Email"),
  role: Joi.string().min(3).max(50).required().label("Role"),
});

export default function EditUserModal({
  api,
  token,
  showEditUserModal,
  defaultValue,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(schema),
    defaultValues: {
      username: defaultValue.username,
      email: defaultValue.email,
      role: defaultValue.role,
    },
  });
  const [loginError, setLoginError] = useState("");
  const router = useRouter();

  const onSubmit = async (data) => {
    const response = await http.put(api + "/users/" + defaultValue._id, data, {
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
    <div className='w-screen h-screen px-4 fixed z-20 bg-black/50'>
      <div className='md:w-2/3 w-full rounded-lg bg-white mx-auto mt-8 p-4'>
        <div className='w-full'>
          <div className='flex items-center justify-between p-4'>
            <h1 className='text-xl font-medium'>Edit User</h1>
            <button
              onClick={() => showEditUserModal(false)}
              className='text-3xl'>
              <RiCloseCircleFill />
            </button>
          </div>
          <form className='p-4' onSubmit={handleSubmit(onSubmit)}>
            <div className='rounded-md flex flex-col gap-4'>
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
                  className='group relative w-full flex justify-center py-2 px-4 border border-transparent  font-medium rounded-md text-white bg-tertiary hover:bg-tertiary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary'>
                  Update User
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
