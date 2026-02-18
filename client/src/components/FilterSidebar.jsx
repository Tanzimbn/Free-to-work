import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { divisions, districts, thanas } from '../utils/locationData';
import './FilterSidebar.css';

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
        <div className="left_bar">
            <h2>Filters</h2>
            <hr />
            
            {showPrice && (
                <div className="filter-price">
                    <div className="filter-price-head">
                        <h3>Price</h3>
                        <button onClick={() => { setPriceMin(''); setPriceMax(''); }}>Clear</button>
                    </div>
                    <div className="filter-price-body">
                        <p>Min</p>
                        <div className="box">
                            <i className='bx bx-dollar'></i>
                            <input 
                                type="text" 
                                placeholder="0" 
                                value={priceMin}
                                onChange={(e) => setPriceMin(e.target.value)}
                            />
                            <p style={{marginRight: '10px'}}>BDT</p>
                        </div>
                        <p>Max</p>
                        <div className="box">
                            <i className='bx bx-dollar'></i>
                            <input 
                                type="text" 
                                placeholder="1000000+" 
                                value={priceMax}
                                onChange={(e) => setPriceMax(e.target.value)}
                            />
                            <p style={{marginRight: '10px'}}>BDT</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="filter-location">
                <div className="filter-location-head">
                    <h3>Location</h3>
                    <button onClick={() => { setDivision(''); setDistrict(''); setThana(''); }}>Clear</button>
                </div>
                <div className="filter-location-body">
                    <p>Division</p>
                    <div className="divisions">
                        <i className='bx bxs-location-plus'></i>
                        <select 
                            value={division} 
                            onChange={(e) => setDivision(e.target.value)}
                        >
                            <option value="" disabled>Select division</option>
                            {divisions.map(div => (
                                <option key={div} value={div}>{div}</option>
                            ))}
                        </select>
                    </div>
                    <p>District</p>
                    <div className="district">
                        <i className='bx bxs-location-plus'></i>
                        <select 
                            value={district} 
                            onChange={(e) => setDistrict(e.target.value)}
                            disabled={!division}
                        >
                            <option value="" disabled>Select division first</option>
                            {districtOptions.map(dist => (
                                <option key={dist} value={dist}>{dist}</option>
                            ))}
                        </select>
                    </div>
                    <p>Thana</p>
                    <div className="station">
                        <i className='bx bx-current-location'></i>
                        <select 
                            value={thana} 
                            onChange={(e) => setThana(e.target.value)}
                            disabled={!district}
                        >
                            <option value="" disabled>Select district first</option>
                            {thanaOptions.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="filter-category">
                <div className="filter-category-head">
                    <h3>Category</h3>
                    <button onClick={() => setCategory('')}>Clear</button>
                </div>
                <div className="filter-category-body">
                    <div className="box">
                        <i className='bx bx-search-alt-2'></i>
                        <input 
                            type="text" 
                            placeholder="Search Category" 
                            value={category}
                            onChange={handleCategoryInput}
                        />
                    </div>
                    {categorySuggestions.length > 0 && (
                        <div className="category-suggest">
                            <ul>
                                {categorySuggestions.map((cat, idx) => (
                                    <li key={idx} onClick={() => selectCategory(cat)}>{cat}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
