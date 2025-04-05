"use client";
import { useEffect } from "react";
import { clearToken } from "@/store/Slices/AuthSlice";
import { useAppDispatch } from "@/store/hooks";
import { useRouter } from '@/navigation';

// const AUTO_SIGNOUT_TIME = 1 * 60 * 1000; // 2 minutes in milliseconds For Test Purpose
const AUTO_SIGNOUT_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds


const ClientSessionCheck = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleSessionCheck = () => {
      const loginTime = localStorage.getItem("loginTime");
      if (loginTime && Date.now() - parseInt(loginTime, 10) > AUTO_SIGNOUT_TIME) {
        handleSignOut();
      }
    };

    const handleSignOut = async () => {
      // await signOut({ callbackUrl: "/auth/login" });
      setTimeout(() => {
        dispatch(clearToken())
      }, 2000)
      localStorage.removeItem("loginTime");
      router.push("/auth/login");
    };

    // Run session check on load
    handleSessionCheck();

    const interval = setInterval(handleSessionCheck, 60000); // Check every 1 minute
    return () => clearInterval(interval);
  }, [router]);

  return null;
};

export default ClientSessionCheck;
