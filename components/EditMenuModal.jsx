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
  sellingPrice: Joi.number().min(0).required().label("Selling Price"),
});

export default function EditMenuModal({
  showEditMenuModal,
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
      sellingPrice: defaultValue.sellingPrice,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const response = await http.put(
      api + "/stores/" + storeId + "/menuItems/" + defaultValue._id,
      data,
      {
        "x-auth-token": token,
      }
    );
    setLoading(false);
    if (response.data) {
      showEditMenuModal(false);
      toast.success(response.message);
      setTimeout(() => {
        router.reload();
      }, 1000);
    } else {
      toast.error(response.message);
    }
  };
  const handleDelete = async () => {
    const response = await http.del(
      api + "/stores/" + storeId + "/menuItems/" + defaultValue._id,
      {
        "x-auth-token": token,
      }
    );
    if (response.isDeleted) {
      showEditMenuModal(false);
      toast.warn(response.message);
      setTimeout(() => {
        router.reload();
      }, 1000);
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
          url={api + "/stores/" + storeId + "/menuItems/" + defaultValue._id}
          wantReload={true}
          setLoading={setLoading}
          isLoading={isLoading}
        />
      )}
      <div className='w-screen h-screen flex justify-center items-start fixed bg-black/50 z-20 p-2 overflow-y-auto'>
        <form
          className='lg:w-1/2 w-full flex flex-col gap-4 bg-white p-10 rounded-xl mt-20'
          onSubmit={handleSubmit(onSubmit)}>
          <div
            className='flex justify-end items-center text-2xl cursor-pointer'
            onClick={() => showEditMenuModal(false)}>
            <AiFillCloseCircle />
          </div>
          <div className='rounded-md shadow-sm -space-y-px flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <h1 className='font-semibold text-xl'>Item Name</h1>
              <input
                {...register("name")}
                type='text'
                required
                className='appearance-none font-medium rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:border-4 focus:outline-none focus:ring-tertiary focus:border-tertiring-tertiary sm:text-sm'
                placeholder='Item Name'
              />
              {errors.name && (
                <div className='rounded-md shadow-sm w-full py-2 text-red-500'>
                  {errors.name.message}
                </div>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <h1 className='font-semibold text-xl'>Selling Price</h1>
              <input
                {...register("sellingPrice")}
                type='number'
                step={0.01}
                min={0}
                required
                className='appearance-none font-medium rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:border-4 focus:outline-none focus:ring-tertiary focus:border-tertiring-tertiary sm:text-sm'
                placeholder='Selling price'
              />
              {errors.sellingPrice && (
                <div className='rounded-md shadow-sm w-full py-2 text-red-500'>
                  {errors.sellingPrice.message}
                </div>
              )}
            </div>
            <h1 className='font-semibold text-xl flex justify-between'>
              Ingredients (kg){" "}
              <div className='flex flex-col gap-2'>
                <span className='inline text-sm'>
                  Main Cost -{" "}
                  {(Math.round(defaultValue.mainCost * 100) / 100).toFixed(2)}
                </span>
                {defaultValue.additionalCost !== 0 ? (
                  <span className='inline text-sm'>
                    Additional Cost -{" "}
                    {(
                      Math.round(defaultValue.additionalCost * 100) / 100
                    ).toFixed(2)}
                  </span>
                ) : (
                  <span className='inline text-sm'>
                    (Manually Added by You)
                  </span>
                )}
                <span className='inline text-sm'>
                  Current Profit -{" "}
                  {(Math.round(defaultValue.currentProfit * 100) / 100).toFixed(
                    2
                  )}
                </span>
              </div>
            </h1>
            <div className='flex w-full flex-col gap-2 bg-gray-200 p-4 font-semibold rounded-lg'>
              {defaultValue.ingredients.map((ing) => (
                <div key={ing.ingredient}>
                  {ing.name}
                  {` (${ing.amount}) - Rate : ${ing.rate}`}
                </div>
              ))}
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
