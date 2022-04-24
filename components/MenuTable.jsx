import React, { useCallback, useEffect, useState } from "react";
import _ from "lodash";

import SearchField from "./utils/SearchBox";
import Pagination from "./utils/Pagination";

export default function MenuTable({
  menuItems,
  showEditMenuModal,
  setSelectedMenu,
}) {
  const [pageData, setPageData] = useState();
  const [q, setQ] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (menuItems.data) setPageData(menuItems.data);
  }, []);

  const onChange = useCallback((event) => {
    if (pageData) {
      const query = event.target.value;
      setQ(query);
      if (query.length) {
        const filteredData = pageData.filter((data) =>
          ["name"].some((param) =>
            data[param]
              .toString()
              .toLowerCase()
              .trim()
              .includes(q.toString().toLowerCase().trim())
          )
        );
        setPageData(filteredData);
      } else {
        setPageData(menuItems.data);
      }
    }
  });

  const handleStockSelect = (stock) => {
    showEditMenuModal(true);
    setSelectedMenu(stock);
  };

  // Pagination

  let pageSize = 5;
  const firstPageIndex = (currentPage - 1) * pageSize;
  const lastPageIndex = firstPageIndex + pageSize;
  const currentTableData = pageData?.slice(firstPageIndex, lastPageIndex);

  //sorting

  return (
    <>
      {!menuItems.data && (
        <h1 className='text-center text-gray-500'>{menuItems.message}</h1>
      )}
      {pageData && (
        <div className='w-full sm:px-6 mb-8'>
          <div className='px-4 md:px-10 py-4 md:py-7 bg-gray-100 rounded-tl-lg rounded-tr-lg'>
            <div className='md:flex items-center justify-between gap-8'>
              <h1 className='text-base whitespace-nowrap sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-gray-800'>
                Menu Items
              </h1>
              <SearchField onChange={onChange} />
            </div>
          </div>
          <div className='bg-white shadow px-4 md:px-10 pt-4 md:pt-7 pb-5 overflow-y-auto'>
            <table className='w-full whitespace-nowrap overflow-scroll'>
              <thead>
                <tr className='h-16 w-full leading-none text-gray-800 text-lg'>
                  <th className='font-bold text-left pl-4'>Name</th>
                  <th className='font-bold text-left pl-4'>Price</th>
                </tr>
              </thead>
              <tbody className='w-full'>
                {_.orderBy(currentTableData, "name", "asc").map((item) => (
                  <tr
                    onClick={() => handleStockSelect(item)}
                    key={item._id}
                    className='h-20 text-sm leading-none text-gray-800 bg-white hover:bg-gray-200 border-b border-t border-gray-200'>
                    <td className='pl-4 cursor-pointer'>
                      <p className='font-medium'>{item.name}</p>
                    </td>
                    <td className='pl-4 cursor-pointer'>
                      <p className='font-medium'>{item.sellingPrice}</p>
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
