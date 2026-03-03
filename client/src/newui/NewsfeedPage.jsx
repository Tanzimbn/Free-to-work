import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import api from '../services/api';
import AuthNavbar from '../components/AuthNavbar';
import FilterSidebar from '../components/FilterSidebar';
import PostCard from '../components/PostCard';
import PostDetailsModal from '../components/PostDetailsModal';
import CreatePostModal from '../components/CreatePostModal';

function PostCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/70 px-5 py-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-7 w-7 rounded-full bg-slate-800" />
        <div className="h-2.5 w-28 rounded-full bg-slate-800" />
      </div>
      <div className="mb-3 h-4 w-3/4 rounded-full bg-slate-800" />
      <div className="mb-3 h-5 w-24 rounded-full bg-slate-800" />
      <div className="mb-4 space-y-1.5">
        <div className="h-3 w-full rounded-full bg-slate-800" />
        <div className="h-3 w-5/6 rounded-full bg-slate-800" />
        <div className="h-3 w-4/6 rounded-full bg-slate-800" />
      </div>
      <div className="flex items-center justify-between border-t border-slate-800/60 pt-2">
        <div className="flex gap-2">
          <div className="h-5 w-20 rounded-full bg-slate-800" />
          <div className="h-5 w-16 rounded-full bg-slate-800" />
        </div>
        <div className="h-7 w-28 rounded-full bg-slate-800" />
      </div>
    </div>
  );
}

export default function NewsfeedPage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
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
      setPostsLoading(true);
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
      } finally {
        setPostsLoading(false);
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
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-[#d11f0c]/15 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
        </div>
        <AuthNavbar onPostClick={() => setIsPostModalOpen(true)} />
        <main className="pb-10">
          <section className="border-b border-slate-800/60 bg-slate-950/80">
            <div className="mx-auto max-w-6xl px-4 pt-4 pb-7">
              <div className="animate-pulse space-y-2">
                <div className="h-2.5 w-16 rounded-full bg-slate-800" />
                <div className="h-6 w-64 rounded-full bg-slate-800" />
                <div className="h-3 w-80 rounded-full bg-slate-800" />
              </div>
            </div>
          </section>
          <section className="bg-slate-950">
            <div className="mx-auto max-w-6xl px-4 pt-6 pb-12 flex flex-col gap-6 md:flex-row">
              <div className="md:w-1/3 lg:w-1/4">
                <div className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/70 h-72" />
              </div>
              <div className="flex-1 grid gap-4">
                {[...Array(4)].map((_, i) => <PostCardSkeleton key={i} />)}
              </div>
            </div>
          </section>
        </main>
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


        <section className="border-b border-slate-800/60 bg-slate-950 py-4">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-stretch gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
                <i className="bx bx-search-alt-2 flex-shrink-0 text-base text-slate-400" />
                <input
                  type="text"
                  placeholder="Job title, category, or keywords..."
                  value={filters.searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                />
              </div>
              <button
                type="button"
                onClick={() => handleSearch(filters.searchValue)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
              >
                <i className="bx bx-search text-base" />
                <span className="hidden sm:inline">Search Jobs</span>
              </button>
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
                {postsLoading
                  ? [...Array(4)].map((_, i) => <PostCardSkeleton key={i} />)
                  : sortedPosts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      onShowDetails={() => setSelectedPost(post)}
                    />
                  ))
                }
                {!postsLoading && sortedPosts.length === 0 && (
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
