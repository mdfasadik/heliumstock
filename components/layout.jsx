import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaStore, FaUsers } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { RiLogoutCircleFill } from "react-icons/ri";
import { CgMenuGridR } from "react-icons/cg";
import { Store } from "../utils/store";
import auth from "../services/authService";

export default function Layout({ children, title }) {
  const [user, setUser] = useState("");
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const router = useRouter();
  const { authToken } = useContext(Store);
  useEffect(() => {
    if (authToken) {
      setUser(authToken);
    }
  }, []);
  const handleLogout = () => {
    auth.logout();
    router.replace("/login");
  };
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className='lg:flex w-screen h-screen justify-between items-center'>
        <div
          className={`sidebar flex flex-col fixed lg:relative z-10 lg:translate-x-0 ${
            sideBarOpen ? "-translate-x-full" : "translate-x-0"
          } transition-all  h-full bg-primary text-white whitespace-nowrap p-5`}>
          <div className='flex flex-col  cursor-pointer '>
            <p className='font-bold  text-xl flex items-end gap-2 '>
              {user.username}
            </p>
            <p className=' capitalize'>{user.role}</p>
          </div>
          {user.role === "admin" && (
            <>
              <div className='flex flex-col gap-8 py-8 text-xl w-full mt-8'>
                <div
                  className={`w-full cursor-pointer hover:text-signature ${
                    router.pathname === "/" ? "linkActive" : ""
                  }`}>
                  <Link href='/' passHref>
                    <div className='flex gap-4 items-center '>
                      <MdDashboard />
                      <p>Dashboard</p>
                    </div>
                  </Link>
                </div>
                <div
                  className={`w-full cursor-pointer hover:text-signature ${
                    router.pathname === "/stores" ? "linkActive" : ""
                  }`}>
                  <Link href='/stores' passHref>
                    <div className='flex gap-4 items-center '>
                      <FaStore />
                      <p>Stores</p>
                    </div>
                  </Link>
                </div>
                <div
                  className={`w-full cursor-pointer hover:text-signature ${
                    router.pathname === "/users" ? "linkActive" : ""
                  }`}>
                  <Link href='/users' passHref>
                    <div className='flex gap-4 items-center '>
                      <FaUsers />
                      <p>Users</p>
                    </div>
                  </Link>
                </div>
              </div>
            </>
          )}
          {user.role !== "admin" && (
            <>
              <div className='flex flex-col gap-8 py-8 text-xl w-full mt-8'>
                <div
                  className={`w-full cursor-pointer hover:text-signature ${
                    router.pathname === "/stores" ? "linkActive" : ""
                  }`}>
                  <Link href='/stores' passHref>
                    <div className='flex gap-4 items-center '>
                      <FaStore />
                      <p>Stores</p>
                    </div>
                  </Link>
                </div>
              </div>
            </>
          )}

          <div
            className='flex gap-2 items-center mt-auto text-xl hover:text-red-500 cursor-pointer'
            onClick={handleLogout}>
            <RiLogoutCircleFill /> <p>Logout</p>
          </div>
        </div>
        <div className=' h-full w-full flex flex-col'>
          <nav className='w-full h-20  px-4 py-2 flex justify-between items-center border-b-2 fixed lg:relative'>
            <div className='text-xl font-bold'>{title}</div>
            <button
              className='rounded-full p-4 text-3xl bg-gray-50 shadow-lg text-primary hover:bg-gray-100 lg:hidden'
              onClick={() => setSideBarOpen(!sideBarOpen)}>
              <CgMenuGridR />
            </button>
          </nav>
          <div className=' h-full p-4 lg:mt-0 mt-20 overflow-y-auto'>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
