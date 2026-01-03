"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { connectSocket, disconnectSocket, socket } from '@/lib/socket';
import { addLocalMessage } from '@/store/slices/messageSlice';
import apiClient from '@/lib/axios';
import FarmerFilters from '@/components/networking/FarmerFilters';
import FarmerList from '@/components/networking/FarmerList';
import ChatWindow from '@/components/networking/ChatWindow';

export default function NetworkingPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);

    // State
    const [farmers, setFarmers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        location: '',
        farmerType: 'all',
        primaryCrops: ''
    });

    // Socket Connection
    useEffect(() => {
        if (user?._id) {
            connectSocket(user._id);

            const handleNewMessage = (message: any) => {
                dispatch(addLocalMessage({ message, currentUserId: user._id }));
            };

            socket.on('newMessage', handleNewMessage);

            return () => {
                socket.off('newMessage', handleNewMessage);
                disconnectSocket();
            };
        }
    }, [user, dispatch]);

    // Fetch Farmers
    useEffect(() => {
        const fetchFarmers = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                if (filters.location) params.append('location', filters.location);
                if (filters.farmerType && filters.farmerType !== 'all') params.append('farmerType', filters.farmerType);
                if (filters.primaryCrops) params.append('primaryCrops', filters.primaryCrops);

                const response = await apiClient.get(`/user?${params.toString()}`);
                setFarmers(response.data.farmers);
            } catch (error) {
                console.error("Failed to fetch farmers", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFarmers();
    }, [filters]);

    const handleFilterChange = React.useCallback((newFilters: any) => {
        setFilters((prev) => {
            // Basic deep comparison to avoid unnecessary updates
            if (JSON.stringify(prev) === JSON.stringify(newFilters)) return prev;
            return newFilters;
        });
        setSelectedFarmerId(null); // Deselect when filtering
    }, []);

    const selectedFarmer = farmers.find((f: any) => f._id === selectedFarmerId);

    return (
        <div className="container mx-auto px-4 pt-24 pb-8 h-[calc(100vh-1rem)]">
            <div className="flex gap-6 h-full">
                {/* Left Side: Filters and List */}
                <div className={`flex-1 flex flex-col transition-all ${selectedFarmerId ? 'hidden lg:flex w-full lg:w-1/2' : 'w-full'}`}>
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 font-heading">Networking</h1>
                    <FarmerFilters onFilterChange={handleFilterChange} />
                    <div className="flex-1 overflow-y-auto pr-2">
                        <FarmerList
                            farmers={farmers}
                            onSelectFarmer={setSelectedFarmerId}
                            isLoading={isLoading}
                        />
                    </div>
                </div>

                {/* Right Side: Chat Window */}
                {selectedFarmerId && user ? (
                    <div className="fixed inset-0 lg:static z-50 lg:z-auto bg-gray-900/50 lg:bg-transparent lg:w-1/2 lg:flex flex-col">
                        <div className="bg-white lg:bg-transparent w-full h-full lg:h-auto lg:flex-1 p-4 lg:p-0">
                            <ChatWindow
                                recipientId={selectedFarmer._id}
                                recipientName={selectedFarmer.name}
                                recipientAvatar={selectedFarmer.avatar}
                                onClose={() => setSelectedFarmerId(null)}
                                currentUserId={user._id}
                            />
                        </div>
                    </div>
                ) : (
                    /* Placeholder for Desktop when no chat selected */
                    <div className="hidden lg:flex w-1/2 bg-gray-50 rounded-xl border border-dashed border-gray-300 items-center justify-center text-gray-400">
                        <div className="text-center">
                            <p className="text-lg font-medium">Select a farmer to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
