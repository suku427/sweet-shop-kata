import { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [sweets, setSweets] = useState([]);
    const [search, setSearch] = useState('');
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchSweets = async () => {
        try {
            const endpoint = search ? `/sweets/search?query=${search}` : '/sweets';
            const res = await api.get(endpoint);
            setSweets(res.data);
        } catch (error) {
            console.error("Failed to fetch sweets", error);
        }
    };

    useEffect(() => {
        fetchSweets();
    }, [search]);

    const handlePurchase = async (id) => {
        try {
            await api.post(`/sweets/${id}/purchase`);
            alert('Purchase successful! 🍬');
            fetchSweets();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to purchase sweet");
        }
    };

    return (
        // Matches the "Sweet Delights" warm background image
        <div className="min-h-screen w-full bg-[#FDFBF7] font-sans text-[#1a1a1a]">

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Sweet Delights</h1>

                    <div className="flex gap-4 items-center">
                        {user?.role === 'admin' && (
                            <button onClick={() => navigate('/admin')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 underline">
                                Manage Inventory
                            </button>
                        )}
                        <button onClick={() => { logout(); navigate('/login') }} className="text-sm font-semibold text-gray-500 hover:text-red-600">
                            Logout
                        </button>
                    </div>
                </div>

                {/* Wide Search Bar (Exact Match) */}
                <div className="relative mb-10">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-400 text-lg">🔍</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-[#fcfbf9] border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 text-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {sweets.map((sweet) => (
                        // Card Layout matching the Reference Image Structure
                        <div key={sweet._id} className="bg-[#F5F0E1] rounded-md p-6 shadow-sm border border-[#EBE5D5] w-full">

                            {/* Row 1: Sweet Name */}
                            <div className="mb-6">
                                <h2 className="text-lg text-black">
                                    <span className="font-bold">Sweet Name:</span> {sweet.name}
                                </h2>
                            </div>

                            {/* Row 2: Category | Price | Quantity */}
                            <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
                                <div className="text-sm">
                                    <span className="font-bold text-black">Category:</span> {sweet.category}
                                </div>
                                <div className="text-sm">
                                    <span className="font-bold text-black">Price:</span> ₹{sweet.price}
                                </div>
                                <div className="text-sm">
                                    <span className="font-bold text-black">Quantity:</span>
                                    <span className={sweet.quantity > 0 ? "text-black" : "text-red-600"}>
                                        {sweet.quantity > 0 ? ` ${sweet.quantity} items` : ' Sold Out'}
                                    </span>
                                </div>
                            </div>

                            {/* Row 3: Description */}
                            <div className="mb-6">
                                <p className="font-bold text-black text-sm mb-1">Description:</p>
                                <p className="text-sm text-gray-800 leading-relaxed">
                                    {sweet.description || "No description provided."}
                                </p>
                            </div>

                            {/* Row 4: Action Button (Right Aligned) */}
                            <div className="flex justify-end border-t border-gray-300 pt-4 mt-4">
                                <button
                                    onClick={() => handlePurchase(sweet._id)}
                                    disabled={sweet.quantity === 0}
                                    className={`px-6 py-2 rounded text-sm font-semibold tracking-wide transition-colors
                                        ${sweet.quantity > 0
                                            ? 'bg-black text-[#F5F0E1] hover:bg-gray-800'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                >
                                    {sweet.quantity > 0 ? 'PURCHASE' : 'OUT OF STOCK'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {sweets.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        No sweets found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;