import React from "react";

export default function DeliverySells({
  store,
  showDeliverySellsTable,
  setSelectedPartner,
}) {
  const partners = store.deliveryPartners;
  const handleShowAll = (partner) => {
    setSelectedPartner(partner);
    showDeliverySellsTable(true);
  };

  if (partners.length === 0 || partners[0].sells.length === 0) return null;

  return (
    <>
      {partners.map((partner) => (
        <>
          {partner.sells.length !== 0 && (
            <div key={partner._id}>
              <div className='container bg-white p-4 mx-auto rounded-lg shadow-sm mb-4'>
                <div className='flex justify-between items-center w-full mb-4'>
                  <h1 className='font-medium text-lg'>{partner.name}</h1>
                  <button
                    onClick={() => handleShowAll(partner)}
                    className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full font-semibold'>
                    Show All
                  </button>
                </div>
                <h1 className='text-gray-500'>
                  Recent History{" "}
                  {`(${new Date(partner.sells[0].date).toDateString()})`}
                </h1>
                <div className='p-4'>
                  <div className='font-semibold'>
                    <div className='flex gap-6 justify-end items-center'>
                      <h1 className='text-lg'>Total Sell :</h1>
                      <h1 className='text-right text-2xl'>
                        {(
                          Math.round(partner.sells[0].totalSell * 100) / 100
                        ).toFixed(2)}
                      </h1>
                    </div>
                    <div className='flex gap-6 justify-end items-center'>
                      <h1 className='text-lg'>Total Profit :</h1>
                      <h1 className='text-right text-2xl'>
                        {(
                          Math.round(partner.sells[0].totalProfit * 100) / 100
                        ).toFixed(2)}
                      </h1>
                    </div>
                  </div>
                </div>
                <h1 className='text-gray-500 mb-2'>Items Summary</h1>
                <div className='w-full flex gap-6 overflow-x-scroll md:overflow-x-auto'>
                  {partner.sells[0].items.map((item) => (
                    <div
                      key={item.item}
                      className='flex flex-col border-r p-4 border-gray-400'>
                      <h1 className='font-medium'>{item.name}</h1>
                      <div className='flex gap-2 flex-wrap'>
                        <h1>Sold :</h1>
                        <h1 className='font-medium'>{item.quantity}</h1>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      ))}
    </>
  );
}
