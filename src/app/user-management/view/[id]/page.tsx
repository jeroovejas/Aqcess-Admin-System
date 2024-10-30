"use client"
import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAppSelector } from "@/store/hooks";
import { showErrorToast } from "@/lib/toastUtil";
import { useParams } from 'next/navigation';
import Link from "next/link";
import Loader from "@/components/common/Loader";
import { useRouter } from 'next/navigation';
import { getSocietyAdminDetails } from "@/lib/api/userManagement";

const ViewAdmin = () => {
    const token = useAppSelector((state) => state.auth.token)
    const isTokenValid = useAppSelector((state) => state.auth.isTokenValid);
    const [verified, setVerified] = useState(false);
    const [adminData, setAdminData] = useState<any>({});
    const [residentCount, setResidentCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const { id } = useParams()
    const router = useRouter();
    useEffect(() => {
        if (isTokenValid) {
            setVerified(true);
        } else {
            router.push('/auth/login');
            setTimeout(() => {
                showErrorToast("Plz Login First");
            }, 2000);
        }
    }, [isTokenValid, router])

    useEffect(() => {
        setLoading(true);
        fetchAdminDetails().finally(() => {
            setLoading(false);
        });
    }, [id]);

    const fetchAdminDetails = async () => {
        try {
            let params = { token: token, id: id }
            const response = await getSocietyAdminDetails(params);

            // Check the success property to determine if the request was successful
            if (response.success) {
                setAdminData(response.data.data.adminDetail);
                setResidentCount(response.data.data.residentCount);
            } else {
                showErrorToast(response.data.message)
            }
        } catch (err: any) {
            console.error('Unexpected error during Admin Detail Fetch:', err.message);
        }
    }

    if (verified === null) {
        return <Loader />
    }

    return (
        <>
            {verified ? (
                <>
                    <DefaultLayout>
                        <div className="mb-6 flex flex-wrap justify-between mx-4">
                            <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                                Admin Details
                            </h2>

                            <div className="">
                                <Link
                                    href="/user-management" type="button"
                                    className="text-black border-2 border-[#DDDDDD] font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center mb-2">
                                    Back
                                </Link>
                            </div>
                        </div>
                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="container mx-auto p-4">
                                <div className="bg-white shadow-md rounded-sm p-6">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-gray-2 p-6 rounded-sm shadow-sm">
                                            <ul className="list-disc pl-5 space-y-3">
                                                <li className="text-black"><span className="text-sm text-black font-semibold">Name:</span> {adminData.firstName} {adminData.lastName}</li>
                                                <li className="text-black"><span className="text-sm text-black font-semibold">Email:</span> {adminData.email}</li>
                                                <li className="text-black"><span className="text-sm text-black font-semibold">Role:</span> {adminData.role}</li>
                                                <li className="text-black"><span className="text-sm text-black font-semibold">Residents Count:</span> {residentCount}</li>
                                                <li className="text-black"><span className="text-sm text-black font-semibold">Last Login:</span> {adminData.lastLoggedIn}</li>
                                            </ul>
                                        </div>

                                        <div className="bg-gray-2 p-6 rounded-sm shadow-sm">
                                            <ul className="list-disc pl-5 space-y-3">
                                                <li className="text-black"><span className="text-sm text-black font-semibold">Login Type:</span> {adminData.loginType}</li>
                                                <li className="text-black"><span className="text-sm text-black font-semibold">Status:</span> {adminData.status}</li>
                                                <li className="text-black"><span className="text-sm text-black font-semibold">Subscription Plan:</span> Basic</li>
                                                <li className="text-black"><span className="text-sm text-black font-semibold">Start Date:</span>16-09-2024 02:45</li>
                                                <li className="text-black"><span className="text-sm text-black font-semibold">End Date:</span> 16-09-2026 02:45</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>)}
                    </DefaultLayout>
                </>
            ) : null
            }
        </>
    );
};

export default ViewAdmin;