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

export default function NewsfeedPage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [sortType, setSortType] = useState('Date');
  const [sortOrder, setSortOrder] = useState('Descending');
  const [filters, setFilters] = useState({
    price_min: '',
    price_max: '',
    division: '',
    district: '',
    station: '',
    category: '',
    searchValue: '',
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openPostModal) {
      setIsPostModalOpen(true);
      window.history.replaceState({}, document.title);
    }
    if (location.state?.openPostId) {
      setSelectedPost({ _id: location.state.openPostId });
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRes = await api.get('/newsfeed');
        if (userRes.data.error === 'Unauthorized') {
          navigate('/login');
          return;
        }
        if (userRes.data.user && userRes.data.user.length > 0) {
          setUser(userRes.data.user[0]);
        }
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRes = await api.post('/post_filter', filters);
        if (postsRes.data && Array.isArray(postsRes.data)) {
          const processedPosts = postsRes.data.map((item) => ({
            ...item.post,
            time_ago: item.time_ago,
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
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSearch = (val) => {
    setFilters((prev) => ({ ...prev, searchValue: val }));
  };

  const handlePostCreated = () => {
    const fetchPosts = async () => {
      try {
        const postsRes = await api.post('/post_filter', filters);
        if (postsRes.data && Array.isArray(postsRes.data)) {
          const processedPosts = postsRes.data.map((item) => ({
            ...item.post,
            time_ago: item.time_ago,
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
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <div className="text-xs sm:text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-[#d11f0c]/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
      </div>

      <AuthNavbar onPostClick={() => setIsPostModalOpen(true)} onSearch={handleSearch} />

      <main className="pb-10">
        <section className="border-b border-slate-800/60 bg-slate-950/80">
          <div className="mx-auto max-w-6xl px-4 pt-4 pb-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  Newsfeed
                </p>
                <h1 className="mt-1 text-xl font-semibold text-slate-50 sm:text-2xl">
                  Live opportunities around you
                </h1>
                <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                  Filter by category, location, and budget to find work or people that match.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-800/60 bg-slate-950">
          <div className="mx-auto max-w-6xl px-4 pt-6 pb-8">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
              loop
              className="mySwiper h-52 sm:h-64 md:h-72 lg:h-80 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/60"
            >
              <SwiperSlide>
                <img src="/images/4.png" alt="Ad 1" className="h-full w-full object-cover" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/pictures/1.png" alt="Ad 2" className="h-full w-full object-cover" />
              </SwiperSlide>
              <SwiperSlide>
                <img src="/pictures/2.png" alt="Ad 3" className="h-full w-full object-cover" />
              </SwiperSlide>
            </Swiper>
          </div>
        </section>

        <section className="bg-slate-950">
          <div className="mx-auto max-w-6xl px-4 pt-6 pb-12 flex flex-col gap-6 md:flex-row">
            <div className="md:w-1/3 lg:w-1/4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 sm:p-4">
                <p className="text-xs font-semibold text-slate-200 mb-2">Filters</p>
                <FilterSidebar onFilterChange={handleFilterChange} />
              </div>
            </div>

            <div className="flex-1">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-semibold text-slate-50">
                  Top results ({sortedPosts.length})
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400">Sort by</span>
                  <div className="flex items-center gap-2">
                    <select
                      name="sort_type"
                      id="sort_type"
                      value={sortType}
                      onChange={(e) => setSortType(e.target.value)}
                      className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs text-slate-100"
                    >
                      <option value="Date">Date</option>
                      <option value="price">Price</option>
                    </select>
                    <select
                      name="sort_order"
                      id="sort_order"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs text-slate-100"
                    >
                      <option value="Ascending">Ascending</option>
                      <option value="Descending">Descending</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {sortedPosts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onShowDetails={() => setSelectedPost(post)}
                  />
                ))}
                {sortedPosts.length === 0 && (
                  <p className="text-xs text-slate-400">No posts found with current filters.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

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

