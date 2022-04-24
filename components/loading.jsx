import React from "react";
import Image from "next/image";
export default function Loading() {
  return (
    <div className='w-screen h-screen fixed z-20 bg-black/10 backdrop-blur-sm flex justify-center items-center '>
      <Image
        src='/loading.svg'
        width={50}
        height={50}
        className='bg-transparent animate-spin'></Image>
    </div>
  );
}
