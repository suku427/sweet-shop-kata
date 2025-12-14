import { useState } from 'react';
import api from '../api/axios';

const AddSweetForm = ({ onSweetAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        quantity: '',
        description: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/sweets', formData);
            onSweetAdded();
            setFormData({ name: '', category: '', price: '', quantity: '', description: '' });
            alert('Sweet added successfully!');
        } catch (error) {
            alert('Error adding sweet');
        }
    };

    const inputClass = "w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all";

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">✨</span>
                <h3 className="text-xl font-bold text-gray-800">Add New Inventory</h3>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sweet Name</label>
                    <input name="name" placeholder="e.g. Kaju Katli" value={formData.name} onChange={handleChange} className={inputClass} required />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input name="category" placeholder="e.g. Milk Based" value={formData.category} onChange={handleChange} className={inputClass} required />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input name="price" type="number" placeholder="0" value={formData.price} onChange={handleChange} className={inputClass} required />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input name="quantity" type="number" placeholder="0" value={formData.quantity} onChange={handleChange} className={inputClass} required />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" placeholder="Describe the taste..." value={formData.description} onChange={handleChange} className={`${inputClass} h-24`} />
                </div>

                <div className="md:col-span-2">
                    <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-purple-600 hover:shadow-lg transition-all transform active:scale-95">
                        Add to Inventory
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddSweetForm;