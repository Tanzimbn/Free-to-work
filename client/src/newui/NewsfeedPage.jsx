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

      <AuthNavbar onPostClick={() => setIsPostModalOpen(true)} />

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
          <div className="mx-auto max-w-6xl px-4 pt-4 pb-6">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              autoplay={{ delay: 4000 }}
              loop
              className="mySwiper h-40 sm:h-44 md:h-52 lg:h-56 overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950"
            >
              <SwiperSlide>
                <div className="flex h-full w-full flex-col justify-center gap-6 px-4 py-4 sm:px-6 md:flex-row md:px-10">
                  <div className="max-w-md space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                      About freetowork
                    </p>
                    <h2 className="text-lg font-semibold text-slate-50 sm:text-xl md:text-2xl">
                      One place for local jobs and trusted workers
                    </h2>
                    <p className="text-xs text-slate-300 sm:text-sm">
                      FreeToWork connects people who need help with students, professionals and
                      everyday workers nearby for daily, part-time and project based jobs.
                    </p>
                    <div className="flex flex-wrap gap-2 text-[10px] sm:text-[11px]">
                      <span className="inline-flex items-center rounded-full border border-emerald-500/60 bg-emerald-500/10 px-3 py-1 text-emerald-200">
                        <i className="bx bx-check-circle mr-1 text-xs" />
                        Verified community
                      </span>
                      <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-100">
                        <i className="bx bx-map-pin mr-1 text-xs" />
                        Nearby & flexible
                      </span>
                    </div>
                  </div>
                  <div className="grid flex-1 grid-cols-2 gap-3 text-[11px] sm:text-xs">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Quick view
                      </p>
                      <p className="mt-2 text-xs font-semibold text-slate-50 sm:text-sm">
                        3K+ active opportunities
                      </p>
                      <p className="mt-1 text-[11px] text-slate-300">
                        Short-term, long-term and one-time jobs around you.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        For both sides
                      </p>
                      <p className="mt-2 text-xs font-semibold text-slate-50 sm:text-sm">
                        Workers & job posters
                      </p>
                      <p className="mt-1 text-[11px] text-slate-300">
                        See real profiles and connect with the right people.
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="flex h-full w-full flex-col justify-center gap-6 px-4 py-4 sm:px-6 md:flex-row md:px-10">
                  <div className="max-w-md space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300">
                      Job categories
                    </p>
                    <h2 className="text-lg font-semibold text-slate-50 sm:text-xl md:text-2xl">
                      Find all kinds of local work in one feed
                    </h2>
                    <p className="text-xs text-slate-300 sm:text-sm">
                      From delivery and tutoring to home repairs, explore jobs that match your
                      time, skills and location.
                    </p>
                  </div>
                  <div className="grid flex-1 grid-cols-2 gap-3 text-[11px] sm:text-xs">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                      <p className="text-xs font-semibold text-slate-50">Daily & part-time</p>
                      <p className="mt-1 text-[11px] text-slate-300">
                        Delivery, driving, helper work, shop support and more.
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-200">
                          Delivery
                        </span>
                        <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-200">
                          Driving
                        </span>
                        <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-200">
                          Shop help
                        </span>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                      <p className="text-xs font-semibold text-slate-50">Skilled & services</p>
                      <p className="mt-1 text-[11px] text-slate-300">
                        Tuition, tech support, design, repair and event work.
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-200">
                          Tuition
                        </span>
                        <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-200">
                          Tech
                        </span>
                        <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-200">
                          Events
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="flex h-full w-full flex-col justify-center gap-6 px-4 py-4 sm:px-6 md:flex-row md:px-10">
                  <div className="max-w-md space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-purple-300">
                      Types of workers
                    </p>
                    <h2 className="text-lg font-semibold text-slate-50 sm:text-xl md:text-2xl">
                      Reach the right people for every type of task
                    </h2>
                    <p className="text-xs text-slate-300 sm:text-sm">
                      Post a job and connect with students, professionals and experienced local
                      workers ready to help.
                    </p>
                  </div>
                  <div className="grid flex-1 grid-cols-2 gap-3 text-[11px] sm:text-xs">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                      <p className="text-xs font-semibold text-slate-50">Students & learners</p>
                      <p className="mt-1 text-[11px] text-slate-300">
                        Flexible part-time workers looking to build experience and income.
                      </p>
                      <ul className="mt-2 space-y-1 text-[10px] text-slate-300">
                        <li>• Campus helpers</li>
                        <li>• Tutors and trainers</li>
                        <li>• Event staff</li>
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                      <p className="text-xs font-semibold text-slate-50">Skilled professionals</p>
                      <p className="mt-1 text-[11px] text-slate-300">
                        Mechanics, drivers, technicians and experienced home support.
                      </p>
                      <ul className="mt-2 space-y-1 text-[10px] text-slate-300">
                        <li>• Drivers & riders</li>
                        <li>• Service technicians</li>
                        <li>• Home & care support</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </section>

        <section className="border-b border-slate-800/60 bg-slate-950">
          <div className="mx-auto max-w-6xl px-4 pt-4 pb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Search
                </p>
                <p className="text-xs text-slate-300 sm:text-sm">
                  Search across jobs and workers by title, category or location.
                </p>
              </div>
              <div className="w-full max-w-md">
                <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100">
                  <i className="bx bx-search-alt-2 text-slate-400 text-xs" />
                  <input
                    type="text"
                    placeholder="Search jobs or people"
                    value={filters.searchValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-100 outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-950">
          <div className="mx-auto max-w-6xl px-4 pt-6 pb-12 flex flex-col gap-6 md:flex-row">
            <div className="md:w-1/3 lg:w-1/4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 sm:p-4">
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
