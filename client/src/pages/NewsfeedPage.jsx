import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import api from '../services/api';
import AuthNavbar from '../components/AuthNavbar';
import FilterSidebar from '../components/FilterSidebar';
import PostCard from '../components/PostCard';
import PostDetailsModal from '../components/PostDetailsModal';
import CreatePostModal from '../components/CreatePostModal';
import './NewsfeedPage.css';

export default function NewsfeedPage() {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [sortType, setSortType] = useState('Date');
    const [sortOrder, setSortOrder] = useState('Descending');
    const [filters, setFilters] = useState({
        price_min: "",
        price_max: "",
        division: "",
        district: "",
        station: "",
        category: "",
        searchValue: ""
    });
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check if we need to open post modal from navigation state
        if (location.state?.openPostModal) {
            setIsPostModalOpen(true);
            // Clear state so it doesn't reopen on refresh?
            // Actually, we can't easily clear history state without replacing
            window.history.replaceState({}, document.title);
        }
        if (location.state?.openPostId) {
            setSelectedPost({ _id: location.state.openPostId });
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // Fetch user data on mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Fetch user data
                const userRes = await api.get('/newsfeed');
                // Check if authorized
                if (userRes.data.error === "Unauthorized") {
                    navigate('/login');
                    return;
                }
                // userRes.data structure: { user: [...], noti: [...], unseen: ... }
                if (userRes.data.user && userRes.data.user.length > 0) {
                    setUser(userRes.data.user[0]);
                }
            } catch (err) {
                console.error(err);
                // If 401, navigate to login
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [navigate]);

    // Fetch posts when filters change
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const postsRes = await api.post('/post_filter', filters);
                
                if (postsRes.data && Array.isArray(postsRes.data)) {
                    const processedPosts = postsRes.data.map(item => ({
                        ...item.post,
                        time_ago: item.time_ago
                    }));
                    setPosts(processedPosts);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchPosts();
    }, [filters]);

    const getSortedPosts = () => {
        let sorted = [...posts];
        if (sortType === 'Date') {
            sorted.sort((a, b) => {
                const dateA = new Date(a.time).getTime();
                const dateB = new Date(b.time).getTime();
                return sortOrder === 'Ascending' ? dateA - dateB : dateB - dateA;
            });
        } else if (sortType === 'price') {
            sorted.sort((a, b) => {
                const priceA = parseFloat(a.budget) || 0;
                const priceB = parseFloat(b.budget) || 0;
                return sortOrder === 'Ascending' ? priceA - priceB : priceB - priceA;
            });
        }
        return sorted;
    };

    const sortedPosts = getSortedPosts();

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleSearch = (val) => {
        setFilters(prev => ({ ...prev, searchValue: val }));
    };

    const handlePostCreated = () => {
        // Trigger re-fetch by toggling a dependency or calling fetchPosts directly?
        // Since fetchPosts depends on filters, we can just call the API again or force update.
        // Simplest is to reload the page or trigger a refresh.
        // Or we can just re-run the effect by momentarily changing a dummy state, 
        // OR we can extract fetchPosts outside useEffect.
        // For now, let's just re-fetch posts with current filters.
        const fetchPosts = async () => {
            try {
                const postsRes = await api.post('/post_filter', filters);
                if (postsRes.data && Array.isArray(postsRes.data)) {
                    const processedPosts = postsRes.data.map(item => ({
                        ...item.post,
                        time_ago: item.time_ago
                    }));
                    setPosts(processedPosts);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchPosts();
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="newsfeed-page">
            <AuthNavbar onPostClick={() => setIsPostModalOpen(true)} onSearch={handleSearch} />
            
            <div className="advertise" style={{ marginTop: '20px', marginBottom: '20px' }}>
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={50}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3000 }}
                    loop={true}
                    className="mySwiper"
                    style={{ height: '300px', borderRadius: '10px' }}
                >
                    <SwiperSlide><img src="/images/4.png" alt="Ad 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></SwiperSlide>
                    <SwiperSlide><img src="/pictures/1.png" alt="Ad 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></SwiperSlide>
                    <SwiperSlide><img src="/pictures/2.png" alt="Ad 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></SwiperSlide>
                </Swiper>
            </div>

            <div className="container">
                <FilterSidebar onFilterChange={handleFilterChange} />
                
                <div className="main_content">
                    <div className="main_title">
                        <span>Top results </span>
                        <div className="sort">
                            <div id='title'><p>Sort by</p></div>
                            <div className="sort_value">
                                <select 
                                    name="sort_type" 
                                    id="sort_type"
                                    value={sortType}
                                    onChange={(e) => setSortType(e.target.value)}
                                >
                                    <option value="Date">Date</option>
                                    <option value="price">Price</option>
                                </select>
                                <select 
                                    name="sort_order" 
                                    id="sort_order"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                >
                                    <option value="Ascending">Ascending</option>
                                    <option value="Descending">Descending</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="post-list">
                        {sortedPosts.map(post => (
                            <PostCard 
                                key={post._id} 
                                post={post} 
                                onShowDetails={() => setSelectedPost(post)} 
                            />
                        ))}
                        {sortedPosts.length === 0 && <p>No posts found.</p>}
                    </div>
                </div>
            </div>

            <PostDetailsModal 
                post={selectedPost} 
                user={user}
                onClose={() => setSelectedPost(null)} 
            />

            <CreatePostModal 
                isOpen={isPostModalOpen} 
                onClose={() => setIsPostModalOpen(false)} 
                onPostCreated={handlePostCreated}
            />
        </div>
    );
}
