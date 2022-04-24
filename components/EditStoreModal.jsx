import React from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { toast } from "react-toastify";
import http from "../services/httpService";

const shcema = Joi.object({
  name: Joi.string().min(3).max(50).required().label("Store Name"),
});

export default function AddStoreModal({
  setEditStoreNameModal,
  token,
  api,
  storeId,
  defaultValue,
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(shcema),
    defaultValues: {
      name: defaultValue,
    },
  });

  const onSubmit = async (data) => {
    const response = await http.put(api + "/stores/" + storeId, data, {
      "x-auth-token": token,
    });
    if (response.data) {
      setEditStoreNameModal(false);
      toast.success(response.message);
      setTimeout(() => {
        router.reload();
      }, 1000);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className='w-screen h-screen flex justify-center items-start fixed bg-black/50 z-20 px-2'>
      <form
        className='lg:w-1/2 w-full flex flex-col gap-4 bg-white p-10 rounded-xl mt-20'
        onSubmit={handleSubmit(onSubmit)}>
        <div className='rounded-md shadow-sm -space-y-px'>
          <div className='flex flex-col gap-2'>
            <h1 className='font-semibold text-xl'>Edit Store Name</h1>
            <input
              {...register("name")}
              type='text'
              required
              className='appearance-none font-medium rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:border-4 focus:outline-none focus:ring-tertiary focus:border-tertiring-tertiary sm:text-sm'
              placeholder='Store Name'
            />
            {errors.name && (
              <div className='rounded-md shadow-sm w-full py-2 text-red-500'>
                {errors.name.message}
              </div>
            )}
          </div>
        </div>
        <div className='flex gap-2'>
          <button
            type='submit'
            className='group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-tertiary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary'>
            Update
          </button>
          <div
            onClick={() => setEditStoreNameModal(false)}
            className='group relative cursor-pointer flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary'>
            Cancel
          </div>
        </div>
      </form>
    </div>
  );
}
