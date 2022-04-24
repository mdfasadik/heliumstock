import Layout from "../../components/layout";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Store } from "../../utils/store";
import { useRouter } from "next/router";
import { FaPlus } from "react-icons/fa";
import http from "../../services/httpService";
import AddStoreModal from "../../components/AddStoreModal";

export default function Home({ response, authToken }) {
  const [addStoreModal, steAddStoreModal] = useState(false);
  const { authToken: currentUser } = useContext(Store);
  const router = useRouter();
  const { data: stores } = response;
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!currentUser) {
      router.replace("/login");
    }
  }, []);
  if (currentUser) {
    return (
      <>
        {addStoreModal && (
          <AddStoreModal
            steAddStoreModal={steAddStoreModal}
            token={authToken}
            api={api}
          />
        )}
        <Layout title='Stores'>
          <div className='flex gap-3 items-cente flex-wrap'>
            {stores?.map((store) => (
              <Link href={"/store/" + store._id} passHref key={store._id}>
                <h1 className='px-6 py-4 font-semibold text-xl shadow-lg hover:shadow-none rounded-lg bg-white whitespace-nowrap cursor-pointer'>
                  {store.name}
                </h1>
              </Link>
            ))}
            {currentUser.role === "admin" && (
              <button
                onClick={() => steAddStoreModal(true)}
                className='px-6 py-4 font-semibold text-xl border-2 border-dashed border-gray-300 rounded-lg cursor-pointer text-gray-400'>
                <FaPlus />
              </button>
            )}
          </div>
        </Layout>
      </>
    );
  } else {
    return null;
  }
}
export async function getServerSideProps(context) {
  return {
    props: {
      authToken: context.req.cookies["authToken"] || null,
      response: await http.get(process.env.NEXT_PUBLIC_API_URL + "/stores", {
        "x-auth-token": context.req.cookies["authToken"],
      }),
    },
  };
}
