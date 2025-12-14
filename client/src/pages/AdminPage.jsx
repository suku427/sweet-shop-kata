import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import AddSweetForm from '../components/AddSweetForm';

const AdminPage = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* --- Navbar --- */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                            <span className="text-2xl">🍬</span>
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                                SweetShop <span className="text-gray-400 font-medium text-sm ml-1">Admin Panel</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => navigate('/')} 
                                className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
                            >
                                ← Back to Shop
                            </button>
                            <button 
                                onClick={() => { logout(); navigate('/login'); }} 
                                className="bg-red-50 text-red-500 border border-red-100 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-100 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-10">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Inventory Management</h2>
                    <p className="text-gray-500 mt-2">Add new sweets to the store catalog.</p>
                </div>

                <div className="animate-fade-in-up">
                    {/* We pass an empty function or a simple alert for onSweetAdded since we aren't displaying the list here immediately */}
                    <AddSweetForm onSweetAdded={() => alert('Sweet added! Go to Dashboard to view.')} />
                </div>
            </main>
        </div>
    );
};

export default AdminPage;