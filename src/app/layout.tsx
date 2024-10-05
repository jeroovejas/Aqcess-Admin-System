"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import "@/css/custom.css"
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { Provider } from "react-redux";
import { store, persistor } from "@/store/store";
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     setTimeout(() => setLoading(false), 1000);
  //   }
  // }, []);

  return (
    <html lang="en">

      <Provider store={store}>
        <body suppressHydrationWarning={true}>
          <PersistGate loading={null} persistor={persistor}>
            <div className="dark:bg-boxdark-2 dark:text-bodydark">
              {loading ? <Loader /> : children}
            </div>
            <ToastContainer />
          </PersistGate>
        </body>
      </Provider>
    </html>
  );
}
