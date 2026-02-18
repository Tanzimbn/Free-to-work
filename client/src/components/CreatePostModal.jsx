import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { divisions, districts, thanas } from '../utils/locationData';
import './CreatePostModal.css';

const CreatePostModal = ({ onClose, onPostCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        detail: '',
        budget: '',
        time: '', // Deadline
        category: '',
        division: '',
        district: '',
        station: '' // Thana
    });
    const [categories, setCategories] = useState([]);
    const [availableDistricts, setAvailableDistricts] = useState([]);
    const [availableThanas, setAvailableThanas] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.post('/allcategory');
                setCategories(res.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'division') {
            setAvailableDistricts(districts[value] || []);
            setAvailableThanas([]);
            setFormData(prev => ({ ...prev, district: '', station: '' }));
        } else if (name === 'district') {
            setAvailableThanas(thanas[value] || []);
            setFormData(prev => ({ ...prev, station: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/post', formData);
            if (res.data.message === "Success") {
                onPostCreated();
                onClose();
                toast.success("Post created successfully!");
            } else {
                toast.error("Failed to create post");
            }
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("Error creating post");
        }
    };

    return (
        <div className="post_popup">
            <div className="post-box">
                <button id="post_popup_close" onClick={onClose}>X</button>
                <h2>Job Post Form</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="title">Title of the Job:</label>
                    <input 
                        type="text" 
                        name="title" 
                        id="title" 
                        maxLength="200" 
                        autoComplete="off" 
                        required 
                        value={formData.title}
                        onChange={handleChange}
                    />

                    <label htmlFor="detail">Description:</label>
                    <textarea 
                        name="detail" 
                        id="detail" 
                        rows="4" 
                        autoComplete="off" 
                        required
                        value={formData.detail}
                        onChange={handleChange}
                    ></textarea>

                    <label htmlFor="budget">Budget:</label>
                    <input 
                        type="number" 
                        name="budget" 
                        id="budget" 
                        autoComplete="off" 
                        required
                        value={formData.budget}
                        onChange={handleChange}
                    />

                    <label htmlFor="time">Deadline:</label>
                    <input 
                        type="datetime-local" 
                        name="time" 
                        id="time" 
                        required
                        value={formData.time}
                        onChange={handleChange}
                    />

                    <label htmlFor="category">Tags or Category:</label>
                    <input 
                        type="text" 
                        name="category" 
                        id="category" 
                        list="category_list" 
                        autoComplete="off" 
                        required
                        value={formData.category}
                        onChange={handleChange}
                    />
                    <datalist id="category_list">
                        {categories.map((cat, index) => (
                            <option key={index} value={cat.value} />
                        ))}
                    </datalist>

                    <label htmlFor="division">Division:</label>
                    <select 
                        name="division" 
                        id="division" 
                        onChange={handleChange} 
                        required
                        value={formData.division}
                    >
                        <option value="" disabled>Select division</option>
                        {divisions.map((div, index) => (
                            <option key={index} value={div}>{div}</option>
                        ))}
                    </select>

                    <label htmlFor="district">District:</label>
                    <select 
                        name="district" 
                        id="district" 
                        onChange={handleChange} 
                        required
                        value={formData.district}
                        disabled={!formData.division}
                    >
                        <option value="" disabled>Select division first</option>
                        {availableDistricts.map((dist, index) => (
                            <option key={index} value={dist}>{dist}</option>
                        ))}
                    </select>

                    <label htmlFor="station">Police station:</label>
                    <select 
                        name="station" 
                        id="station" 
                        onChange={handleChange} 
                        required
                        value={formData.station}
                        disabled={!formData.district}
                    >
                        <option value="" disabled>Select district first</option>
                        {availableThanas.map((thana, index) => (
                            <option key={index} value={thana}>{thana}</option>
                        ))}
                    </select>

                    <button type="submit">Post Job</button>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;
