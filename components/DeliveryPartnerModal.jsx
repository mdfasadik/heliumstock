import React, { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import _ from "lodash";
import { toast } from "react-toastify";
import http from "../services/httpService";
import EditPartnerModal from "./EditPartnerModal";

const shcema = Joi.object({
  name: Joi.string().min(3).max(50).required().label("Delivery partner name"),
  share: Joi.number().min(0).max(100).required().label("Share"),
});

export default function DeliveyPartnerModal({
  showDeliveryPartnerModal,
  token,
  api,
  storeId,
  deliveryPartners,
}) {
  const [editDeliveryPartnerModal, showEditDeliveryPartnerModal] =
    useState(false);
  const [selectedPartner, setSelectedPartner] = useState("");

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(shcema),
  });

  const onSubmit = async (data) => {
    const payload = { deliveryPartner: { ...data } };
    const response = await http.put(
      api + "/stores/" + storeId + "/deliveryPartners",
      payload,
      {
        "x-auth-token": token,
      }
    );
    if (response.data) {
      showDeliveryPartnerModal(false);
      toast.success(response.message);
      setTimeout(() => {
        router.reload();
      }, 1000);
    } else {
      toast.error(response.message);
    }
  };

  const handlePartnerEdit = (partner) => {
    setSelectedPartner(partner);
    showEditDeliveryPartnerModal(true);
  };

  return (
    <>
      {editDeliveryPartnerModal && (
        <EditPartnerModal
          api={process.env.NEXT_PUBLIC_API_URL}
          defaultValue={selectedPartner}
          showEditDeliveryPartnerModal={showEditDeliveryPartnerModal}
          storeId={storeId}
          token={token}
        />
      )}
      <div className='w-screen h-screen flex justify-center items-start fixed bg-black/50 z-20 px-2'>
        <form
          className='lg:w-1/2 w-full flex flex-col gap-4 bg-white p-10 rounded-xl mt-20'
          onSubmit={handleSubmit(onSubmit)}>
          <div className='rounded-md shadow-sm  -space-y-px'>
            <div className='flex gap-2 justify-between flex-wrap sm:flex-nowrap'>
              <div className='flex flex-col gap-2 w-full'>
                <h1 className='font-semibold text-xl'>Add Delivery Partner</h1>
                <input
                  {...register("name")}
                  type='text'
                  required
                  className='appearance-none font-medium rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:border-4 focus:outline-none focus:ring-tertiary focus:border-tertiring-tertiary sm:text-sm'
                  placeholder='Delivery partner name'
                />
                {errors.name && (
                  <div className='rounded-md shadow-sm w-full py-2 text-red-500'>
                    {errors.name.message}
                  </div>
                )}
              </div>
              <div className='flex flex-col gap-2 w-full'>
                <h1 className='font-semibold text-xl'>Share (%)</h1>
                <input
                  {...register("share")}
                  type='number'
                  step={0.01}
                  required
                  className='appearance-none font-medium rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:border-4 focus:outline-none focus:ring-tertiary focus:border-tertiring-tertiary sm:text-sm'
                  placeholder='Share in percentage'
                />
                {errors.share && (
                  <div className='rounded-md shadow-sm w-full py-2 text-red-500'>
                    {errors.share.message}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='flex gap-2'>
            <button
              type='submit'
              className='group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-tertiary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary'>
              Add Partner
            </button>
            <div
              onClick={() => showDeliveryPartnerModal(false)}
              className='group relative cursor-pointer flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary'>
              Cancel
            </div>
          </div>
          <div className='w-full bg-gray-200 p-4 rounded-lg flex flex-col'>
            {!deliveryPartners.data && (
              <h1 className='text-center text-gray-600'>
                {deliveryPartners.message}
              </h1>
            )}
            {deliveryPartners.data && (
              <>
                <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
                  <div className='px-4 py-5 sm:px-6'>
                    <h3 className='text-lg leading-6 font-medium text-gray-900'>
                      Delivery Partners
                    </h3>
                  </div>
                  <div className='border-t border-gray-200 '>
                    <dl>
                      {_.orderBy(deliveryPartners.data, "name", "asc").map(
                        (partner) => (
                          <div
                            key={partner._id}
                            onClick={() => handlePartnerEdit(partner)}
                            className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 cursor-pointer hover:bg-gray-100'>
                            <dt className='text-lg font-medium text-gray-500'>
                              {partner.name}
                            </dt>
                            <dd className='mt-1 text-lg text-gray-900 sm:mt-0 sm:col-span-2'>
                              Share holds :{" "}
                              <span className='inline font-semibold'>
                                {" "}
                                {partner.share}%
                              </span>
                            </dd>
                          </div>
                        )
                      )}
                    </dl>
                  </div>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
