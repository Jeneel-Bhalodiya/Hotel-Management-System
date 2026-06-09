import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HotelSetup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        hotelName: "",
        hotelAddress: "",
        totalTables: "",
        totalEmployees: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.hotelName.trim()) {
            newErrors.hotelName = "Hotel Name is required";
        }

        if (!formData.hotelAddress.trim()) {
            newErrors.hotelAddress = "Hotel Address is required";
        }

        if (!formData.totalTables) {
            newErrors.totalTables = "Total Tables is required";
        }

        if (!formData.totalEmployees) {
            newErrors.totalEmployees = "Total Employees is required";
        }


        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch("http://127.0.0.1:8000/api/auth/hotel-setup/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    hotel_name: formData.hotelName,
                    hotel_address: formData.hotelAddress,
                    total_tables: formData.totalTables,
                    total_employees: formData.totalEmployees
                }),
            });

            if (response.ok) {
                // Update local user state
                const user = JSON.parse(localStorage.getItem("user"));
                user.hotel_setup_completed = true;
                localStorage.setItem("user", JSON.stringify(user));

                navigate("/admin");
            } else {
                const data = await response.json();
                console.error("Setup failed:", data);
                // Optionally handle API errors here
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex justify-center items-center p-6">
            <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
                <h1 className="text-4xl font-bold text-white text-center">
                    Hotel Setup
                </h1>

                <p className="text-center text-slate-400 mt-2">
                    Configure your hotel before starting.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-5"
                >
                    {/* Hotel Name */}
                    <div>
                        <input
                            type="text"
                            name="hotelName"
                            placeholder="Hotel Name"
                            value={formData.hotelName}
                            onChange={handleChange}
                            className="w-full p-3 rounded-xl bg-slate-900 text-white"
                        />
                        {errors.hotelName && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.hotelName}
                            </p>
                        )}
                    </div>

                    {/* Hotel Address */}
                    <div>
                        <input
                            type="text"
                            name="hotelAddress"
                            placeholder="Hotel Address"
                            value={formData.hotelAddress}
                            onChange={handleChange}
                            className="w-full p-3 rounded-xl bg-slate-900 text-white"
                        />
                        {errors.hotelAddress && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.hotelAddress}
                            </p>
                        )}
                    </div>

                    {/* Tables */}
                    <div>
                        <input
                            type="number"
                            name="totalTables"
                            placeholder="Total Tables"
                            value={formData.totalTables}
                            onChange={handleChange}
                            className="w-full p-3 rounded-xl bg-slate-900 text-white"
                        />
                        {errors.totalTables && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.totalTables}
                            </p>
                        )}
                    </div>

                    {/* Employees */}
                    <div>
                        <input
                            type="number"
                            name="totalEmployees"
                            placeholder="Total Employees"
                            value={formData.totalEmployees}
                            onChange={handleChange}
                            className="w-full p-3 rounded-xl bg-slate-900 text-white"
                        />
                        {errors.totalEmployees && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.totalEmployees}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition"
                    >
                        Save & Continue
                    </button>
                </form>
            </div>
        </div>
    );
}