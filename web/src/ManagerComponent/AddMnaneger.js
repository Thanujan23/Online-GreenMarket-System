import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutNew from '../Layout';

function ManagerAddItem() {
    const navigate = useNavigate();
    const [newManager, setNewManager] = useState({
        username: "",
        dili_address: "", // This will now be a district selected from the dropdown
        dili_date: "",
        dili_status: "",
        dili_method: "",
        dili_cost: "",
        assignes_personal: "",
        notes: "",
    });

    const [errors, setErrors] = useState({});

    // List of districts in Sri Lanka
    const districts = [
        "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo",
        "Galle", "Gampaha", "Hambantota", "Jaffna", "Kalutara",
        "Kandy", "Kegalle", "Kilinochchi", "Kurunegala", "Matale",
        "Matara", "Monaragala", "Mullaitivu", "Nuwara Eliya", "Polonnaruwa",
        "Puttalam", "Ratnapura", "Trincomalee", "Vavuniya"
    ];

    const validate = () => {
        const newErrors = {};

        // Customer Name validation
        if (!newManager.username.trim()) {
            newErrors.username = "Customer Name is required.";
        }

        // Delivery Address validation (now checking for a district)
        if (!newManager.dili_address) {
            newErrors.dili_address = "Delivery Address is required.";
        }

        // Delivery Date validation
        if (!newManager.dili_date.trim()) {
            newErrors.dili_date = "Delivery Date is required.";
        }

        // Delivery Status validation
        if (!newManager.dili_status) {
            newErrors.dili_status = "Delivery Status is required.";
        } else if (!["Pending", "Shipped", "Delivered"].includes(newManager.dili_status)) {
            newErrors.dili_status = "Delivery Status must be one of: Pending, Shipped, Delivered.";
        }

        // Delivery Method validation
        if (!newManager.dili_method.trim()) {
            newErrors.dili_method = "Delivery Method is required.";
        }

        // Delivery Cost validation
        if (!newManager.dili_cost.trim()) {
            newErrors.dili_cost = "Delivery Cost is required.";
        } else if (isNaN(newManager.dili_cost) || parseFloat(newManager.dili_cost) <= 0) {
            newErrors.dili_cost = "Delivery Cost must be a positive number.";
        }

        // Assigned Personal validation
        if (!newManager.assignes_personal.trim()) {
            newErrors.assignes_personal = "Assigned Personal is required.";
        }

        // Notes validation
        if (!newManager.notes.trim()) {
            newErrors.notes = "Notes are required.";
        }

        return newErrors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Update state
        setNewManager((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear individual field errors on change
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleAdd = async () => {
        const newErrors = validate();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/managers/add_manager`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newManager),
            });

            const data = await response.json();

            if (data.success) {
                alert("Manager added successfully");
                navigate('/mdet'); // Redirect to manager list or desired page
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error adding manager:', error);
        }
    };

    return (
        <LayoutNew>
            <div className='item-add'>
                <h2>Add New Manager</h2>
                <form>
                    <label>Customer Name:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        onChange={handleInputChange}
                        value={newManager.username}
                    />
                    {errors.username && <p className="error">{errors.username}</p>}

                    <label>Delivery Address:</label>
                    <select
                        id="dili_address"
                        name="dili_address"
                        onChange={handleInputChange}
                        value={newManager.dili_address}
                    >
                        <option value="">Select District</option>
                        {districts.map((district) => (
                            <option key={district} value={district}>{district}</option>
                        ))}
                    </select>
                    {errors.dili_address && <p className="error">{errors.dili_address}</p>}

                    <label>Delivery Date:</label>
                    <input
                        type="date"
                        id="dili_date"
                        name="dili_date"
                        onChange={handleInputChange}
                        value={newManager.dili_date}
                    />
                    {errors.dili_date && <p className="error">{errors.dili_date}</p>}

                    <label>Delivery Status:</label>
                    <select
                        id="dili_status"
                        name="dili_status"
                        onChange={handleInputChange}
                        value={newManager.dili_status}
                    >
                        <option value="">Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                    {errors.dili_status && <p className="error">{errors.dili_status}</p>}

                    <label>Delivery Method:</label>
                    <input
                        type="text"
                        id="dili_method"
                        name="dili_method"
                        onChange={handleInputChange}
                        value={newManager.dili_method}
                    />
                    {errors.dili_method && <p className="error">{errors.dili_method}</p>}

                    <label>Delivery Cost $:</label>
                    <input
                        type="text"
                        id="dili_cost"
                        name="dili_cost"
                        onChange={handleInputChange}
                        value={newManager.dili_cost}
                    />
                    {errors.dili_cost && <p className="error">{errors.dili_cost}</p>}

                    <label>Assigned Personal:</label>
                    <input
                        type="text"
                        id="assignes_personal"
                        name="assignes_personal"
                        onChange={handleInputChange}
                        value={newManager.assignes_personal}
                    />
                    {errors.assignes_personal && <p className="error">{errors.assignes_personal}</p>}

                    <label>Notes:</label>
                    <textarea
                        id="notes"
                        name="notes"
                        onChange={handleInputChange}
                        value={newManager.notes}
                    />
                    {errors.notes && <p className="error">{errors.notes}</p>}

                    <button type="button" onClick={handleAdd}>Add Manager</button>
                </form>
            </div>
        </LayoutNew>
    );
}

export default ManagerAddItem;
