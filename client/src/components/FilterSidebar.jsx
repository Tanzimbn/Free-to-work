import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { divisions, districts, thanas } from '../utils/locationData';

export default function FilterSidebar({ onFilterChange, showPrice = true }) {
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [division, setDivision] = useState('');
    const [district, setDistrict] = useState('');
    const [thana, setThana] = useState('');
    const [category, setCategory] = useState('');
    
    // Derived state for dropdown options
    const [districtOptions, setDistrictOptions] = useState([]);
    const [thanaOptions, setThanaOptions] = useState([]);

    // Category suggestions (mock or fetched)
    const [allCategories, setAllCategories] = useState([]); // This should ideally come from API
    const [categorySuggestions, setCategorySuggestions] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
             try {
                 const response = await api.post('/allcategory');
                 if (Array.isArray(response.data)) {
                    setAllCategories(response.data.map(item => item.value));
                 }
             } catch (error) {
                 console.error("Failed to fetch categories", error);
             }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        // Notify parent of filter changes
        // Debounce could be added here if needed
        onFilterChange({
            price_min: priceMin,
            price_max: priceMax,
            division,
            district,
            station: thana,
            category
        });
    }, [priceMin, priceMax, division, district, thana, category]);

    // Update district options when division changes
    useEffect(() => {
        if (division && districts[division]) {
            setDistrictOptions(districts[division]);
            setDistrict(''); // Reset district
            setThana(''); // Reset thana
        } else {
            setDistrictOptions([]);
            setDistrict('');
            setThana('');
        }
    }, [division]);

    // Update thana options when district changes
    useEffect(() => {
        if (district && thanas[district]) {
            setThanaOptions(thanas[district]);
            setThana(''); // Reset thana
        } else {
            setThanaOptions([]);
            setThana('');
        }
    }, [district]);

    const handleCategoryInput = (e) => {
        const val = e.target.value;
        setCategory(val);
        if (val.length > 0) {
            // Filter suggestions
            // const filtered = allCategories.filter(c => c.toLowerCase().includes(val.toLowerCase()));
            // setCategorySuggestions(filtered);
        } else {
            setCategorySuggestions([]);
        }
    };

    const selectCategory = (cat) => {
        setCategory(cat);
        setCategorySuggestions([]);
    };

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                        Filters
                    </h2>
                    <button
                        type="button"
                        onClick={() => {
                            setPriceMin('');
                            setPriceMax('');
                            setDivision('');
                            setDistrict('');
                            setThana('');
                            setCategory('');
                        }}
                        className="text-[11px] font-medium text-slate-400 hover:text-slate-200"
                    >
                        Clear all
                    </button>
                </div>
            </div>

            {showPrice && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-medium text-slate-200 uppercase tracking-wide">
                            Price
                        </h3>
                        <button
                            type="button"
                            className="text-[11px] text-slate-400 hover:text-slate-200"
                            onClick={() => {
                                setPriceMin('');
                                setPriceMax('');
                            }}
                        >
                            Clear
                        </button>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="text-[11px] text-slate-400 mb-1">Min</p>
                            <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1.5">
                                <i className="bx bx-dollar text-slate-400 text-xs" />
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={priceMin}
                                    onChange={(e) => setPriceMin(e.target.value)}
                                    className="flex-1 bg-transparent text-xs text-slate-100 outline-none placeholder:text-slate-500"
                                />
                                <span className="text-[11px] text-slate-500">BDT</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[11px] text-slate-400 mb-1">Max</p>
                            <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1.5">
                                <i className="bx bx-dollar text-slate-400 text-xs" />
                                <input
                                    type="number"
                                    placeholder="1000000+"
                                    value={priceMax}
                                    onChange={(e) => setPriceMax(e.target.value)}
                                    className="flex-1 bg-transparent text-xs text-slate-100 outline-none placeholder:text-slate-500"
                                />
                                <span className="text-[11px] text-slate-500">BDT</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 sm:p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-medium text-slate-200 uppercase tracking-wide">
                        Location
                    </h3>
                    <button
                        type="button"
                        className="text-[11px] text-slate-400 hover:text-slate-200"
                        onClick={() => {
                            setDivision('');
                            setDistrict('');
                            setThana('');
                        }}
                    >
                        Clear
                    </button>
                </div>

                <div className="space-y-3">
                    <div>
                        <p className="text-[11px] text-slate-400 mb-1">Division</p>
                        <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1.5">
                            <i className="bx bxs-location-plus text-slate-400 text-xs" />
                            <select
                                value={division}
                                onChange={(e) => setDivision(e.target.value)}
                                className="flex-1 bg-transparent text-xs text-slate-100 outline-none"
                            >
                                <option value="">Select division</option>
                                {divisions.map((div) => (
                                    <option key={div} value={div}>
                                        {div}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <p className="text-[11px] text-slate-400 mb-1">District</p>
                        <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1.5">
                            <i className="bx bxs-location-plus text-slate-400 text-xs" />
                            <select
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                disabled={!division}
                                className="flex-1 bg-transparent text-xs text-slate-100 outline-none disabled:text-slate-600"
                            >
                                <option value="">{division ? 'Select district' : 'Select division first'}</option>
                                {districtOptions.map((dist) => (
                                    <option key={dist} value={dist}>
                                        {dist}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <p className="text-[11px] text-slate-400 mb-1">Thana</p>
                        <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1.5">
                            <i className="bx bx-current-location text-slate-400 text-xs" />
                            <select
                                value={thana}
                                onChange={(e) => setThana(e.target.value)}
                                disabled={!district}
                                className="flex-1 bg-transparent text-xs text-slate-100 outline-none disabled:text-slate-600"
                            >
                                <option value="">{district ? 'Select thana' : 'Select district first'}</option>
                                {thanaOptions.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 sm:p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-medium text-slate-200 uppercase tracking-wide">
                        Category
                    </h3>
                    <button
                        type="button"
                        className="text-[11px] text-slate-400 hover:text-slate-200"
                        onClick={() => setCategory('')}
                    >
                        Clear
                    </button>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1.5">
                        <i className="bx bx-search-alt-2 text-slate-400 text-xs" />
                        <input
                            type="text"
                            placeholder="Search category"
                            value={category}
                            onChange={handleCategoryInput}
                            className="flex-1 bg-transparent text-xs text-slate-100 outline-none placeholder:text-slate-500"
                        />
                    </div>

                    {categorySuggestions.length > 0 && (
                        <div className="rounded-xl border border-slate-800 bg-slate-950/90 max-h-40 overflow-y-auto">
                            <ul className="py-1 text-xs text-slate-100">
                                {categorySuggestions.map((cat, idx) => (
                                    <li
                                        key={idx}
                                        onClick={() => selectCategory(cat)}
                                        className="px-3 py-1 hover:bg-slate-800/80 cursor-pointer"
                                    >
                                        {cat}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
