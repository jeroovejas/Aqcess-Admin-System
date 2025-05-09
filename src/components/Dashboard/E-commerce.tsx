"use client";
import React, { useState, useEffect } from "react";
import ChartOne from "./DashboardComponents/ChartOne";
import Payment from "./DashboardComponents/payment";
import Survey from "./DashboardComponents/survey";
import CardDataStats from "../CardDataStats";
import { DateRangePickerElement } from "../DataPicker/index";
import DefaultLayout from "../Layouts/DefaultLayout";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
// import { useRouter } from 'next/navigation';
import { Link, usePathname, useRouter } from '@/navigation';
import { setUserData, setPackageId, toggleIsTokenValid, clearToken, clearUser, setSubscriptionData } from "@/store/Slices/AuthSlice";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { verifyToken } from "@/lib/api/auth";
import Loader from "@/components/common/Loader";
import { getDashboardChartPayment, getDashboardData } from "@/lib/api/dashboard";
import { useLocale, useTranslations } from 'next-intl';
import LanguageDropdown from "../language/language";

const ECommerce: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const t = useTranslations();

  const token = useAppSelector((state) => state.auth.token);
  const isTokenValid = useAppSelector((state) => state.auth.isTokenValid);
  const user = useAppSelector((state) => state.auth.userData);
  const packageId = useAppSelector((state) => state.auth.packageId);
  const [verified, setVerified] = useState<boolean | null>(false);
  const [loading, setLoading] = useState<boolean | null>(false);
  const [residentCount, setResidentCount] = useState<any>(0);
  const [activeSurveyCount, setActiveSurveyCount] = useState<any>(0);
  const [totalPayments, setTotalPayments] = useState<any>(0);
  const [pendingPayments, setPendingPayments] = useState<any>(0);
  const [survey, setSurvey] = useState<any>([]);
  const [currentDate, setCurrentDate] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  useEffect(() => {
    const checkUser = async () => {
      console.log(token);

      const response = await verifyToken({ token: token });
      if (response.success) {
        if (response.data.data.role === 3) {
          router.push('/auth/login');
          setTimeout(() => {
            showErrorToast("Permission denied!");
          }, 2000);

        } else {
          setVerified(true);
          dispatch(setUserData(response.data.data))
          if (!isTokenValid) {
            dispatch(toggleIsTokenValid())
            showSuccessToast(`Welcome  ${response.data.data.firstName} ${response.data.data.lastName}`)
          }
        }
      } else {
        router.push('/auth/login');
        if (isTokenValid) {
          dispatch(toggleIsTokenValid())
        }
        dispatch(clearToken())
        dispatch(clearUser())
      }
    };
    checkUser()
  }, [token, router, dispatch])

  useEffect(() => {
    const date = new Date();
    const optionsDate: any = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString(undefined, optionsDate);
    setCurrentDate(formattedDate);

    const optionsDay: any = { weekday: 'long' };
    const formattedDay = date.toLocaleDateString(undefined, optionsDay);
    setCurrentDay(formattedDay);
  }, []);

  useEffect(() => {
    if (verified) {
      setLoading(true);
      fetchDashboardData().finally(() => {
        setLoading(false);
      });
    }
  }, [verified, toDate, fromDate, router])

  const fetchDashboardData = async () => {
    try {

      let params = {
        token: token,
        toDate: toDate,
        fromDate: fromDate
      }
      const response = await getDashboardData(params);
      console.log(response)

      // Check the success property to determine if the request was successful
      if (response.success) {
        setResidentCount(response.data.data.residentCount);
        setActiveSurveyCount(response.data.data.activeSurveyCount)
        setSurvey(response.data.data.survey)
        setTotalPayments(response.data.data.totalPayments)
        setPendingPayments(response.data.data.pendingPayments)
      } else {
        showErrorToast(response.data.message)
      }
    } catch (err: any) {
      console.error('Unexpected error during Dashboard data Fetch:', err.message);
    }
  }

  if (verified === null || loading === true) {
    return <Loader />
  }

  // console.log("toDate",toDate)
  // console.log("fromDate",fromDate)
  return (
    <>
      {(verified && !loading) ? (
        <>
          <DefaultLayout>
            <div className="flex justify-between items-center flex-wrap my-4">
              <div className="my-4 px-3">
                <h1 className="text-black text-3xl font-bold">{t('DASHBOARD.title')}, {user.firstName} {user.lastName}</h1>
                <p className="text-black">{currentDay}, {currentDate}</p>
              </div>
              <div className="text-black flex gap-2">
                <LanguageDropdown />
                <DateRangePickerElement setFromDate={setFromDate} setToDate={setToDate} />
                {/* <p>{fromDate} and{toDate} </p> */}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
              {packageId == 2 &&
                <>
                  <CardDataStats title={t('DASHBOARD.card1')} total={`$${totalPayments}`} rate="40%" levelUp>
                  </CardDataStats>
                </>
              }
              <CardDataStats title={t('DASHBOARD.card3')} total={`${residentCount}`} rate="40%" levelUp>
              </CardDataStats>
              {packageId == 2 &&
                <>
                  <CardDataStats title={t('DASHBOARD.card4')} total={`${activeSurveyCount}`} rate="40%" levelUp>
                  </CardDataStats>
                  <CardDataStats title={t('DASHBOARD.card2')} total={`${pendingPayments}%`} rate="40%" levelUp>
                  </CardDataStats>
                </>
              }
            </div>

            {packageId == 2 && <ChartOne token={token} />}
            {/* <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
              <div className="col-span-12 md:col-span-8">
            <ChartOne />
              </div>
              <div className="col-span-12 md:col-span-4">
                <Payment />
              </div>
            </div> */}


            {packageId == 2 && <div className="w-full my-6"><Survey surveyData={survey} /></div>}
          </DefaultLayout>
        </>
      ) : null}
    </>
  );
};

export default ECommerce;
