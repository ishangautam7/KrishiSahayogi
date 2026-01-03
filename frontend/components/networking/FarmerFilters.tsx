import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';

interface FarmerFiltersProps {
    onFilterChange: (filters: {
        location: string;
        farmerType: string;
        primaryCrops: string;
    }) => void;
}

const FarmerFilters: React.FC<FarmerFiltersProps> = ({ onFilterChange }) => {
    const [location, setLocation] = useState('');
    const [farmerType, setFarmerType] = useState('all');
    const [primaryCrops, setPrimaryCrops] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            onFilterChange({ location, farmerType, primaryCrops });
        }, 500); // Debounce queries

        return () => clearTimeout(handler);
    }, [location, farmerType, primaryCrops, onFilterChange]);

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold">
                <Filter size={20} className="text-green-600" />
                <h2>Filter Farmers</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Location Filter */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Location..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black"
                    />
                </div>

                {/* Primary Crops Filter */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Crops (e.g., Rice, Wheat)..."
                        value={primaryCrops}
                        onChange={(e) => setPrimaryCrops(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-black"
                    />
                </div>

                {/* Farmer Type Filter */}
                <div className="relative">
                    <select
                        value={farmerType}
                        onChange={(e) => setFarmerType(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white cursor-pointer text-black"
                    >
                        <option value="all">All Farmer Types</option>
                        <option value="subsistence">Subsistence</option>
                        <option value="commercial">Commercial</option>
                        <option value="hobbyist">Hobbyist</option>
                        <option value="student">Student</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerFilters;
