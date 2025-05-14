"use client";
import { useEffect } from "react";
import { clearToken, setPackageId, setSubscriptionData, setUserData } from "@/store/Slices/AuthSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from '@/navigation';
import { subscriptionCronJob } from "@/lib/api/subscription";
import { showErrorToast } from "@/lib/toastUtil";

// const AUTO_SIGNOUT_TIME = 20 * 60 * 1000; // 2 minutes in milliseconds For Test Purpose
const AUTO_SIGNOUT_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const ClientSessionCheck = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token)
  const subscriptionData = useAppSelector((state) => state.auth.subscriptionData);
  const packageId = useAppSelector((state) => state.auth.packageId)


  useEffect(() => {
    const handleSessionCheck = () => {
      const loginTime = localStorage.getItem("loginTime");
      const now = new Date();
      const endDate = new Date(subscriptionData.endDate);
      console.log("token", token)
      console.log("===== Subscription Data ======")
      console.log(subscriptionData)

      if (loginTime && Date.now() - parseInt(loginTime, 10) > AUTO_SIGNOUT_TIME) {
        handleSignOut();
      }

      if (token && packageId !== 1 && endDate < now && subscriptionData.autoPayment == false && subscriptionData.status == 'active') {
        console.log("Date is gone")
        cronJob().finally(() => {
          console.log("hello cron Job")
        });
      }
    };

    const cronJob = async () => {
console.log("==== Cron Job Run");
console.log(subscriptionData.subscriptionId);

      try {
        let params = { token: token, sub_id: subscriptionData.subscriptionId }
        const response = await subscriptionCronJob(params);
        if (response.success) {
          dispatch(setUserData(response.data.data))
          if (response.data.data.subscription) {
            const subscriptionData = {
              userId: response.data.data.subscription?.userId,
              subscriptionId: response.data.data.subscription?.stripeSubscription,
              autoPayment: response.data.data.subscription?.autoPayment,
              packageId: response.data.data.subscription?.packageId,
              status: response.data.data.subscription?.status,
              startDate: response.data.data.subscription?.startDate,
              endDate: response.data.data.subscription?.endDate,
            }
            dispatch(setSubscriptionData(subscriptionData))
            dispatch(setPackageId(response.data.data.subscription.packageId))
          }
        } else {
          showErrorToast(response.data.message)
        }
      } catch (err: any) {
        console.error('Unexpected error during incomes Fetch:', err.message);
      }
    }

    const handleSignOut = async () => {
      // await signOut({ callbackUrl: "/auth/login" });
      setTimeout(() => {
        dispatch(clearToken());
      }, 2000);
      localStorage.removeItem("loginTime");
      router.push("/auth/login");
    };

    // Run session check on load
    handleSessionCheck();

    const interval = setInterval(handleSessionCheck, 60000);
    return () => clearInterval(interval);
  }, [router]);




  return null;
};

export default ClientSessionCheck;
