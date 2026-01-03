import React from 'react';
import { MapPin, Sprout, User, MessageCircle } from 'lucide-react';

interface Farmer {
    _id: string;
    name: string;
    location: string;
    farmerType: string;
    primaryCrops: string;
    avatar?: string;
}

interface FarmerListProps {
    farmers: Farmer[];
    onSelectFarmer: (farmerId: string) => void;
    isLoading: boolean;
}

const FarmerList: React.FC<FarmerListProps> = ({ farmers, onSelectFarmer, isLoading }) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (farmers.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">No farmers found</h3>
                <p className="text-gray-500">Try adjusting your filters to find more people.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmers.map((farmer) => (
                <div key={farmer._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                            <img
                                src={farmer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(farmer.name)}&background=random`}
                                alt={farmer.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg group-hover:text-green-700 transition-colors">{farmer.name}</h3>
                            <span className="inline-block px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium capitalize border border-green-100">
                                {farmer.farmerType}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-2 text-gray-600 text-sm">
                            <MapPin size={16} className="mt-0.5 text-gray-400 shrink-0" />
                            <span>{farmer.location}</span>
                        </div>
                        <div className="flex items-start gap-2 text-gray-600 text-sm">
                            <Sprout size={16} className="mt-0.5 text-gray-400 shrink-0" />
                            <span>{farmer.primaryCrops}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => onSelectFarmer(farmer._id)}
                        className="w-full py-2.5 px-4 bg-gray-50 hover:bg-green-600 text-gray-700 hover:text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 border border-gray-200 hover:border-transparent group-hover:bg-green-600 group-hover:text-white group-hover:border-transparent"
                    >
                        <MessageCircle size={18} />
                        Message Farmer
                    </button>
                </div>
            ))}
        </div>
    );
};

export default FarmerList;
