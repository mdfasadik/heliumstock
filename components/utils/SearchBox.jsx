import React from "react";
import { RiSearchLine } from "react-icons/ri";

export default function SearchField({ onChange }) {
  return (
    <>
      <div className='flex items-center lg:w-1/2 w-full rounded-lg border'>
        <button className='text-2xl p-2 bg-tertiary hover:bg-tertiary/60 text-white rounded-l-lg '>
          <RiSearchLine />
        </button>
        <input
          type='text'
          onChange={onChange}
          className='form-input text-inherit bg-white w-full focus:ring-gray-400 focus:border-0 border-0 rounded-r-lg'
          placeholder='Search...'
        />
      </div>
    </>
  );
}
