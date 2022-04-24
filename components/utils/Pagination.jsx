import { useMemo } from "react";

//TODO : usePagination hook which returns the range of numbers

const range = (start, end) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, index) => index + start);
};
export const DOTS = "...";
export const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
}) => {
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize);

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    /*
      Case 1:
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    /*
    	Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
    */
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    /*
      We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
    */
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    /*
    	Case 2: No left dots to show, but rights dots to be shown
    */
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    /*
    	Case 3: No right dots to show, but left dots to be shown
    */
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    /*
    	Case 4: Both left and right dots to be shown
    */
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};

//TODO : Main pagination component (Styling and other stuffs)
export default function Pagination({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
}) {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });
  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <>
      <nav aria-label='Page navigation'>
        <ul className='inline-flex '>
          {/* left arrow */}
          <li
            onClick={onPrevious}
            className={
              currentPage === 1 ? "text-gray-500 pointer-events-none" : ""
            }>
            <button className='flex items-center justify-center w-10 h-10 transition-colors rounded-full focus:shadow-outline lg:hover:bg-gray-300'>
              <svg className='w-4 h-4 fill-current' viewBox='0 0 20 20'>
                <path
                  d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                  clipRule='evenodd'
                  fillrul='evenodd'></path>
              </svg>
            </button>
          </li>
          {paginationRange.map((pageNumber, index) => {
            // If the pageItem is a DOT, render the DOTS unicode character
            if (pageNumber === DOTS) {
              return (
                <li key={index} className='text-xl'>
                  &#8230;
                </li>
              );
            }

            // Render our Page Pills
            return (
              <li key={index}>
                <button
                  onClick={() => onPageChange(pageNumber)}
                  className={`${
                    pageNumber === currentPage ? "bg-tertiary text-white" : ""
                  } w-10 h-10 transition-colors rounded-full focus:shadow-outline ${
                    pageNumber !== currentPage ? "lg:hover:bg-gray-300" : ""
                  }`}>
                  {pageNumber}
                </button>
              </li>
            );
          })}

          {/* right arrow */}
          <li
            onClick={onNext}
            className={
              currentPage === lastPage
                ? "text-gray-500 pointer-events-none"
                : ""
            }>
            <button className='flex items-center justify-center w-10 h-10 transition-colors rounded-full focus:shadow-outline lg:hover:bg-gray-300 '>
              <svg className='w-4 h-4 fill-current' viewBox='0 0 20 20'>
                <path
                  d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                  clipRule='evenodd'
                  fliprule='evenodd'></path>
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
