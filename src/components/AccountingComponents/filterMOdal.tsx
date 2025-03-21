import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { getAllResidentsArray } from "@/lib/api/resident";
import { getAllProductsArr } from "@/lib/api/product";

const months = [
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "August", label: "August" },
    { value: "September", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
];

const currentYear = new Date().getFullYear();
const years = [
    { value: currentYear, label: currentYear.toString() },
    { value: currentYear + 1, label: (currentYear + 1).toString() },
    { value: currentYear + 2, label: (currentYear + 2).toString() },
];

const statuses = [
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "pending", label: "Pending" },
];

const SearchFilterModal = ({ isOpen, onClose, onFiltersSubmit }: { isOpen: boolean; onClose: () => void, onFiltersSubmit: (filters: any) => void }) => {
    const token = useAppSelector((state) => state.auth.token);
    const user = useAppSelector((state) => state.auth.userData);

    const [residents, setResidents] = useState<any>([]);
    const [products, setProducts] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState<any>({
        residentId: null,
        propertyNo: "",
        productId: null,
        month: null,
        year: null,
        status: null,
        fromDate: "",
        toDate: ""
    });

    // Handle Input Change
    const handleChange = (field: string, value: any) => {
        setFilters((prev: any) => ({ ...prev, [field]: value }));
    };

    // Handle Form Submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFiltersSubmit({
            resident: filters.resident ? filters.resident.value : null,
            propertyNo: filters.propertyNo,
            product: filters.product ? filters.product.value : null,
            month: filters.month ? filters.month.value : null,
            year: filters.year ? filters.year.value : null,
            status: filters.status ? filters.status.value : null,
            fromDate: filters.fromDate || "",
            toDate: filters.toDate || ""
        });
        onClose(); // Close modal after submitting
    };

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [isOpen]);

    // Reset Filters
    const handleReset = () => {
        setFilters({
            resident: null,
            propertyNo: "",
            product: null,
            month: null,
            year: null,
            status: null,
            fromDate: "",
            toDate: ""
        });
    };


    // Fetch Residents
    const fetchResidents = async () => {
        setLoading(true);
        try {
            const params = { token, id: user.id };
            const response = await getAllResidentsArray(params);
            if (response.success) {
                const transformedData = response.data.data.map((item: any) => ({
                    label: `${item.name} - ${item.propertyNumber}`,
                    value: item.id,
                }));
                setResidents(transformedData);
            } else {
                console.error("Error fetching residents:", response.data.message);
            }
        } catch (err: any) {
            console.error("Unexpected error during residents fetch:", err.message);
        }
        setLoading(false);
    };

    // Fetch All Products
    const fetchAllProducts = async () => {
        setLoading(true);
        try {
            let params = { token }
            const response = await getAllProductsArr(params);
            if (response.success) {
                const transformedData = response.data.data.map((item: any) => ({
                    label: item.title,
                    value: item.id,
                }));
                setProducts(transformedData);
            } else {
                console.error("Error fetching products:", response.data.message);
            }
        } catch (err: any) {
            console.error("Unexpected error during product fetch:", err.message);
        }
        setLoading(false);
    };

    // Fetch residents and products on component mount
    useEffect(() => {
        fetchResidents();
        fetchAllProducts();
    }, []);

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Background Blur */}
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 z-50 h-[500px] overflow-y-auto">
                {/* Close Button */}
                <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-900" onClick={onClose}>
                    <X size={24} />
                </button>

                <Dialog.Title className="text-lg font-semibold text-gray-800">Search Filters</Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    {/* From To Date Select*/}
                    <div className="w-full flex gap-2 justify-between">
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700">From Date</label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded-lg"
                                value={filters.fromDate}
                                onChange={(e) => handleChange("fromDate", e.target.value)}
                            />
                        </div>
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700">To Date</label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded-lg"
                                value={filters.toDate}
                                onChange={(e) => handleChange("toDate", e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Month & Year (Same Row) */}
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">Month</label>
                            <Select
                                options={months}
                                value={filters.month}
                                onChange={(selected) => handleChange("month", selected)}
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium text-gray-700">Year</label>
                            <Select
                                options={years}
                                value={filters.year}
                                onChange={(selected) => handleChange("year", selected)}
                            />
                        </div>
                    </div>

                    {/* Resident Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Resident</label>
                        <Select
                            options={residents}
                            value={filters.resident}
                            onChange={(selected) => handleChange("resident", selected)}
                            isLoading={loading}
                        />
                    </div>

                    {/* Property No (Text Field) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Property No</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-lg"
                            placeholder="Enter Property No"
                            value={filters.propertyNo}
                            onChange={(e) => handleChange("propertyNo", e.target.value)}
                        />
                    </div>

                    {/* Product Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product</label>
                        <Select
                            options={products}
                            value={filters.product}
                            onChange={(selected) => handleChange("product", selected)}
                            isLoading={loading}
                        />
                    </div>

                    {/* Status Dropdown */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <Select
                            options={statuses}
                            value={filters.status}
                            onChange={(selected) => handleChange("status", selected)}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex justify-end gap-2">
                        <button type="button" className="px-4 py-2 bg-gray-200 text-black rounded-lg" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="button" className="px-4 py-2 text-black border border-black rounded-lg" onClick={handleReset}>
                            Reset
                        </button>
                        <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg">
                            Apply Filters
                        </button>
                    </div>
                </form>
            </div>
        </Dialog>
    );
};

export default SearchFilterModal;


// import React, { useEffect, useState } from "react";
// import Select from "react-select";
// import { Dialog } from "@headlessui/react";
// import { X } from "lucide-react";
// import { useAppSelector } from "@/store/hooks";
// import { getAllResidentsArray } from "@/lib/api/resident";
// import { getAllProductsArr } from "@/lib/api/product";

// const months = [...Array(12)].map((_, i) => ({
//     value: new Date(0, i).toLocaleString("default", { month: "long" }),
//     label: new Date(0, i).toLocaleString("default", { month: "long" })
// }));

// const currentYear = new Date().getFullYear();
// const years = [...Array(3)].map((_, i) => ({
//     value: currentYear + i,
//     label: (currentYear + i).toString()
// }));

// const statuses = ["Approved", "Rejected", "Pending"].map((status) => ({
//     value: status.toLowerCase(),
//     label: status
// }));

// const SearchFilterModal = ({ isOpen, onClose, onFiltersSubmit }: { isOpen: boolean; onClose: () => void, onFiltersSubmit: (filters: any) => void }) => {
//     const token = useAppSelector((state) => state.auth.token);
//     const user = useAppSelector((state) => state.auth.userData);
//     const [residents, setResidents] = useState([]);
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [filters, setFilters] = useState<any>({
//         residentId: null,
//         propertyNo: "",
//         productId: null,
//         month: null,
//         year: null,
//         status: null,
//         fromDate: "",
//         toDate: ""
//     });

//     const handleChange = (field:any, value:any) => {
//         setFilters((prev:any) => ({ ...prev, [field]: value }));
//     };

//     const handleSubmit = (e:any) => {
//         e.preventDefault();
//         onFiltersSubmit({
//             residentId: filters.residentId?.value || null,
//             propertyNo: filters.propertyNo,
//             productId: filters.productId?.value || null,
//             month: filters.month?.value || null,
//             year: filters.year?.value || null,
//             status: filters.status?.value || null,
//             fromDate: filters.fromDate,
//             toDate: filters.toDate
//         });
//         onClose();
//     };

//     useEffect(() => {
//         document.body.classList.toggle("overflow-hidden", isOpen);
//         return () => document.body.classList.remove("overflow-hidden");
//     }, [isOpen]);

//     const handleReset = () => {
//         setFilters({
//             residentId: null,
//             propertyNo: "",
//             productId: null,
//             month: null,
//             year: null,
//             status: null,
//             fromDate: "",
//             toDate: ""
//         });
//     };

//     useEffect(() => {
//         if (!isOpen) return;
//         setLoading(true);
//         Promise.all([
//             getAllResidentsArray({ token, id: user.id }),
//             getAllProductsArr({ token })
//         ])
//             .then(([residentsRes, productsRes]) => {
//                 if (residentsRes.success) {
//                     setResidents(residentsRes.data.data.map((item:any) => ({
//                         label: `${item.name} - ${item.propertyNumber}`,
//                         value: item.id
//                     })));
//                 }
//                 if (productsRes.success) {
//                     setProducts(productsRes.data.data.map((item:any) => ({
//                         label: item.title,
//                         value: item.id
//                     })));
//                 }
//             })
//             .catch(console.error)
//             .finally(() => setLoading(false));
//     }, [isOpen]);

//     return (
//         <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
//             <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
//             <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 z-50">
//                 <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-900" onClick={onClose}>
//                     <X size={24} />
//                 </button>
//                 <Dialog.Title className="text-lg font-semibold text-gray-800">Search Filters</Dialog.Title>
//                 <form onSubmit={handleSubmit} className="mt-4 space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700">From Date</label>
//                             <input type="date" className="w-full p-2 border rounded-lg" value={filters.fromDate} onChange={(e) => handleChange("fromDate", e.target.value)} />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700">To Date</label>
//                             <input type="date" className="w-full p-2 border rounded-lg" value={filters.toDate} onChange={(e) => handleChange("toDate", e.target.value)} />
//                         </div>
//                     </div>
//                     <Select options={months} value={filters.month} onChange={(selected) => handleChange("month", selected)} placeholder="Select Month" />
//                     <Select options={years} value={filters.year} onChange={(selected) => handleChange("year", selected)} placeholder="Select Year" />
//                     <Select options={residents} value={filters.residentId} onChange={(selected) => handleChange("residentId", selected)} isLoading={loading} placeholder="Select Resident" />
//                     <input type="text" className="w-full p-2 border rounded-lg" placeholder="Property No" value={filters.propertyNo} onChange={(e) => handleChange("propertyNo", e.target.value)} />
//                     <Select options={products} value={filters.productId} onChange={(selected) => handleChange("productId", selected)} isLoading={loading} placeholder="Select Product" />
//                     <Select options={statuses} value={filters.status} onChange={(selected) => handleChange("status", selected)} placeholder="Select Status" />
//                     <div className="mt-6 flex justify-end gap-2">
//                         <button type="button" className="px-4 py-2 bg-gray-200 text-black rounded-lg" onClick={onClose}>Cancel</button>
//                         <button type="button" className="px-4 py-2 text-black border border-black rounded-lg" onClick={handleReset}>Reset</button>
//                         <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg">Apply Filters</button>
//                     </div>
//                 </form>
//             </div>
//         </Dialog>
//     );
// };

// export default SearchFilterModal;
