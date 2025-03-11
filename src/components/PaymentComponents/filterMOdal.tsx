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
        });
        onClose(); // Close modal after submitting
      };
      

    // Reset Filters
    const handleReset = () => {
        setFilters({
            resident: null,
            propertyNo: "",
            product: null,
            month: null,
            year: null,
            status: null,
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
            let params = {token}
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
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 z-50">
                {/* Close Button */}
                <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-900" onClick={onClose}>
                    <X size={24} />
                </button>

                <Dialog.Title className="text-lg font-semibold text-gray-800">Search Filters</Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
