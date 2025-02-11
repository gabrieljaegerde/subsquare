import React, { useEffect } from "react";
import Router from "next/router";
import NProgress from "nprogress";
import { Provider } from "react-redux";
import { store } from "next-common/store";
import "nprogress/nprogress.css";
import "next-common/styles/globals.css";
import "next-common/styles/richTextStyles.scss";
import "next-common/styles/prism.min.css";
import "react-mde/lib/styles/css/react-mde-all.css";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "next-common/services/websocket";
import GlobalProvider from "next-common/context/global";

NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 800,
  showSpinner: false,
});

Router.events.on(
  "routeChangeStart",
  (url, { shallow }) => !shallow && NProgress.start()
);
Router.events.on(
  "routeChangeComplete",
  (url, { shallow }) => !shallow && NProgress.done()
);
Router.events.on(
  "routeChangeError",
  (url, { shallow }) => !shallow && NProgress.done()
);

function MyApp({ Component, pageProps }) {
  if (!process.env.NEXT_PUBLIC_CHAIN) {
    throw new Error(`NEXT_PUBLIC_CHAIN env not set`);
  }

  useEffect(() => {
    connect();
  }, []);

  const {
    loginUser,
    homeFoldedMenus,
    themeMode,
    pageProperties,
    ...otherProps
  } = pageProps;
  return (
    <Provider store={store}>
      <GlobalProvider
        user={loginUser}
        chain={process.env.NEXT_PUBLIC_CHAIN}
        homeFoldedMenus={homeFoldedMenus}
        themeMode={themeMode}
        pageProperties={pageProperties}
      >
        <Component {...otherProps} />
      </GlobalProvider>
    </Provider>
  );
}

export default MyApp;
