'use client'
import { Link } from '@/navigation';
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { useDispatch } from 'react-redux';
import ViewModal from '@/components/PaymentComponents/ViewModal';
import { setPaymentData, toggleViewModal } from '@/store/Slices/PaymentSlice';
import { useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';

const Payment = ({ paymentData = [] }: { paymentData: any[] }) => {
  const t = useTranslations();
  const dispatch = useDispatch();
    const viewModal = useAppSelector((state) => state.payment.viewModal)

  const handleViewPayment = (payment: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    dispatch(setPaymentData(payment));
    dispatch(toggleViewModal());
  };

    useEffect(() => {
      if (viewModal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, [viewModal]);

  return (
    <div className="col-span-12 rounded-2xl border border-[#DDDDDD] bg-white pt-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-4 px-7.5 text-xl font-semibold text-black dark:text-white">
        {t('DASHBOARD.titlePayment.title')}
      </h4>
      <div className="flex bg-[#EDEEEF] border-y border-[#DDDDDD] justify-between px-5 py-3">
        <p className="text-[12px] font-[600]">{t('DASHBOARD.titlePayment.resident')}</p>
        <p className="text-[12px] font-[600]">{t('DASHBOARD.titlePayment.amount')}</p>
      </div>

      <div>
        {paymentData.length > 0 ? (
          paymentData.map((payment, key) => (
            <button
              key={key}
              onClick={() => handleViewPayment(payment)}
              className="flex w-full border-t border-[#DDDDDD] items-center gap-5 px-4 py-3 hover:bg-gray-3 dark:hover:bg-meta-4 text-left"
            >
              <div className="relative h-[35px] w-[35px] rounded-full">
                <Image
                  width={32}
                  height={32}
                  src={payment.profileImage || "/images/user/dummy.png"}
                  alt="User"
                  className="w-full h-full"
                />
              </div>

              <div className="flex flex-1 items-center justify-between">
                <h5 className="font-medium text-black dark:text-white">
                  {payment.residentName || "N/A"}
                </h5>
                <span className="text-sm font-medium">
                  ${payment.amount || "0.00"}
                </span>
              </div>
            </button>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No recent payments</p>
        )}
      </div>

      <div className='py-4 text-center'>
        <Link href="/payment/payment-history" className="px-12 py-2 rounded-lg font-semibold bg-blue-600 text-white">
          View All
        </Link>
      </div>

      <ViewModal />
    </div>
  );
};

export default Payment;
