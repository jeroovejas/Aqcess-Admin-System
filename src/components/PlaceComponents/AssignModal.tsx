"use client";
import { useRef, useEffect, useState } from "react";
import { IoDuplicate } from "react-icons/io5";
import { toggleAssignModal } from "@/store/Slices/PlaceSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { showErrorToast, showSuccessToast } from "@/lib/toastUtil";
import { assignPlace } from "@/lib/api/place";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Select from 'react-select';
import { getAllSocietyAdminsIdAndName } from "@/lib/api/userManagement";
import { useTranslations } from 'next-intl';

const AssignModal: React.FC<any> = () => {
    const t = useTranslations();
    const [loading, setLoading] = useState<boolean>(false);
    const assignModal = useAppSelector((state) => state.place.assignModal);
    const placeData = useAppSelector((state) => state.place.placeData);
    const token = useAppSelector((state) => state.auth.token);
    const [admins, setAdmins] = useState<any[]>([]);
    const dispatch = useAppDispatch();

    const stateOptions = admins.length > 0
        ? admins.map((admin: any) => ({
            value: admin.id,
            label: admin.firstName + ' ' + admin.lastName,
        }))
        : [];

    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

    useEffect(() => {
        if (placeData?.assignPlace?.length > 0) {
            const assignedUsers = placeData.assignPlace.map((assignedUser: any) => ({
                value: assignedUser.userId,
                label: assignedUser.name,
            }));
            setSelectedUsers(assignedUsers);
        }
    }, [placeData?.assignPlace]);

    const handleUserChange = (selectedStateOptions: any) => {
        setSelectedUsers(selectedStateOptions);
    };

    // Handle assign action
    const handleAssign = async () => {
        setLoading(true);
        try {
            const userIdsString = selectedUsers.map((user: any) => user.value).join(',');
            const body = {
                place_id: placeData.id,
                user_ids: userIdsString,
                token: token,
            };
            const response = await assignPlace(body);
            if (response.success) {
                dispatch(toggleAssignModal());
                showSuccessToast(response.data.message);
            } else {
                showErrorToast(response.data.message);
            }
        } catch (err: any) {
            console.error('Unexpected error during assign place:', err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRSocietyAdmins();
    }, [])


    const fetchRSocietyAdmins = async () => {
        try {
            let params = { token: token }
            const response = await getAllSocietyAdminsIdAndName(params);
            if (response.success) {
                console.log(response);
                setAdmins(response.data.data);
            } else {
                showErrorToast(response.data.message)
            }
        } catch (err: any) {
            console.error('Unexpected error during Society Admins Fetch:', err.message);
        }
    }

    return (
        <>
            {assignModal ? (
                <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-auto my-6 max-w-3xl">
                        <div className="border-0 rounded-lg shadow-lg relative text-black w-full bg-white outline-none focus:outline-none px-8 py-8">
                            <IoDuplicate size={30} className="mb-6" />
                            <h3 className="text-3xl font-semibold mt-8">{t('PLACE.assignModal.title')}</h3>

                            <div className="my-5">
                                <Select
                                    id="state-select"
                                    options={stateOptions}
                                    value={selectedUsers}
                                    onChange={handleUserChange}
                                    placeholder="Select Users"
                                    className="bg-gray-50 border border-gray-900 text-gray-900 text-sm rounded-md outline-none block w-full"
                                    classNamePrefix="react-select"
                                    isClearable
                                    isMulti // This enables multiple selection
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            boxShadow: 'none',
                                            border: 'none',
                                            padding: 0,
                                        }),
                                    }}
                                />
                            </div>

                            <div className="flex gap-3 items-center">
                                <button
                                    className="text-red-500 border rounded-lg border-[#DDDDDD] w-1/2 background-transparent font-bold px-6 py-3 text-sm outline-none mr-1 mb-1"
                                    type="button"
                                    onClick={() => dispatch(toggleAssignModal())}
                                >
                                    {t('PLACE.assignModal.button1')}
                                </button>
                                <button
                                    className={`text-white w-1/2 flex items-center justify-center cursor-pointer rounded-lg bg-primary-blue font-bold text-sm px-6 py-3 outline-none mr-1 mb-1`}
                                    type="button"
                                    disabled={loading}
                                    onClick={handleAssign}
                                >
                                    {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : `${t('PLACE.assignModal.button2')}`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default AssignModal;
