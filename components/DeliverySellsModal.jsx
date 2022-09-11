import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { BsPlusLg } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import _ from "lodash";

import http from "../services/httpService";

export default function DeliverySellsModal({
  showDeliverySellsModal,
  token,
  api,
  storeId,
  menuItems,
  deliveryPartners,
}) {
  const [isLoading, setLoading] = useState(false);
  const [addedMenuItems, setAddedMenuItems] = useState([]);
  const [partnerId, setPartnerId] = useState("");

  const itemsRef = useRef(null);
  const quantityRef = useRef(null);

  const router = useRouter();

  const handleMenuItemSelect = () => {
    const exisitingItem = addedMenuItems.find(
      (i) => i.item === itemsRef.current.value
    );
    if (exisitingItem)
      return toast.warn(`${exisitingItem.name} is already added`);

    const items = {};
    items.item = itemsRef.current.value;
    items.name = menuItems.find(
      (mi) => mi._id === itemsRef.current.value
    )?.name;
    items.quantity = quantityRef.current.value;

    const itemsList = [...addedMenuItems];
    itemsList.push(items);
    setAddedMenuItems(itemsList);
  };

  const handleItemDelete = (item) => {
    setAddedMenuItems(addedMenuItems.filter((i) => i.item !== item.item));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      sells: {
        items: [...addedMenuItems],
        totalSell: 0,
        totalProfit: 0,
      },
    };
    setLoading(true);
    const response = await http.put(
      api + "/stores/" + storeId + "/deliverySells/" + partnerId,
      payload,
      {
        "x-auth-token": token,
      }
    );
    setLoading(false);
    if (response.data) {
      showDeliverySellsModal(false);
      toast.success(response.message);
      setTimeout(() => {
        router.reload();
      }, 500);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <div className='w-screen h-screen flex justify-center items-start fixed bg-black/50 z-20 p-4 md:p-2 overflow-y-auto'>
      <form
        className='lg:w-2/3 w-full flex flex-col gap-4 bg-white p-10 rounded-xl'
        onSubmit={(e) => onSubmit(e)}>
        <div className='rounded-md shadow-sm -space-y-px flex flex-col gap-4 '>
          <div className='flex flex-col gap-2 w-full'>
            <label htmlFor='items' className='text-lg font-semibold'>
              Select Delivery Partner
            </label>
            <select
              onChange={(e) => setPartnerId(e.target.value)}
              ref={itemsRef}
              id='items'
              required
              className='accent-tertiary rounded-md  border-gray-300 w-full'>
              <option>Select Item</option>
              {_.orderBy(deliveryPartners, "name", "asc").map((item) => {
                return (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className='flex gap-2 flex-wrap items-end lg:flex-nowrap'>
            {/* Ingredients dropdown */}
            <div className='flex flex-col gap-2 w-full'>
              <label htmlFor='items' className='text-lg font-semibold'>
                Items
              </label>
              <select
                ref={itemsRef}
                id='items'
                required
                className='accent-tertiary rounded-md  border-gray-300 w-full'>
                <option>Select Item</option>
                {_.orderBy(menuItems, "name", "asc").map((item) => {
                  return (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className='flex flex-col gap-2 w-full'>
              <label
                htmlFor='fromKitchen'
                className='text-lg font-semibold w-full'>
                Quantity
              </label>
              <input
                type='number'
                id='fromKitchen'
                ref={quantityRef}
                defaultValue={0}
                required
                step={0.1}
                className='rounded-md border-gray-300'
              />
            </div>
            <div
              onClick={handleMenuItemSelect}
              className='cursor-pointer hover:bg-tertiary/60 flex  py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary items-center gap-2'>
              <span className='inline'>
                <BsPlusLg />
              </span>
              Add
            </div>
          </div>

          <div className='flex flex-col gap-2 w-full'>
            {addedMenuItems?.map((item) => (
              <div
                key={item.item}
                className='bg-gray-200 w-full px-4 py-2 rounded-md font-semibold text-lg flex justify-between items-center'>
                <div>
                  {item.name} {`(${item.quantity})`}{" "}
                </div>
                <div
                  onClick={() => handleItemDelete(item)}
                  className='cursor-pointer p-2 text-xl text-white bg-red-600 hover:bg-red-700 rounded-md'>
                  <RiDeleteBin6Line />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='flex justify-between'>
          <div className='flex gap-2'>
            <button
              type='submit'
              disabled={isLoading && true}
              className='group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-tertiary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary'>
              {isLoading ? "Sending..." : "Send"}
            </button>
            <div
              onClick={() => showDeliverySellsModal(false)}
              className='group relative cursor-pointer flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary'>
              Cancel
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
