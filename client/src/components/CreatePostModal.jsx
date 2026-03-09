import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { divisions, districts, thanas } from '../utils/locationData';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
    if (!isOpen) return null;
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
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-3 sm:px-4">
            <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 sm:px-5">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                            New job
                        </p>
                        <h2 className="text-sm sm:text-base font-semibold text-slate-50">
                            Post a job to the community
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white text-xs"
                    >
                        <span className="sr-only">Close</span>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-4 py-4 sm:px-5 sm:py-5 space-y-4">
                    <div className="space-y-1">
                        <label htmlFor="title" className="text-[11px] font-medium text-slate-300">
                            Title of the job
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            maxLength="200"
                            autoComplete="off"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full rounded-full border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-500"
                            placeholder="e.g. Part-time driver needed in Dhanmondi"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="detail" className="text-[11px] font-medium text-slate-300">
                            Description
                        </label>
                        <textarea
                            name="detail"
                            id="detail"
                            rows="4"
                            autoComplete="off"
                            required
                            value={formData.detail}
                            onChange={handleChange}
                            className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-500"
                            placeholder="Describe the work, schedule and any requirements"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                            <label htmlFor="budget" className="text-[11px] font-medium text-slate-300">
                                Budget (BDT)
                            </label>
                            <input
                                type="number"
                                name="budget"
                                id="budget"
                                autoComplete="off"
                                required
                                value={formData.budget}
                                onChange={handleChange}
                                className="w-full rounded-full border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-500"
                                placeholder="e.g. 5000"
                            />
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="time" className="text-[11px] font-medium text-slate-300">
                                Deadline
                            </label>
                            <input
                                type="datetime-local"
                                name="time"
                                id="time"
                                required
                                value={formData.time}
                                onChange={handleChange}
                                className="w-full rounded-full border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="category" className="text-[11px] font-medium text-slate-300">
                            Tags or category
                        </label>
                        <input
                            type="text"
                            name="category"
                            id="category"
                            list="category_list"
                            autoComplete="off"
                            required
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full rounded-full border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-500"
                            placeholder="e.g. Driver, Cook"
                        />
                        <datalist id="category_list">
                            {categories.map((cat, index) => (
                                <option key={index} value={cat.value} />
                            ))}
                        </datalist>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div className="space-y-1">
                            <label htmlFor="division" className="text-[11px] font-medium text-slate-300">
                                Division
                            </label>
                            <select
                                name="division"
                                id="division"
                                onChange={handleChange}
                                required
                                value={formData.division}
                                className="w-full rounded-full border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none"
                            >
                                <option value="">Select division</option>
                                {divisions.map((div, index) => (
                                    <option key={index} value={div}>
                                        {div}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="district" className="text-[11px] font-medium text-slate-300">
                                District
                            </label>
                            <select
                                name="district"
                                id="district"
                                onChange={handleChange}
                                required
                                value={formData.district}
                                disabled={!formData.division}
                                className="w-full rounded-full border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none disabled:text-slate-600"
                            >
                                <option value="">{formData.division ? 'Select district' : 'Select division first'}</option>
                                {availableDistricts.map((dist, index) => (
                                    <option key={index} value={dist}>
                                        {dist}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="station" className="text-[11px] font-medium text-slate-300">
                                Police station
                            </label>
                            <select
                                name="station"
                                id="station"
                                onChange={handleChange}
                                required
                                value={formData.station}
                                disabled={!formData.district}
                                className="w-full rounded-full border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none disabled:text-slate-600"
                            >
                                <option value="">{formData.district ? 'Select thana' : 'Select district first'}</option>
                                {availableThanas.map((thana, index) => (
                                    <option key={index} value={thana}>
                                        {thana}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-slate-700 bg-slate-900 px-4 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-600"
                        >
                            Post job
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;
