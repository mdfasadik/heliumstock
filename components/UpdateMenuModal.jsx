import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { toast } from "react-toastify";
import { BsPlusLg } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import _ from "lodash";

import http from "../services/httpService";

const shcema = Joi.object({
  name: Joi.string().min(3).max(50).required().label("Store Name"),
  sellingPrice: Joi.number().min(0).required().label("Selling Price"),
  additionalCost: Joi.number().min(0).label("Additional Cost"),
  manuallyAddedMainCost: Joi.boolean().label("Manually added main cost"),
  mainCost: Joi.number().min(0).label("Main Cost"),
});

export default function UpdateMenuModal({
  showUpdateMenuModal,
  token,
  api,
  storeId,
  stocks,
}) {
  const [isLoading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const ingredientRef = useRef(null);
  const quantityRef = useRef(null);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: joiResolver(shcema),
  });

  const manuallyAddedMainCost = watch("manuallyAddedMainCost");

  const handleIngredinets = () => {
    const exisitngIng = ingredients.find(
      (i) => i.ingredient === ingredientRef.current.value
    );
    if (exisitngIng) return toast.warn(`${exisitngIng.name} is already added`);

    const ing = {};
    ing.ingredient = ingredientRef.current.value;
    ing.amount = quantityRef.current.value;
    ing.name = stocks.find(
      (stock) => stock._id === ingredientRef.current.value
    ).name;
    ing.rate = stocks.find(
      (stock) => stock._id === ingredientRef.current.value
    ).rate;
    const ingredientList = [...ingredients];
    ingredientList.push(ing);
    setIngredients(ingredientList);
  };

  const handleIngredinetDelete = (ing) => {
    setIngredients(ingredients.filter((i) => i.ingredient !== ing.ingredient));
  };

  const onSubmit = async (data) => {
    const payload = { menuItem: { ...data, ingredients } };
    setLoading(true);
    const response = await http.put(
      api + "/stores/" + storeId + "/menuItems/",
      payload,
      {
        "x-auth-token": token,
      }
    );
    setLoading(false);
    if (response.data) {
      showUpdateMenuModal(false);
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
        className='lg:w-1/2 w-full flex flex-col gap-4 bg-white p-10 rounded-xl'
        onSubmit={handleSubmit(onSubmit)}>
        <div className='rounded-md shadow-sm -space-y-px flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <h1 className='font-semibold text-xl'>Item Name</h1>
            <input
              {...register("name")}
              type='text'
              required
              className='appearance-none font-medium rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:border-4 focus:outline-none focus:ring-tertiary focus:border-tertiring-tertiary sm:text-sm'
              placeholder='Ingredient'
            />
            {errors.name && (
              <div className='rounded-md shadow-sm w-full py-2 text-red-500'>
                {errors.name.message}
              </div>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <h1 className='font-semibold text-xl'>Selling Price</h1>
            <input
              {...register("sellingPrice")}
              type='number'
              defaultValue={0}
              step={0.01}
              min={0}
              required
              className='appearance-none font-medium rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:border-4 focus:outline-none focus:ring-tertiary focus:border-tertiring-tertiary sm:text-sm'
              placeholder='Selling price'
            />
            {errors.sellingPrice && (
              <div className='rounded-md shadow-sm w-full py-2 text-red-500'>
                {errors.sellingPrice.message}
              </div>
            )}
          </div>
          {!manuallyAddedMainCost && (
            <div className='flex flex-col gap-2'>
              <h1 className='font-semibold text-xl'>Additional Cost</h1>
              <input
                {...register("additionalCost")}
                type='number'
                defaultValue={0}
                step={0.01}
                min={0}
                required
                className='appearance-none font-medium rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:border-4 focus:outline-none focus:ring-tertiary focus:border-tertiring-tertiary sm:text-sm'
                placeholder='Additional cost'
              />
              {errors.additionalCost && (
                <div className='rounded-md shadow-sm w-full py-2 text-red-500'>
                  {errors.additionalCost.message}
                </div>
              )}
            </div>
          )}
          <div className='flex items-center gap-2'>
            <h1 className='font-semibold '>Add main cost manually</h1>
            <input
              {...register("manuallyAddedMainCost")}
              className='rounded accent-tertiary'
              type='checkbox'
            />
          </div>
          {manuallyAddedMainCost && (
            <div className='flex flex-col gap-2'>
              <h1 className='font-semibold text-xl'>Main Cost</h1>
              <input
                {...register("mainCost")}
                type='number'
                defaultValue={0}
                step={0.01}
                min={0}
                required
                className='appearance-none font-medium rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 focus:border-4 focus:outline-none focus:ring-tertiary focus:border-tertiring-tertiary sm:text-sm'
                placeholder='Additional cost'
              />
              {errors.mainCost && (
                <div className='rounded-md shadow-sm w-full py-2 text-red-500'>
                  {errors.mainCost.message}
                </div>
              )}
            </div>
          )}
          {/* Ingredients dropdown */}
          <div className='flex flex-col gap-2'>
            <h1 htmlFor='ingredients' className='font-semibold text-xl'>
              Ingredients (kg)
            </h1>
            <div className='flex gap-2 flex-wrap md:flex-nowrap'>
              <select
                ref={ingredientRef}
                id='ingredients'
                required
                className='accent-tertiary rounded-md  border-gray-300 w-full'>
                <option>Select Ingredient</option>
                {_.orderBy(stocks, "name", "asc").map((stock) => (
                  <option value={stock._id} key={stock._id}>
                    {stock.name}
                  </option>
                ))}
              </select>
              <input
                type='number'
                ref={quantityRef}
                defaultValue={0}
                required
                step={0.00001}
                className='rounded-md border-gray-300'
              />
              <div
                onClick={handleIngredinets}
                className='group relative cursor-pointer hover:bg-tertiary/60 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary items-center gap-2'>
                <span className='inline'>
                  <BsPlusLg />
                </span>
                Add
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-2 w-full'>
            {ingredients?.map((ing) => (
              <div
                key={ing.ingredient}
                className='bg-gray-200 w-full px-4 py-2 rounded-md font-semibold text-lg flex justify-between items-center'>
                <div>
                  {ing.name} {` (${ing.amount}) - Rate : ${ing.rate}`}
                </div>
                <div
                  onClick={() => handleIngredinetDelete(ing)}
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
              {isLoading ? "Creating..." : "Create Menu"}
            </button>
            <div
              onClick={() => showUpdateMenuModal(false)}
              className='group relative cursor-pointer flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary'>
              Cancel
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
