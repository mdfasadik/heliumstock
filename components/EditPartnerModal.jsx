import React from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { toast } from "react-toastify";
import http from "../services/httpService";

const shcema = Joi.object({
  name: Joi.string().min(3).max(50).required().label("Partner Name"),
  share: Joi.number().min(0).max(100).required().label("Share"),
});

export default function EditPartnerModal({
  showEditDeliveryPartnerModal,
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
      name: defaultValue.name,
      share: defaultValue.share,
    },
  });
  const handlePartnerDelete = async () => {
    const response = await http.del(
      api + "/stores/" + storeId + "/deliveryPartners/" + defaultValue._id,
      {
        "x-auth-token": token,
      }
    );
    if (response.isDeleted) {
      showEditDeliveryPartnerModal(false);
      toast.warn(response.message);
      setTimeout(() => {
        router.reload();
      }, 1000);
    } else {
      toast.error(response.message);
    }
  };

  const onSubmit = async (data) => {
    const response = await http.put(
      api + "/stores/" + storeId + "/deliveryPartners/" + defaultValue._id,
      data,
      {
        "x-auth-token": token,
      }
    );
    if (response.data) {
      showEditDeliveryPartnerModal(false);
      toast.success(response.message);
      setTimeout(() => {
        router.reload();
      }, 1000);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className='w-screen h-screen flex justify-center items-start fixed bg-black/50 z-30 backdrop-blur-sm px-2'>
      <form
        className='lg:w-1/2 w-full flex flex-col gap-4 bg-white p-10 rounded-xl mt-20'
        onSubmit={handleSubmit(onSubmit)}>
        <div className='rounded-md shadow-sm flex flex-col gap-2 -space-y-px'>
          <div className='flex flex-col gap-2'>
            <h1 className='font-semibold text-xl'>Delivery Partner</h1>
            <input
              {...register("name")}
              type='text'
              required
              className='appearance-none font-medium rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:border-4 focus:outline-none focus:ring-tertiary focus:border-tertiring-tertiary sm:text-sm'
              placeholder='Partner Name'
            />
            {errors.name && (
              <div className='rounded-md shadow-sm w-full py-2 text-red-500'>
                {errors.name.message}
              </div>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <h1 className='font-semibold text-xl'>Share (%)</h1>
            <input
              {...register("share")}
              type='number'
              step={0.001}
              required
              className='appearance-none font-medium rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:border-4 focus:outline-none focus:ring-tertiary focus:border-tertiring-tertiary sm:text-sm'
              placeholder='Share in percentage'
            />
            {errors.name && (
              <div className='rounded-md shadow-sm w-full py-2 text-red-500'>
                {errors.name.message}
              </div>
            )}
          </div>
        </div>
        <div className='flex justify-between w-full'>
          <div className='flex gap-2'>
            <button
              type='submit'
              className='group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-tertiary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary'>
              Update
            </button>
            <div
              onClick={() => showEditDeliveryPartnerModal(false)}
              className='group relative cursor-pointer flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary'>
              Cancel
            </div>
          </div>
          <div
            onClick={handlePartnerDelete}
            className='text-white group relative cursor-pointer flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary'>
            Delete
          </div>
        </div>
      </form>
    </div>
  );
}
