import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PackagingMaterials from './packagingMaterials';
import pattern1 from '../Components/assets/pattern1.png';
import pattern2 from '../Components/assets/pattern2.png';
import pattern3 from '../Components/assets/pattern3.jpg';
import pattern4 from '../Components/assets/pattern4.png';
import arrow from '../Components/assets/1.png';
import { Link, useNavigate } from 'react-router-dom';

const Packaging = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate(); // For navigation

    // Sample data to simulate fetching from API
    const sampleData = [
        {
            id: 'p1',
            name: 'Cashew nuts',
            weight: '500g',
            quantity: 2,
            image: 'http://localhost:3000/images/uploadImage_1726846083197.png',
            packagingOption: 'Kraft Paper Box',
            customColor: '',
            note: '',
            selectedPattern: '',
            internalMeasurement: '20cm x 15cm x 10cm'
        },
        {
            id: 'p2',
            name: 'Dry Fish',
            weight: '1kg',
            quantity: 5,
            image: 'http://localhost:3000/images/uploadImage_1726832819705.jpg',
            packagingOption: 'Square Bottom Paper Bag',
            customColor: '',
            note: '',
            selectedPattern: '',
            internalMeasurement: '30cm x 20cm x 15cm'
        },
        {
            id: 'p3',
            name: 'Herbal Tea',
            weight: '250g',
            quantity: 1,
            image: 'http://localhost:3000/images/uploadImage_1726846083197.png',
            packagingOption: 'Card Board Box',
            customColor: '',
            note: '',
            selectedPattern: '',
            internalMeasurement: '10cm x 10cm x 5cm'
        }
    ];

    const fetchInfo = async () => {
        // Simulating an API call with sample data
        setProducts(sampleData);
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    const handlePackagingOptionChange = (productId, option) => {
        const updatedProducts = products.map(product =>
            product.id === productId ? { ...product, packagingOption: option } : product
        );
        setProducts(updatedProducts);
    };

    const handleCustomColorChange = (productId, color) => {
        const updatedProducts = products.map(product =>
            product.id === productId ? { ...product, customColor: color } : product
        );
        setProducts(updatedProducts);
    };

    const handlePatternChange = (productId, pattern) => {
        const updatedProducts = products.map(product =>
            product.id === productId ? { ...product, selectedPattern: pattern } : product
        );
        setProducts(updatedProducts);
    };

    const handleNoteChange = (productId, note) => {
        const updatedProducts = products.map(product =>
            product.id === productId ? { ...product, note } : product
        );
        setProducts(updatedProducts);
    };
    
    const getPatternImage = (pattern) => {
        switch (pattern) {
            case 'pattern1':
                return pattern1;
            case 'pattern2':
                return pattern2;
            case 'pattern3':
                return pattern3;
            case 'pattern4':
                return pattern4;
            default:
                return '';
        }
    };

    const handleSubmit = async (product) => {
        const orderData = {
            pa_id: new Date().getTime().toString(),
            o_id: new Date().getTime().toString(),  // Order ID
            pro_id: product.id,                     // Product ID
            quantity: product.quantity,
            material: product.packagingOption,
            internalMeasurement: product.internalMeasurement,
            customColor: product.customColor,
            customNote: product.note,
            pattern: product.selectedPattern,
            deliverDate: new Date(),              
            status: 'Pending'
        };

        try {
            // Send order data to the backend
            const response = await axios.post('http://localhost:3000/api/packing-orders', orderData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            alert('Packaging order added successfully!');
            console.log('Response:', response.data);

        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Failed to add packaging order');
        }
    };

    return (
        <div>
            <div>
                <button 
                    className="submitpack" 
                    style={{ marginRight: '2700px',marginLeft: '10px',width:'100px' }}
                    onClick={() => navigate('/checkout')} // Adjust the path as needed
                >
                    back
                </button>
              
            </div>

            <div className="packaging">
                {products.map(product => (
                    <div key={product.id} className="productpack">
                        <img src={product.image} alt={product.name} className="productpack-image" />
                        <div className="productpack-details">
                            <h3>{product.name}</h3>
                            <p>Weight = {product.weight}</p>
                            <p>Quantity = {product.quantity}</p>

                            {/* Display Custom Color and Pattern Overlapping */}
                            <p className='view'>CustomWrap:
                                <span className="custom-wrap">
                                    {/* Colored background */}
                                    <span
                                        className="color-background"
                                        style={{
                                            backgroundColor: product.customColor,
                                        }}
                                    ></span>

                                    {/* Pattern overlay */}
                                    {product.selectedPattern && (
                                        <img
                                            src={getPatternImage(product.selectedPattern)}
                                            alt={`Pattern ${product.selectedPattern}`}
                                            className="pattern-overlay"
                                        />
                                    )}
                                </span>
                            </p>
                        </div>

                        <div className="selection">
                            <label>Packaging Option</label>
                            <select
                                value={product.packagingOption}
                                onChange={(e) => handlePackagingOptionChange(product.id, e.target.value)}
                            >
                                <option value="Kraft Paper Box">Kraft Paper Box</option>
                                <option value="Square Bottom Paper Bag">Square Bottom Paper Bag</option>
                                <option value="Top Visible Corrugated Box">Top Visible Corrugated Box</option>
                                <option value="Cylindrical Paper Tube Box">Cylindrical Paper Tube Box</option>
                                <option value="Card Board Box">Card Board Box</option>
                            </select>

                            <div className="note-section">
                                <label>Note To Add In The Package</label>
                                <input
                                    type="text"
                                    placeholder="Note"
                                    value={product.note}
                                    onChange={(e) => handleNoteChange(product.id, e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="button-group">
                            <label>Custom Color</label>
                            <input
                                className='colorbox'
                                type="color"
                                value={product.customColor}
                                onChange={(e) => handleCustomColorChange(product.id, e.target.value)}
                            />

                            <div className="pattern-options">
                                <label>Select Pattern</label>
                                <label>
                                    <input
                                        type="radio"
                                        name={`pattern-${product.id}`}
                                        value="pattern1"
                                        checked={product.selectedPattern === 'pattern1'}
                                        onChange={() => handlePatternChange(product.id, 'pattern1')}
                                    />
                                    <img src={pattern1} alt="Pattern 1" id="pattern-image" />
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name={`pattern-${product.id}`}
                                        value="pattern2"
                                        checked={product.selectedPattern === 'pattern2'}
                                        onChange={() => handlePatternChange(product.id, 'pattern2')}
                                    />
                                    <img src={pattern2} alt="Pattern 2" id="pattern-image" />
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name={`pattern-${product.id}`}
                                        value="pattern3"
                                        checked={product.selectedPattern === 'pattern3'}
                                        onChange={() => handlePatternChange(product.id, 'pattern3')}
                                    />
                                    <img src={pattern3} alt="Pattern 3" id="pattern-image" />
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name={`pattern-${product.id}`}
                                        value="pattern4"
                                        checked={product.selectedPattern === 'pattern4'}
                                        onChange={() => handlePatternChange(product.id, 'pattern4')}
                                    />
                                    <img src={pattern4} alt="Pattern 4" id="pattern-image" />
                                </label>
                            </div>
                            <button className='submitpack' onClick={() => handleSubmit(product)}>Submit</button>
                        </div>
                    </div>
                ))}
            </div>
            <button 
                className="submitpack" 
                style={{ 
                display: 'block', 
                margin: '20px auto 50px auto',  // Center horizontally and add bottom margin
                width: '240px' 
                  }}
                onClick={() => navigate('/start')} // Adjust the path as needed
            >
                Proceed
             </button>

            <div>
                <PackagingMaterials />
            </div>
        </div>
    );
};

export default Packaging;
