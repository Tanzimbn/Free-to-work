import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { divisions, districts, thanas } from '../utils/locationData';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [stage, setStage] = useState(1);
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        nid: '',
        gender: '',
        phone: '',
        email: '',
        division: '',
        district: '',
        station: '',
        password: '',
        confirmpassword: '',
        tc: false
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDivisionChange = (e) => {
        setFormData(prev => ({
            ...prev,
            division: e.target.value,
            district: '', // Reset district
            station: ''   // Reset station
        }));
    };

    const handleDistrictChange = (e) => {
        setFormData(prev => ({
            ...prev,
            district: e.target.value,
            station: ''   // Reset station
        }));
    };

    const handleNextStage1 = async () => {
        try {
            const { fname, nid } = formData;
            if (!fname || !nid) {
                toast.error("First name and NID are required");
                return;
            }

            const response = await api.post('/register/form1', { fname, nid });
            const data = response.data;
            
            if (data.message === "Valid") {
                setStage(2);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    };

    const handleNextStage2 = async () => {
        try {
            const { email, station, phone } = formData;
            if (!email || !station || !phone) {
                toast.error("Email, Phone and Police Station are required");
                return;
            }

            const response = await api.post('/register/form2', { 
                email, 
                Station: station, // Note: Backend expects 'Station' with capital S based on javascript.js
                phone 
            });
            const data = response.data;
            
            if (data.message === "Valid") {
                setStage(3);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { password, confirmpassword, tc } = formData;

        if (password !== confirmpassword) {
            toast.error("Passwords don't match!");
            return;
        }

        if (!tc) {
            toast.error("You have to agree to the terms and conditions.");
            return;
        }

        try {
            const payload = {
                fname: formData.fname,
                lname: formData.lname,
                nid: formData.nid,
                gender: formData.gender,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                division: formData.division,
                district: formData.district,
                station: formData.station
            };

            const response = await api.post('/register', payload);
            const data = response.data;
            
            if (data.message === "Successfull") {
                toast.success("Registration successful! Please confirm your email.");
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                toast.error(data.message || "Registration failed");
            }

        } catch (error) {
            console.error(error);
            toast.error("Registration failed.");
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-5xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
                <div className="w-full md:w-1/3 bg-slate-50 px-6 py-8 flex flex-col justify-between">
                    <div>
                        <div className="cursor-pointer" onClick={() => navigate('/')}>
                            <span className="text-slate-900 font-semibold text-xl hover:text-slate-600 transition-colors">FreeToWork.</span>
                        </div>
                        <p className="mt-16 text-center font-bold text-slate-900 text-xl">Already a member ?</p>
                        <p className="mt-3 text-center text-slate-600 text-sm">
                            To keep track on your dashboard please login with your personal info
                        </p>
                    </div>
                    <div className="mt-8 flex justify-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center rounded-full bg-red-600 hover:bg-amber-300 hover:text-slate-900 text-sm font-medium px-10 py-2.5 text-white transition-colors"
                        >
                            Login
                        </Link>
                    </div>
                </div>
                
                <div className="w-full md:w-2/3 px-6 md:px-10 py-10 flex flex-col items-center">
                    <p className="text-white font-extrabold text-2xl w-full text-left">Create Account</p>
                    
                    <div className="flex justify-center items-center mt-6 mb-8 w-full max-w-md">
                        <div className="flex-1 flex flex-col items-center">
                            <p className="text-xs font-semibold text-white mb-2">Personal info</p>
                            <p className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold ${stage > 1 ? 'bg-amber-300 text-slate-900' : 'bg-slate-100 text-slate-900'}`}>
                                {stage > 1 ? '✔' : '1'}
                            </p>
                        </div>
                        <div className="flex-1 flex flex-col items-center">
                            <p className="text-xs font-semibold text-white mb-2">Contact info</p>
                            <p className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold ${stage > 2 ? 'bg-amber-300 text-slate-900' : 'bg-slate-100 text-slate-900'}`}>
                                {stage > 2 ? '✔' : '2'}
                            </p>
                        </div>
                        <div className="flex-1 flex flex-col items-center">
                            <p className="text-xs font-semibold text-white mb-2">Final Submit</p>
                            <p className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold ${stage === 3 ? 'bg-amber-300 text-slate-900' : 'bg-slate-100 text-slate-900'}`}>3</p>
                        </div>
                    </div>

                    <div className="w-full">
                        {stage === 1 && (
                            <div className="w-full">
                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full mt-4">
                                    <div className="flex items-center border border-slate-300 bg-white rounded-md px-3 py-2 w-full">
                                        <i className="bx bx-user text-slate-500"></i>
                                        <input 
                                            type="text" 
                                            name="fname" 
                                            placeholder="Enter first name"
                                            value={formData.fname}
                                            onChange={handleChange}
                                            className="ml-2 w-full border-none outline-none text-sm text-slate-900 bg-transparent"
                                        />
                                    </div>
                                    <div className="flex items-center border border-slate-300 bg-white rounded-md px-3 py-2 w-full">
                                        <i className="bx bx-user text-slate-500"></i>
                                        <input 
                                            type="text" 
                                            name="lname" 
                                            placeholder="Enter last name"
                                            value={formData.lname}
                                            onChange={handleChange}
                                            className="ml-2 w-full border-none outline-none text-sm text-slate-900 bg-transparent"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full mt-4">
                                    <div className="flex items-center border border-slate-300 bg-white rounded-md px-3 py-2 w-full">
                                        <i className="bx bxs-id-card text-slate-500"></i>
                                        <input 
                                            type="tel" 
                                            name="nid" 
                                            placeholder="Enter Nid Number"
                                            value={formData.nid}
                                            onChange={handleChange}
                                            required
                                            className="ml-2 w-full border-none outline-none text-sm text-slate-900 bg-transparent"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between bg-white border border-slate-300 rounded-md px-3 py-2 w-full text-xs sm:text-sm text-slate-700">
                                        <div className="flex items-center mr-2">
                                            <i className="bx bx-male-female text-slate-500 mr-1"></i>
                                            <span>Gender</span>
                                        </div>
                                        <label className="flex items-center gap-1">
                                            <input 
                                                type="radio" 
                                                name="gender" 
                                                value="Male" 
                                                checked={formData.gender === 'Male'}
                                                onChange={handleChange}
                                                className="accent-black"
                                            /> 
                                            <span>Male</span>
                                        </label>
                                        <label className="flex items-center gap-1">
                                            <input 
                                                type="radio" 
                                                name="gender" 
                                                value="Female" 
                                                checked={formData.gender === 'Female'}
                                                onChange={handleChange}
                                                className="accent-black"
                                            /> 
                                            <span>Female</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex justify-center w-full mt-6">
                                    <button
                                        className="w-full sm:w-1/2 bg-red-600 hover:bg-amber-300 text-white hover:text-slate-900 font-medium text-sm py-2.5 rounded-md transition-colors"
                                        onClick={handleNextStage1}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}

                        {stage === 2 && (
                            <div className="w-full">
                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full mt-4">
                                    <div className="flex items-center border border-slate-300 bg-white rounded-md px-3 py-2 w-full">
                                        <i className="bx bx-phone text-slate-500"></i>
                                        <input 
                                            type="text" 
                                            name="phone" 
                                            placeholder="phone number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="ml-2 w-full border-none outline-none text-sm text-slate-900 bg-transparent"
                                        />
                                    </div>
                                    <div className="flex items-center border border-slate-300 bg-white rounded-md px-3 py-2 w-full">
                                        <i className="bx bx-envelope text-slate-500"></i>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            placeholder="Enter your email id"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="ml-2 w-full border-none outline-none text-sm text-slate-900 bg-transparent"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full mt-4">
                                    <div className="flex items-center border border-slate-300 bg-white rounded-md px-3 py-2 w-full">
                                        <i className="bx bxs-location-plus text-slate-500"></i>
                                        <select
                                            name="division"
                                            value={formData.division}
                                            onChange={handleDivisionChange}
                                            className="ml-2 w-full border-none outline-none text-sm text-slate-900 bg-transparent"
                                        >
                                            <option value="" disabled>Select Division</option>
                                            {divisions.map(div => (
                                                <option key={div} value={div}>{div}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-center border border-slate-300 bg-white rounded-md px-3 py-2 w-full">
                                        <i className="bx bxs-location-plus text-slate-500"></i>
                                        <select
                                            name="district"
                                            value={formData.district}
                                            onChange={handleDistrictChange}
                                            disabled={!formData.division}
                                            className="ml-2 w-full border-none outline-none text-sm text-slate-900 bg-transparent disabled:text-slate-400"
                                        >
                                            <option value="" disabled>Select division first</option>
                                            {formData.division && districts[formData.division]?.map(dist => (
                                                <option key={dist} value={dist}>{dist}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full mt-4">
                                    <div className="flex items-center border border-slate-300 bg-white rounded-md px-3 py-2 w-full">
                                        <i className="bx bx-current-location text-slate-500"></i>
                                        <select
                                            name="station"
                                            value={formData.station}
                                            onChange={handleChange}
                                            disabled={!formData.district}
                                            className="ml-2 w-full border-none outline-none text-sm text-slate-900 bg-transparent disabled:text-slate-400"
                                        >
                                            <option value="" disabled>Select district first</option>
                                            {formData.district && thanas[formData.district]?.map(thana => (
                                                <option key={thana} value={thana}>{thana}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-between w-full mt-6 gap-4">
                                    <button
                                        className="w-1/2 bg-slate-700 hover:bg-slate-600 text-white font-medium text-sm py-2.5 rounded-md transition-colors"
                                        onClick={() => setStage(1)}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        className="w-1/2 bg-red-600 hover:bg-amber-300 text-white hover:text-slate-900 font-medium text-sm py-2.5 rounded-md transition-colors"
                                        onClick={handleNextStage2}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}

                        {stage === 3 && (
                            <div className="w-full">
                                <form
                                    onSubmit={handleSubmit}
                                    className="w-full flex flex-col items-center"
                                >
                                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full mt-4">
                                        <div className="flex items-center border border-slate-300 bg-white rounded-md px-3 py-2 w-full">
                                            <i className="bx bx-lock-alt text-slate-500"></i>
                                            <input 
                                                type={showPassword ? "text" : "password"} 
                                                name="password" 
                                                placeholder="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required 
                                                className="ml-2 w-full border-none outline-none text-sm text-slate-900 bg-transparent"
                                            />
                                            <i 
                                                className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} 
                                                style={{color: '#FFDAB9', cursor: 'pointer'}} 
                                                onClick={() => setShowPassword(!showPassword)}
                                            ></i>
                                        </div>
                                        <div className="flex items-center border border-slate-300 bg-white rounded-md px-3 py-2 w-full">
                                            <i className="bx bx-lock-alt text-slate-500"></i>
                                            <input 
                                                type="password" 
                                                name="confirmpassword" 
                                                placeholder="Confirm password"
                                                value={formData.confirmpassword}
                                                onChange={handleChange}
                                                required 
                                                className="ml-2 w-full border-none outline-none text-sm text-slate-900 bg-transparent"
                                            /> 
                                        </div>
                                    </div>
                                    <div className="w-full mt-4 text-xs sm:text-sm text-white">
                                        <label className="flex items-start gap-2">
                                            <input 
                                                type="checkbox" 
                                                name="tc" 
                                                checked={formData.tc}
                                                onChange={handleChange}
                                                required 
                                                className="mt-1"
                                            />
                                            <span>
                                                By submiting your details, you agree to the{" "}
                                                <a
                                                    href="https://www.termsandconditionsgenerator.com/live.php?token=zdVLylWQhNopnkTOQSCjmuucF6ocSoJk"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-amber-300 underline"
                                                >
                                                    terms and conditions.
                                                </a>
                                            </span>
                                        </label>
                                    </div>
                                    <div className="flex justify-between w-full mt-6 gap-4">
                                        <button
                                            type="button"
                                            className="w-1/2 bg-slate-700 hover:bg-slate-600 text-white font-medium text-sm py-2.5 rounded-md transition-colors"
                                            onClick={() => setStage(2)}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-1/2 bg-red-600 hover:bg-amber-300 text-white hover:text-slate-900 font-medium text-sm py-2.5 rounded-md transition-colors"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
