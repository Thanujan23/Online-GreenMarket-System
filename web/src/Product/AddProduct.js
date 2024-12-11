import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import LayoutNew from '../Layout';

const AddProduct = () => {
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [category, setCategory] = useState('Dry Products');
    const [description, setDescription] = useState('');
    const [expDate, setExpDate] = useState('');
    const [manufactureDate, setManufactureDate] = useState('');

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0]; // Format to YYYY-MM-DD

    // Date for minimum expiration date (one day after today)
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1); // One day after current date
    const nextDayFormatted = nextDay.toISOString().split('T')[0];

    // Validate form fields
    const validateForm = () => {
        let errors = {};

        if (!name.trim()) errors.name = "Product name is required";
        if (!description.trim()) errors.description = "Product description is required";
        if (!quantity || quantity <= 0) errors.quantity = "Quantity must be a positive number";
        if (!price || price <= 0) errors.price = "Price must be a positive number";
        if (!file) errors.file = "Please upload an image";
        if (!manufactureDate) errors.manufactureDate = "Manufacture date is required";
        if (!expDate) errors.expDate = "Expiration date is required";

        // Date validations
        if (manufactureDate > todayFormatted) {
            errors.manufactureDate = "Manufacture date cannot be in the future";
        }
        if (expDate <= todayFormatted) {
            errors.expDate = "Expiration date must be in the future";
        }
        if (expDate <= manufactureDate) {
            errors.expDate = "Expiration date must be after the manufacture date";
        }

        if (discount && (isNaN(discount) || discount < 0 || discount > 100)) {
            errors.discount = "Discount must be a number between 0 and 100";
        }

        setErrors(errors);
        return Object.keys(errors).length === 0; // Returns true if no errors
    };

    // Handle form submission
    const handleUpload = () => {
        if (!validateForm()) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('quantity', quantity);
        formData.append('price', price);
        formData.append('discount', discount);
        formData.append('category', category);
        formData.append('expDate', expDate);
        formData.append('manufactureDate', manufactureDate);

        axios.post('http://localhost:3000/api/products/upload', formData)
            .then(res => {
                console.log('Upload response:', res.data);
                navigate('/adminproduct');
                window.location.reload();
            })
            .catch(err => console.log(err));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        if (/^[a-zA-Z\s]*$/.test(value) || value === '') {
            setName(value);
        }
    };

    const handlePriceChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value) || value === '') {
            setPrice(value);
        }
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) || value === '') {
            setQuantity(value);
        }
    };

    const handleManufactureDateChange = (e) => {
        const selectedDate = e.target.value;
        setManufactureDate(selectedDate);
        if (expDate && expDate <= selectedDate) setExpDate(''); // Reset expDate if it's invalid
    };

    return (
        <LayoutNew>
            <div className="bg-green-50 min-h-screen">
                <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg border border-green-200">
                    <h2 className="text-3xl font-bold mb-6 text-center text-green-800">Add New Product</h2>

                    <div className="space-y-8">
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold mb-4 text-green-700">General Information</h3>
                            <input 
                                type="text" 
                                placeholder="Product Name" 
                                value={name} 
                                onChange={handleNameChange} 
                                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {errors.name && <p className="text-red-600">{errors.name}</p>}

                            <textarea
                                placeholder="Product Description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            ></textarea>
                            {errors.description && <p className="text-red-600">{errors.description}</p>}

                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="Dry Products">Dry Products</option>
                                <option value="Seafood">Seafood</option>
                                <option value="Handmade Eatable">Handmade Eatable</option>
                                <option value="Beverages">Beverages</option>
                                <option value="Dairy Products">Dairy Products</option>
                                <option value="Snacks">Snacks</option>
                            </select>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold mb-4 text-green-700">Pricing and Stock</h3>
                            <input 
                                type="text" 
                                placeholder="Base Price" 
                                value={price} 
                                onChange={handlePriceChange} 
                                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {errors.price && <p className="text-red-600">{errors.price}</p>}

                            <input 
                                type="text" 
                                placeholder="Stock" 
                                value={quantity} 
                                onChange={handleQuantityChange} 
                                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {errors.quantity && <p className="text-red-600">{errors.quantity}</p>}
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold mb-4 text-green-700">Manufacture and Expiration Dates</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-lg font-semibold text-green-600">Manufacture Date</h4>
                                    <input
                                        type="date"
                                        value={manufactureDate}
                                        onChange={handleManufactureDateChange}
                                        max={todayFormatted} // Manufacture date cannot be in the future
                                        className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    {errors.manufactureDate && <p className="text-red-600">{errors.manufactureDate}</p>}
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold text-green-600">Expiration Date</h4>
                                    <input
                                        type="date"
                                        value={expDate}
                                        onChange={e => setExpDate(e.target.value)}
                                        min={manufactureDate ? new Date(new Date(manufactureDate).getTime() + 86400000).toISOString().split('T')[0] : nextDayFormatted} // Expiration date must be at least 1 day after manufacture
                                        className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    {errors.expDate && <p className="text-red-600">{errors.expDate}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold mb-4 text-green-700">Product Image</h3>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {imagePreview && <img src={imagePreview} alt="Product preview" className="mt-4 max-h-48 object-cover" />}
                            {errors.file && <p className="text-red-600">{errors.file}</p>}
                        </div>

                        {/* Discount Input */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold mb-4 text-green-700">Discount</h3>
                            <input
                                type="text"
                                placeholder="Discount (%)"
                                value={discount}
                                onChange={e => setDiscount(e.target.value)}
                                className="w-full px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            {errors.discount && <p className="text-red-600">{errors.discount}</p>}
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleUpload}
                                className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutNew>
    );
};

export default AddProduct;
