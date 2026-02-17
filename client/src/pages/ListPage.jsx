import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import api from '../services/api';
import AuthNavbar from '../components/AuthNavbar';
import FilterSidebar from '../components/FilterSidebar';
import './ListPage.css';

export default function ListPage() {
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        division: '',
        district: '',
        station: '', // Thana
        category: '',
        searchValue: '' // Search is handled in AuthNavbar? No, list.hbs has its own search bar in navbar?
        // list.hbs navbar has <input type="search" id="searchValue" ... onsearch="list_filter()">
        // AuthNavbar.jsx has a search input but it might be for posts?
        // In AuthNavbar, the search input is present. We need to lift that state up or access it.
        // For now, let's assume AuthNavbar handles navigation to ListPage with search query, 
        // OR we might need to add a search handler to AuthNavbar to pass search term to parent.
        // However, AuthNavbar is a component.
        // Let's check AuthNavbar search implementation.
    });
    const [sortOrder, setSortOrder] = useState('Descending');
    const navigate = useNavigate();

    // In list.hbs, the search input is in the navbar: id="searchValue".
    // And it triggers list_filter() onsearch.
    // AuthNavbar.jsx has a search input. We should probably use a Context or props to get that value.
    // But AuthNavbar is used in Newsfeed too.
    // For now, let's implement the list logic assuming we can get the search value later, 
    // or maybe we just ignore navbar search for a moment and focus on sidebar filters.
    // Wait, AuthNavbar has `onSearch` prop? I need to check AuthNavbar.jsx.

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [allUsers, filters, sortOrder]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.post('/list_filter', {});
            if (res.data && res.data.alluser) {
                setAllUsers(res.data.alluser);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            // Handle auth error if needed
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setVisibleCount(10); // Reset visible count on filter change
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const applyFilters = () => {
        let result = [...allUsers];
        const { division, district, station, category, searchValue } = filters;

        result = result.filter(user => {
            if (division && user.division !== division) return false;
            if (district && user.district !== district) return false;
            if (station && user.station !== station) return false;
            if (category && user.category !== category) return false;
            
            if (searchValue) {
                const fullName = `${user.fname} ${user.lname}`.toLowerCase();
                if (!fullName.includes(searchValue.toLowerCase())) return false;
            }
            return true;
        });

        // Sort
        result.sort((a, b) => {
            if (sortOrder === 'Ascending') {
                return (a.rating || 0) - (b.rating || 0);
            } else {
                return (b.rating || 0) - (a.rating || 0);
            }
        });

        setFilteredUsers(result);
    };

    const loadMore = () => {
        setVisibleCount(prev => prev + 10);
    };

    const handleUserClick = (id) => {
        navigate(`/profile/${id}`);
    };

    // Helper to render stars
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`fa fa-star ${rating >= i ? 'checked' : 'unchecked'}`}></span>
            );
        }
        return stars;
    };

    // Helper for base64 image
    const getImageSrc = (user) => {
        if (user.img && user.img.data && user.img.data.data) {
             try {
                const base64String = btoa(
                    new Uint8Array(user.img.data.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        ''
                    )
                );
                return `data:${user.img.contentType};base64,${base64String}`;
            } catch (e) {
                console.error("Error converting image", e);
                return '/pictures/Noimage.png';
            }
        }
        return '/pictures/Noimage.png';
    };

    return (
        <div className="list-page">
            <AuthNavbar onSearch={(val) => setFilters(prev => ({...prev, searchValue: val}))} />
            
            <div className="advertise">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={50}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3000 }}
                    className="swiper"
                >
                    <SwiperSlide><img src="/images/4.png" alt="Ad 1" /></SwiperSlide>
                    <SwiperSlide><img src="/images/2.png" alt="Ad 2" /></SwiperSlide>
                    <SwiperSlide><img src="/images/3.png" alt="Ad 3" /></SwiperSlide>
                    <SwiperSlide><img src="/images/1.png" alt="Ad 4" /></SwiperSlide>
                </Swiper>
            </div>

            <div className="list-page-container">
                <FilterSidebar onFilterChange={handleFilterChange} showPrice={false} />
                
                <div className="list-main-content">
                    <div className="main_title">
                        <span>Top results</span>
                        <div className="sort">
                            <div id='title'>
                                <p>Sort by Rating</p>
                            </div>
                            <div className="sort_value">
                                <select name="sort_order" id="sort_order" value={sortOrder} onChange={handleSortChange}>
                                    <option value="Ascending">Ascending</option>
                                    <option value="Descending">Descending</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="list_head">
                        <div className="list_profile_title">
                            <p>Profiles</p>
                        </div>
                        <div className="list_profession_title">
                            <p>Profession</p>
                        </div>
                        <div className="list_location_title">
                            <p>Location</p>
                        </div>
                        <div className="list_contact_title">
                            <p>Contact</p>
                        </div>
                    </div>

                    <div className="list_items">
                        {loading ? (
                            <div className="loading_gif">
                                <img src="/list/amalie-steiness.gif" alt="Loading..." />
                            </div>
                        ) : (
                            <>
                                {filteredUsers.slice(0, visibleCount).map(user => (
                                    <div key={user._id} className="list_data" onClick={() => handleUserClick(user._id)}>
                                        <div className="list_profile">
                                            <img src={getImageSrc(user)} alt="dp" />
                                            <div className="list_profile_info">
                                                <div>
                                                    <p id="list_profile_name">{user.fname} {user.lname}</p>
                                                </div>
                                                <div>
                                                    {renderStars(user.rating)}
                                                    <span id="list_profile_rating">({user.rating})</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="list_profession">
                                            <p>{user.category}</p>
                                        </div>
                                        <div className="list_location">
                                            <p>{user.station},</p>
                                            <p>{user.district},</p>
                                            <p>{user.division}</p>
                                        </div>
                                        <div className="list_contact">
                                            <p>{user.phone}</p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {!loading && visibleCount < filteredUsers.length && (
                        <div className="load_more" onClick={loadMore}>
                            <span><b>Load more</b></span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
