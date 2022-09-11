import React, { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { toast } from "react-toastify";
import http from "../services/httpService";
import { AiFillCloseCircle } from "react-icons/ai";
import DeleteModal from "./deleteModal";

const shcema = Joi.object({
  name: Joi.string().min(3).max(50).required().label("Store Name"),
  inStock: Joi.number().min(0).required().label("In Stock"),
  rate: Joi.number().min(0).required().label("Rate"),
});

export default function EditStockModal({
  showEditStockModal,
  token,
  api,
  storeId,
  defaultValue,
}) {
  const [isLoading, setLoading] = useState(false);
  const [deleteModal, showDeleteModa] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(shcema),
    defaultValues: {
      name: defaultValue.name,
      inStock: 0,
      rate: defaultValue.rate,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const response = await http.put(
      api + "/stores/" + storeId + "/stocks/" + defaultValue._id,
      data,
      {
        "x-auth-token": token,
      }
    );
    setLoading(false);
    if (response.data) {
      showEditStockModal(false);
      toast.success(response.message);
      setTimeout(() => {
        router.reload();
      }, 500);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <>
      {deleteModal && (
        <DeleteModal
          authToken={token}
          content={defaultValue.name}
          showDeleteModal={showDeleteModa}
          url={api + "/stores/" + storeId + "/stocks/" + defaultValue._id}
          wantReload={true}
          isLoading={isLoading}
          setLoading={setLoading}
        />
      )}
      <div className='w-screen h-screen flex justify-center items-start fixed bg-black/50 z-20 px-2'>
        <form
          className='lg:w-1/2 w-full flex flex-col gap-4 bg-white p-10 rounded-xl mt-20'
          onSubmit={handleSubmit(onSubmit)}>
          <div
            className='flex justify-end items-center text-2xl cursor-pointer'
            onClick={() => showEditStockModal(false)}>
            <AiFillCloseCircle />
          </div>
          <div className='rounded-md shadow-sm -space-y-px flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <h1 className='font-semibold text-xl'>Ingredient</h1>
              <input
                {...register("name")}
                type='text'
                required
                className='appearance-none font-medium rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:border-4 focus:outline-none focus:ring-tertiary focus:border-tertiring-tertiary sm:text-sm'
                placeholder='Ingredient'
              />
              {errors.name && (
                <div className='rounded-md shadow-sm w-full py-2 text-red-500'>
                  {errors.name.message}
                </div>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <h1 className='font-semibold text-xl'>Add to stock (kg)</h1>
              <input
                {...register("inStock")}
                type='number'
                step={0.01}
                min={0}
                required
                className='appearance-none font-medium rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:border-4 focus:outline-none focus:ring-tertiary focus:border-tertiring-tertiary sm:text-sm'
                placeholder='Add to stock'
              />
              {errors.inStock && (
                <div className='rounded-md shadow-sm w-full py-2 text-red-500'>
                  {errors.inStock.message}
                </div>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <h1 className='font-semibold text-xl'>Rate</h1>
              <input
                {...register("rate")}
                type='number'
                step={0.01}
                min={0}
                required
                className='appearance-none font-medium rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:border-4 focus:outline-none focus:ring-tertiary focus:border-tertiring-tertiary sm:text-sm'
                placeholder='Rate'
              />
              {errors.rate && (
                <div className='rounded-md shadow-sm w-full py-2 text-red-500'>
                  {errors.rate.message}
                </div>
              )}
            </div>
          </div>
          <div className='flex justify-between'>
            <div className='flex gap-2'>
              <button
                type='submit'
                disabled={isLoading && true}
                className='group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-tertiary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary'>
                {isLoading ? "Updating..." : "Update"}
              </button>
            </div>
            <div
              onClick={() => showDeleteModa(true)}
              className='group relative text-white cursor-pointer flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary'>
              Delete
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
