import React, { useEffect, useState } from "react";
import _ from "lodash";
import Pagination from "../utils/Pagination";
import { MdCancel } from "react-icons/md";
import RestaurantSellsDetails from "./RestaurantSellsDetails";
import DeliverySellsDetails from "./DeliverySellsDetails";

export default function DeliverySellsTable({
  partner,
  showDeliverySellsTable,
  api,
  authToken,
  storeId,
}) {
  const [selectedSell, setSelectedSell] = useState();
  const [pageData, setPageData] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (partner) setPageData(partner.sells);
  }, []);

  // Pagination

  let pageSize = 5;
  const firstPageIndex = (currentPage - 1) * pageSize;
  const lastPageIndex = firstPageIndex + pageSize;
  const currentTableData = pageData?.slice(firstPageIndex, lastPageIndex);

  const handleSellSelect = (sell) => {
    setSelectedSell(sell);
  };

  return (
    <>
      {selectedSell && (
        <DeliverySellsDetails
          sell={selectedSell}
          setSelectedSell={setSelectedSell}
          api={api}
          authToken={authToken}
          storeId={storeId}
          partnerId={partner._id}
        />
      )}
      <div className='w-full h-full flex justify-center fixed bg-black/50 z-20 px-2'>
        {pageData && (
          <div className='lg:w-2/3 w-full h-auto sm:px-6 mb-8 mt-4'>
            <div className='px-4 md:px-10 py-4 md:py-7 bg-white rounded-tl-lg rounded-tr-lg'>
              <div className='flex items-center justify-between'>
                <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800'>
                  {partner.name} Sells
                </h1>
                <button
                  onClick={() => showDeliverySellsTable(false)}
                  className='text-2xl'>
                  <MdCancel />
                </button>
              </div>
            </div>
            <div className='bg-white shadow px-4 md:px-10 pt-4 md:pt-7 pb-5 overflow-y-auto'>
              <table className='w-full whitespace-nowrap overflow-scroll'>
                <thead>
                  <tr className='h-16 w-full leading-none text-gray-800 text-lg'>
                    <th className='font-bold text-left pl-4'>Date</th>
                    <th className='font-bold text-left pl-4'>Total Sells</th>
                    <th className='font-bold text-left pl-4'>Total Profit</th>
                  </tr>
                </thead>
                <tbody className='w-full'>
                  {_.orderBy(currentTableData, "inStock", "asc").map((sell) => (
                    <tr
                      onClick={() => handleSellSelect(sell)}
                      key={sell._id}
                      className='h-20 text-sm leading-none text-gray-800 bg-white hover:bg-gray-200 border-b border-t border-gray-200'>
                      <td className='pl-4 cursor-pointer'>
                        <p className='font-medium'>
                          {new Date(sell.date).toDateString()}
                        </p>
                      </td>
                      <td className='pl-4 cursor-pointer'>
                        <p className='font-medium'>
                          {(Math.round(sell.totalSell * 100) / 100).toFixed(2)}
                        </p>
                      </td>
                      <td className='pl-4 cursor-pointer'>
                        <p className='font-medium'>
                          {(Math.round(sell.totalProfit * 100) / 100).toFixed(
                            2
                          )}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className='mt-6 w-full flex justify-center'>
                <Pagination
                  currentPage={currentPage}
                  totalCount={pageData.length}
                  pageSize={pageSize}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
