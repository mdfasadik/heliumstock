import Layout from "../components/layout";
import { useContext, useEffect, useState } from "react";
import { Store } from "../utils/store";
import { useRouter } from "next/router";
import http from "../services/httpService";
import auth from "../services/authService";
import Cookies from "js-cookie";

export default function Home({ response }) {
  const storeState = useContext(Store);
  const [stores, setStores] = useState();
  const router = useRouter();

  useEffect(() => {
    if (!storeState.authToken) {
      router.replace("/login");
    }
    setStores(response);
  }, []);
  console.log(stores);
  return (
    <Layout title='Stores'>
      <div>hello world</div>
    </Layout>
  );
}
export async function getServerSideProps(context) {
  const getStores = async () => {
    const response = await fetch("http://localhost:5000/api/stores", {
      method: "GET",
      headers: {
        headers: {
          /* prettier-ignore */
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json",
          "x-auth-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjRkNTgzM2ZlMTA2OTU3OTNiOTgwOGMiLCJlbWFpbCI6InBhcnZlejEyQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoiUGFydmV6Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjQ5NDE1NDYwfQ.Ck8i_0-AByGA4Eqm5cE8-pr5y0sxd-BMzC8xTYJucIE",
        },
      },
    });
    const data = await response.json();
    return data;
  };
  return {
    props: {
      stores: await getStores(),
    }, // will be passed to the page component as props
  };
}
