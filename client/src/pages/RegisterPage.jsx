import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { divisions, districts, thanas } from '../utils/locationData';
import './RegisterPage.css';

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
        <div className="register-wrapper">
            <div className="container">
                <div className="login-link">
                    <div className="logo" onClick={() => navigate('/')}>
                        <span className="text">FreeToWork.</span>
                    </div>
                    <p className="side-big-heading">Already a member ?</p>
                    <p className="primary-bg-text">To keep track on your dashboard please login with your personal info</p>
                    <Link to="/login" className="loginbtn">Login</Link>
                </div>
                
                <div className="signup-form-container">
                    <p className="big-heading">Create Account</p>
                    
                    <div className="progress-bar">
                        <div className="stage">
                            <p className="tool-tip">Personal info</p>
                            <p className={`stageno stageno-1 ${stage > 1 ? 'active' : ''}`}>
                                {stage > 1 ? '✔' : '1'}
                            </p>
                        </div>
                        <div className="stage">
                            <p className="tool-tip">Contact info</p>
                            <p className={`stageno stageno-2 ${stage > 2 ? 'active' : ''}`}>
                                {stage > 2 ? '✔' : '2'}
                            </p>
                        </div>
                        <div className="stage">
                            <p className="tool-tip">Final Submit</p>
                            <p className={`stageno stageno-3 ${stage === 3 ? 'active' : ''}`}>3</p>
                        </div>
                    </div>

                    <div className="signup-form-content">
                        {stage === 1 && (
                            <div className="stage1-content" style={{width: '100%'}}>
                                <div className="button-container">
                                    <div className="text-fields fname">
                                        <i className='bx bx-user'></i>
                                        <input 
                                            type="text" 
                                            name="fname" 
                                            placeholder="Enter first name"
                                            value={formData.fname}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="text-fields lname">
                                        <i className='bx bx-user'></i>
                                        <input 
                                            type="text" 
                                            name="lname" 
                                            placeholder="Enter last name"
                                            value={formData.lname}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="button-container">
                                    <div className="text-fields nid">
                                        <i className='bx bxs-id-card'></i>
                                        <input 
                                            type="tel" 
                                            name="nid" 
                                            placeholder="Enter Nid Number"
                                            value={formData.nid}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="text-fields gender-selection">
                                        <label><i className='bx bx-male-female'></i></label>
                                        <label>
                                            <input 
                                                type="radio" 
                                                name="gender" 
                                                value="Male" 
                                                checked={formData.gender === 'Male'}
                                                onChange={handleChange}
                                            /> Male
                                        </label>
                                        <label>
                                            <input 
                                                type="radio" 
                                                name="gender" 
                                                value="Female" 
                                                checked={formData.gender === 'Female'}
                                                onChange={handleChange}
                                            /> Female
                                        </label>
                                    </div>
                                </div>
                                <div className="pagination-btns">
                                    <button className="nextPage" onClick={handleNextStage1}>Next</button>
                                </div>
                            </div>
                        )}

                        {stage === 2 && (
                            <div className="stage2-content" style={{width: '100%'}}>
                                <div className="button-container">
                                    <div className="text-fields phone">
                                        <i className='bx bx-phone'></i>
                                        <input 
                                            type="text" 
                                            name="phone" 
                                            placeholder="phone number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="text-fields email">
                                        <i className='bx bx-envelope'></i>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            placeholder="Enter your email id"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="button-container">
                                    <div className="text-fields divisions">
                                        <i className='bx bxs-location-plus'></i>
                                        <select name="division" value={formData.division} onChange={handleDivisionChange}>
                                            <option value="" disabled>Select Division</option>
                                            {divisions.map(div => (
                                                <option key={div} value={div}>{div}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="text-fields district">
                                        <i className='bx bxs-location-plus'></i>
                                        <select name="district" value={formData.district} onChange={handleDistrictChange} disabled={!formData.division}>
                                            <option value="" disabled>Select division first</option>
                                            {formData.division && districts[formData.division]?.map(dist => (
                                                <option key={dist} value={dist}>{dist}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="button-container">
                                    <div className="text-fields station">
                                        <i className='bx bx-current-location'></i>
                                        <select name="station" value={formData.station} onChange={handleChange} disabled={!formData.district}>
                                            <option value="" disabled>Select district first</option>
                                            {formData.district && thanas[formData.district]?.map(thana => (
                                                <option key={thana} value={thana}>{thana}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="pagination-btns">
                                    <button className="previousPage" onClick={() => setStage(1)}>Previous</button>
                                    <button className="nextPage" onClick={handleNextStage2}>Next</button>
                                </div>
                            </div>
                        )}

                        {stage === 3 && (
                            <div className="stage3-content" style={{width: '100%'}}>
                                <form onSubmit={handleSubmit} style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <div className="button-container">
                                        <div className="text-fields password">
                                            <i className='bx bx-lock-alt'></i>
                                            <input 
                                                type={showPassword ? "text" : "password"} 
                                                name="password" 
                                                placeholder="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required 
                                            />
                                            <i 
                                                className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} 
                                                style={{color: '#FFDAB9', cursor: 'pointer'}} 
                                                onClick={() => setShowPassword(!showPassword)}
                                            ></i>
                                        </div>
                                        <div className="text-fields confirmpassword">
                                            <i className='bx bx-lock-alt'></i>
                                            <input 
                                                type="password" 
                                                name="confirmpassword" 
                                                placeholder="Confirm password"
                                                value={formData.confirmpassword}
                                                onChange={handleChange}
                                                required 
                                            /> 
                                        </div>
                                    </div>
                                    <div className="tc-container">
                                        <label className="tc">
                                            <input 
                                                type="checkbox" 
                                                name="tc" 
                                                checked={formData.tc}
                                                onChange={handleChange}
                                                required 
                                            />
                                            By submiting your details, you agree to the <a href="https://www.termsandconditionsgenerator.com/live.php?token=zdVLylWQhNopnkTOQSCjmuucF6ocSoJk" target="_blank" rel="noreferrer"> terms and conditions. </a>
                                        </label>
                                    </div>
                                    <div className="pagination-btns">
                                        <button type="button" className="previousPage" onClick={() => setStage(2)}>Previous</button>
                                        <button type="submit" className="nextPage">Submit</button>
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
