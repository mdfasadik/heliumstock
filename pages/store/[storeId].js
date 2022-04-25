import React, { useContext, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { MdDeliveryDining } from "react-icons/md";

import { Store } from "../../utils/store";
import http from "../../services/httpService";

import Layout from "../../components/layout";
import DeleteModal from "../../components/deleteModal";
import StockTable from "../../components/StockTable";
import EditStoreModal from "../../components/EditStoreModal";
import UpdateStocksModal from "../../components/UpdateStocksModal";
import EditStockModal from "../../components/EditStockModal";
import UpdateMenuModal from "../../components/UpdateMenuModal";
import MenuTable from "../../components/MenuTable";
import EditMenuModal from "../../components/EditMenuModal";
import SellsModal from "../../components/SellsModal";
import DeliveyPartnerModal from "../../components/DeliveryPartnerModal";
import DeliverySellsModal from "../../components/DeliverySellsModal";

export default function StoreId({
  storeName,
  storeId,
  authToken,
  stocks,
  menuItems,
  deliveryPartners,
}) {
  const { authToken: currentUser } = useContext(Store);
  const [deleteModal, showDeleteModal] = useState(false);
  const [editStoreNameModal, setEditStoreNameModal] = useState(false);
  const [deliveryPartnerModal, showDeliveryPartnerModal] = useState(false);
  const [updateStocksModal, showUpdateStockModal] = useState(false);
  const [editStockModal, showEditStockModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState();
  const [updateMenuModal, showUpdateMenuModal] = useState(false);
  const [editMenuModal, showEditMenuModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState();
  const [sellsModal, showSellsModal] = useState(false);
  const [deliverySellsModal, showDeliverySellsModal] = useState(false);

  return (
    <>
      {deleteModal && (
        <DeleteModal
          content={storeName}
          showDeleteModal={showDeleteModal}
          url={process.env.NEXT_PUBLIC_API_URL + "/stores/" + storeId}
          authToken={authToken}
          wantReload={false}
        />
      )}
      {editStoreNameModal && (
        <EditStoreModal
          token={authToken}
          api={process.env.NEXT_PUBLIC_API_URL}
          setEditStoreNameModal={setEditStoreNameModal}
          storeId={storeId}
          defaultValue={storeName}
        />
      )}
      {deliveryPartnerModal && (
        <DeliveyPartnerModal
          api={process.env.NEXT_PUBLIC_API_URL}
          storeId={storeId}
          token={authToken}
          showDeliveryPartnerModal={showDeliveryPartnerModal}
          deliveryPartners={deliveryPartners}
        />
      )}
      {updateStocksModal && (
        <UpdateStocksModal
          token={authToken}
          api={process.env.NEXT_PUBLIC_API_URL}
          showUpdateStockModal={showUpdateStockModal}
          storeId={storeId}
        />
      )}
      {editStockModal && (
        <EditStockModal
          token={authToken}
          api={process.env.NEXT_PUBLIC_API_URL}
          showEditStockModal={showEditStockModal}
          storeId={storeId}
          defaultValue={selectedStock}
        />
      )}
      {updateMenuModal && (
        <UpdateMenuModal
          token={authToken}
          api={process.env.NEXT_PUBLIC_API_URL}
          showUpdateMenuModal={showUpdateMenuModal}
          storeId={storeId}
          stocks={stocks?.data}
        />
      )}
      {editMenuModal && (
        <EditMenuModal
          api={process.env.NEXT_PUBLIC_API_URL}
          defaultValue={selectedMenu}
          showEditMenuModal={showEditMenuModal}
          storeId={storeId}
          token={authToken}
        />
      )}
      {sellsModal && (
        <SellsModal
          api={process.env.NEXT_PUBLIC_API_URL}
          showSellsModal={showSellsModal}
          menuItems={menuItems.data}
          storeId={storeId}
          token={authToken}
        />
      )}
      {deliverySellsModal && (
        <DeliverySellsModal
          api={process.env.NEXT_PUBLIC_API_URL}
          menuItems={menuItems.data}
          showDeliverySellsModal={showDeliverySellsModal}
          storeId={storeId}
          token={authToken}
          deliveryPartners={deliveryPartners.data}
        />
      )}

      <Layout title={storeName}>
        <div className='flex w-full md:justify-between md:flex-row md:items-center flex-col-reverse md:gap-0 gap-8 mb-8'>
          {currentUser.role === "admin" && (
            <div className='flex gap-2 md:justify-center flex-wrap'>
              <button
                onClick={() => showUpdateStockModal(true)}
                className='text-sm md:text-lg px-3 py-2 bg-tertiary hover:bg-tertiary/60 text-white rounded-md font-semibold'>
                Add Stocks
              </button>
              <button
                onClick={() => showUpdateMenuModal(true)}
                className='text-sm md:text-lg px-3 py-2 bg-tertiary hover:bg-tertiary/60 text-white rounded-md font-semibold'>
                Add Menu
              </button>
              <button
                onClick={() => showSellsModal(true)}
                className='text-sm md:text-lg px-3 py-2 bg-tertiary hover:bg-tertiary/60 text-white rounded-md font-semibold'>
                Restaurant Sells
              </button>
              <button
                onClick={() => showDeliverySellsModal(true)}
                className='text-sm md:text-lg px-3 py-2 bg-tertiary hover:bg-tertiary/60 text-white rounded-md font-semibold'>
                Delivery Sells
              </button>
            </div>
          )}
          {currentUser.role === "cashier" && (
            <div className='flex gap-2 md:justify-center flex-wrap'>
              <button
                onClick={() => showSellsModal(true)}
                className='text-sm md:text-lg px-3 py-2 bg-tertiary hover:bg-tertiary/60 text-white rounded-md font-semibold'>
                Restaurant Sells
              </button>
              <button
                onClick={() => showDeliverySellsModal(true)}
                className='text-sm md:text-lg px-3 py-2 bg-tertiary hover:bg-tertiary/60 text-white rounded-md font-semibold'>
                Delivery Sells
              </button>
            </div>
          )}
          {currentUser.role === "kitchenMan" && (
            <div className='flex gap-2 md:justify-center flex-wrap'>
              <button
                onClick={() => showUpdateStockModal(true)}
                className='text-sm md:text-lg px-3 py-2 bg-tertiary hover:bg-tertiary/60 text-white rounded-md font-semibold'>
                Add Stocks
              </button>
            </div>
          )}

          {currentUser.role === "admin" && (
            <div className='flex gap-2'>
              <button
                title='Delivery Partners'
                onClick={() => showDeliveryPartnerModal(true)}
                className=' text-xl text-white bg-tertiary font-semibold hover:bg-tertiary/60 p-3 flex justify-center items-center gap-2 rounded-full'>
                <MdDeliveryDining />
              </button>
              <button
                title='Edit Store Name'
                onClick={() => setEditStoreNameModal(true)}
                className=' text-xl bg-gray-200 font-semibold hover:bg-gray-300 p-3 flex justify-center items-center gap-2 rounded-full'>
                <FiEdit />
              </button>
              <button
                title='Delete Store'
                onClick={() => showDeleteModal(true)}
                className=' text-xl text-white bg-red-600 font-semibold hover:bg-red-800 p-3 flex justify-center items-center gap-2 rounded-full'>
                <FiTrash2 />
              </button>
            </div>
          )}
        </div>
        <StockTable
          stocks={stocks}
          showEditStockModal={showEditStockModal}
          setSelectedStock={setSelectedStock}
        />
        <MenuTable
          menuItems={menuItems}
          showEditMenuModal={showEditMenuModal}
          setSelectedMenu={setSelectedMenu}
        />
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const storeId = context.query.storeId;
  const authToken = context.req.cookies["authToken"];
  const authHeader = {
    "x-auth-token": authToken,
  };

  const stores = await http.get(api + "/stores", authHeader);
  const storeName = stores.data.find((store) => store._id === storeId).name;
  const stocks = await http.get(
    api + "/stores/" + storeId + "/stocks",
    authHeader
  );
  const menuItems = await http.get(
    api + "/stores/" + storeId + "/menuItems",
    authHeader
  );
  const deliveryPartners = await http.get(
    api + "/stores/" + storeId + "/deliveryPartners",
    authHeader
  );

  return {
    props: {
      storeName,
      storeId,
      authToken,
      stocks,
      menuItems,
      deliveryPartners,
    },
  };
}
