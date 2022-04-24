import React from "react";
import http from "../../services/httpService";
import { MdCancel } from "react-icons/md";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function RestaurantSellsDetails({
  sell,
  setSelectedSell,
  api,
  authToken,
  storeId,
}) {
  const router = useRouter();

  const handleDelete = async (sellId) => {
    const response = await http.del(
      api + "/stores/" + storeId + "/dineInSells/" + sellId,
      { "x-auth-token": authToken }
    );

    if (response.isDeleted) {
      setSelectedSell(false);
      toast.warn(response.message);
      setTimeout(() => {
        router.reload();
      }, 1000);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className='w-screen h-screen backdrop-blur-sm fixed bg-black/40 z-40'>
      <div className='bg-white p-6 w-2/3 mx-auto mt-10 rounded-lg'>
        <div className='flex justify-between'>
          <button
            onClick={() => handleDelete(sell._id)}
            className='px-4 py-2 text-white font-medium bg-red-600 hover:bg-red-700 rounded-md'>
            Delete Record
          </button>
          <button onClick={() => setSelectedSell(false)} className='text-2xl'>
            <MdCancel />
          </button>
        </div>
        <div className='container mt-10 mx-auto'>
          <h1 className='text-gray-500 font-medium'>Sells Details</h1>
          <div className='text-right w-full'>
            <div className='flex gap-4 justify-end items-center'>
              <h1 className='text-lg font-medium'>Total Sell : </h1>
              <h1 className='text-2xl font-medium'>
                {" "}
                {(Math.round(sell.totalDineInSell * 100) / 100).toFixed(2)}
              </h1>
            </div>
            <div className='flex gap-4 justify-end items-center'>
              <h1 className='text-lg font-medium'>Total Profit : </h1>
              <h1 className='text-2xl font-medium'>
                {" "}
                {(Math.round(sell.totalDineInProfit * 100) / 100).toFixed(2)}
              </h1>
            </div>
          </div>
          <h1 className='text-gray-500 font-medium mb-6'>Items Summary</h1>
          <div className='w-full flex gap-6 overflow-x-scroll md:overflow-x-auto'>
            {sell.items.map((item) => (
              <div
                key={item.item}
                className='flex flex-col border-r p-4 border-gray-400'>
                <h1 className='font-medium'>{item.name}</h1>
                <div className='flex gap-2 flex-wrap'>
                  <h1>Sold :</h1>
                  <h1 className='font-medium'>{item.dineIn}</h1>
                </div>
                <div className='hidden sm:block'>
                  <div className='flex gap-2 flex-wrap'>
                    <h1>From Kitchen :</h1>
                    <h1>{item.fromKitchen}</h1>
                  </div>
                  <div className='flex gap-2 flex-wrap'>
                    <h1>Back to Kitchen :</h1>
                    <h1>{item.backToKitchen}</h1>
                  </div>
                  <div className='flex gap-2 flex-wrap text-red-600'>
                    <h1>Waste :</h1>
                    <h1>{item.waste}</h1>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
