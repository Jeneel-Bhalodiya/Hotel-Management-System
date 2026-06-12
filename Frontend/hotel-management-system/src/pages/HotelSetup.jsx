//Import
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//Export
export default function HotelSetup() {
    
    //Navigate
    const navigate = useNavigate();

    //Form data
    const [formData, setFormData] = useState({
        hotelName: "",
        hotelAddress: "",
        totalTables: "",
    });

    //Error handling
    const [errors, setErrors] = useState({});

    //Handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    //Validate form
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



        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    //Submit form
    const handleSubmit = (e) => {
        e.preventDefault();

        //If form is not valid, return
        if (!validateForm()) return;

        localStorage.setItem(
            "hotelSettings",
            JSON.stringify(formData)
        );

        navigate("/admin");
    };

    //Render
    return (
        // Main container
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