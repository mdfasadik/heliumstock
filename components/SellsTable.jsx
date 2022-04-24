import React, { useEffect, useState } from "react";
import _ from "lodash";
import Pagination from "./utils/Pagination";

const renderInStock = (inStock) => {
  const stock = (Math.round(inStock * 100) / 100).toFixed(2);
  return stock >= 5 ? (
    <span className='font-medium'>{stock}</span>
  ) : (
    <span className='font-bold text-red-600'>
      {stock + " " + "(Low Stock)"}
    </span>
  );
};

export default function SellsTable({
  sells,
  showEditStockModal,
  setSelectedStock,
}) {
  const [pageData, setPageData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [sorted, setSorted] = useState(false);

  useEffect(() => {
    if (sells.data) setPageData(sells.data);
  }, []);

  const handleSellSelect = (sell) => {
    showEditStockModal(true);
    setSelectedStock(stock);
  };

  // Pagination

  let pageSize = 5;
  const firstPageIndex = (currentPage - 1) * pageSize;
  const lastPageIndex = firstPageIndex + pageSize;
  const currentTableData = pageData?.slice(firstPageIndex, lastPageIndex);

  //sorting

  const handleSrot = () => {
    let sortedData;
    if (!sorted) {
      sortedData = pageData.filter((d) => d.inStock <= 5);
      setPageData(sortedData);
    } else {
      setPageData(stocks.data);
    }
    setSorted(!sorted);
  };

  return (
    <>
      {!sells.data && (
        <h1 className='text-center text-gray-500'>{sells.message}</h1>
      )}
      {pageData && (
        <div className='w-full sm:px-6 mb-8'>
          <div className='px-4 md:px-10 py-4 md:py-7 bg-gray-100 rounded-tl-lg rounded-tr-lg'>
            <div className='md:flex items-center justify-between gap-8'>
              <h1 className='text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800'>
                Restaurant Sells
              </h1>
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
                        {renderInStock(sell.totalDineInSell)}
                      </p>
                    </td>
                    <td className='pl-4 cursor-pointer'>
                      <p className='font-medium'>{sell.totalDineInProfit}</p>
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
    </>
  );
}
