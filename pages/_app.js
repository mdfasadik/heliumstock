import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import Router from "next/router";
import { ToastContainer } from "react-toastify";

import { StoreProvider } from "../utils/store";
import Loading from "../components/loading";

function MyApp({ Component, pageProps }) {
  const [isSSR, setIsSSR] = useState(true);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setIsSSR(false);
  }, []);

  Router.events.on("routeChangeStart", (url) => {
    setLoading(true);
  });
  Router.events.on("routeChangeComplete", (url) => {
    setLoading(false);
  });

  return (
    !isSSR && (
      <>
        {loading && <Loading />}
        <ToastContainer autoClose={3000} />
        <StoreProvider>
          <Component {...pageProps} />
        </StoreProvider>
      </>
    )
  );
}

export default MyApp;
