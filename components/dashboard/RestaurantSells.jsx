import React from "react";

export default function RestaurantSells({ store, showRestaurantSellsTable }) {
  const sells = store.dineInSells;
  if (sells.length === 0)
    return (
      <div className='text-center text-gray-500 mt-8'>No Sell History </div>
    );

  return (
    <div className='container bg-white p-4 mx-auto rounded-lg shadow-sm mb-4'>
      <div className='flex justify-between items-center w-full mb-4'>
        <h1 className='font-medium text-lg'>Restaurant Sells</h1>
        <button
          onClick={() => showRestaurantSellsTable(true)}
          className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full font-semibold'>
          Show All
        </button>
      </div>
      <h1 className='text-gray-500'>
        Recent History{" "}
        {`(${new Date(store.dineInSells[0].date).toDateString()})`}
      </h1>
      <div className='p-4'>
        <div className='font-semibold'>
          <div className='flex gap-6 justify-end items-center'>
            <h1 className='text-lg'>Total Sell :</h1>
            <h1 className='text-right text-2xl'>
              {(
                Math.round(store.dineInSells[0].totalDineInSell * 100) / 100
              ).toFixed(2)}
            </h1>
          </div>
          <div className='flex gap-6 justify-end items-center'>
            <h1 className='text-lg'>Total Profit :</h1>
            <h1 className='text-right text-2xl'>
              {(
                Math.round(store.dineInSells[0].totalDineInProfit * 100) / 100
              ).toFixed(2)}
            </h1>
          </div>
        </div>
      </div>
      <h1 className='text-gray-500 mb-2'>Items Summary</h1>
      <div className='w-full flex gap-6 overflow-x-scroll md:overflow-x-auto'>
        {store.dineInSells[0].items.map((item) => (
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
  );
}
