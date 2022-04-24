import React from "react";
import http from "../services/httpService";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function DeleteModal({
  content,
  showDeleteModal,
  url,
  authToken,
}) {
  const router = useRouter();

  const handleDelete = async () => {
    const response = await http.del(url, { "x-auth-token": authToken });
    if (response.isDeleted) {
      toast.warning(response.message);
      router.replace("/");
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className='w-screen h-screen fixed z-20 flex justify-center bg-black/20 items-start px-4 '>
      <div className='flex flex-col gap-4 justify-center mt-20 bg-white p-10 rounded-xl w-full md:w-auto'>
        <h1 className='text-xl'>
          Do you want to delete{" "}
          <span className='inline font-bold'>{content}</span> ?
        </h1>
        <div className='flex gap-2'>
          <button
            onClick={handleDelete}
            className='px-3 py-2 bg-red-600 font-semibold hover:bg-red-800 text-white rounded-md'>
            Delete
          </button>
          <button
            onClick={() => showDeleteModal(false)}
            className='px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md font-medium'>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
