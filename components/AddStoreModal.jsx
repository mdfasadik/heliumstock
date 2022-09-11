import React, { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { toast } from "react-toastify";
import http from "../services/httpService";
import Loading from "./loading";

const shcema = Joi.object({
  name: Joi.string().min(3).max(50).required().label("Store Name"),
});

export default function AddStoreModal({ steAddStoreModal, token, api }) {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(shcema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const response = await http.post(api + "/stores", data, {
      "x-auth-token": token,
    });
    setLoading(false);
    if (response.data) {
      router.push("/store/" + response.data._id);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className='w-screen h-screen flex justify-center items-start fixed bg-black/50 px-2'>
        <form
          className='lg:w-1/2 w-full flex flex-col gap-4 bg-white p-10 rounded-xl mt-20'
          onSubmit={handleSubmit(onSubmit)}>
          <div className='rounded-md shadow-sm -space-y-px'>
            <div className='flex flex-col gap-2'>
              <h1 className='font-semibold text-xl'>Store Name</h1>
              <input
                {...register("name")}
                type='text'
                required
                className='appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:border-4 focus:outline-none focus:ring-tertiary focus:border-tertiring-tertiary sm:text-sm'
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
              {isLoading ? "Creating..." : "Create Store"}
            </button>
            <div
              onClick={() => steAddStoreModal(false)}
              className='group relative cursor-pointer flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary'>
              Cancel
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
