import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Store } from "../utils/store";

import http from "../services/httpService";

import Layout from "../components/layout";
import RestaurantSells from "../components/dashboard/RestaurantSells";
import DeliverySells from "../components/dashboard/DeliverySells";
import RestaurantSellsTable from "../components/dashboard/RestaurantSellsTable";
import DeliverySellsTable from "../components/dashboard/DeliverySellsTable";

export default function home({ response, authToken }) {
  const [selectedStore, setSelectedStore] = useState();
  const [restaurantSellsTable, showRestaurantSellsTable] = useState(false);
  const [deliverySellsTable, showDeliverySellsTable] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState();

  const { authToken: currentUser } = useContext(Store);
  const router = useRouter();
  const { data: stores, message } = response;
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!currentUser) {
      router.replace("/login");
    }
    if (currentUser && currentUser.role !== "admin") {
      router.replace("/stores");
    }
    if (stores) setSelectedStore(stores[0]);
  }, []);

  const handleStoreSelect = (index) => {
    setSelectedStore(stores[index]);
  };

  if (currentUser && selectedStore) {
    return (
      <>
        {selectedStore && restaurantSellsTable && (
          <RestaurantSellsTable
            sells={selectedStore.dineInSells}
            showRestaurantSellsTable={showRestaurantSellsTable}
            api={api}
            authToken={authToken}
            storeId={selectedStore._id}
          />
        )}
        {selectedStore && deliverySellsTable && (
          <DeliverySellsTable
            partner={selectedPartner}
            showDeliverySellsTable={showDeliverySellsTable}
            api={api}
            authToken={authToken}
            storeId={selectedStore._id}
          />
        )}
        {selectedStore && (
          <Layout title='Dashboard'>
            <div className='flex gap-2 mb-4'>
              {stores.map((store) => (
                <button
                  key={store._id}
                  onClick={() => handleStoreSelect(stores.indexOf(store))}
                  className={`px-4 py-2 rounded-md font-medium text-xl ${
                    store._id === selectedStore._id
                      ? "bg-tertiary text-white"
                      : "bg-gray-200 text-black"
                  }`}>
                  {store.name}
                </button>
              ))}
            </div>

            <RestaurantSells
              store={selectedStore}
              showRestaurantSellsTable={showRestaurantSellsTable}
            />
            <DeliverySells
              store={selectedStore}
              showDeliverySellsTable={showDeliverySellsTable}
              setSelectedPartner={setSelectedPartner}
            />
          </Layout>
        )}
      </>
    );
  } else {
    return (
      <>
        <Layout>
          <h1 className='text-gray-500 text-center mt-4 text-lg'>{message}</h1>
        </Layout>
      </>
    );
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
