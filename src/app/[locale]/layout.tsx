// // "use client";
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
// import { NextIntlClientProvider } from 'next-intl';
// import { getMessages } from 'next-intl/server';
// import { notFound } from 'next/navigation';
// import { routing } from '@/i18n/routing'

// export default async function RootLayout({
//   children,
//   params: { locale }
// }: Readonly<{
//   children: React.ReactNode;
//   params: { locale: string };
// }>) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [loading, setLoading] = useState<boolean>(true);

//   // const pathname = usePathname();

//   useEffect(() => {
//     setTimeout(() => setLoading(false), 1000);
//   }, []);

//   // useEffect(() => {
//   //   if (typeof window !== 'undefined') {
//   //     setTimeout(() => setLoading(false), 1000);
//   //   }
//   // }, []);
//   if (!routing.locales.includes(locale as any)) {
//     notFound();
//   }
//   const messages = await getMessages();
//   return (
//     <html lang={locale}>
//       <Provider store={store}>
//         <body suppressHydrationWarning={true}>
//           <PersistGate loading={null} persistor={persistor}>
//             <div className="dark:bg-boxdark-2 dark:text-bodydark">
//               <NextIntlClientProvider messages={messages}>
//                 {loading ? <Loader /> : children}
//               </NextIntlClientProvider>
//             </div>
//             <ToastContainer />
//           </PersistGate>
//         </body>
//       </Provider>
//     </html>
//   );
// }



// RootLayout.js
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import ClientWrapper from "./clientWarpper";
import { routing } from '@/i18n/routing'
import ClientSessionCheck from "./clientSessionCheck";


export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html lang={locale}>
      {/* <body> */}
      <NextIntlClientProvider messages={messages}>
        <ClientWrapper>
          <ClientSessionCheck />
          {children}
        </ClientWrapper>
      </NextIntlClientProvider>
      {/* </body> */}
    </html>
  );
}
