import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../services/api';
import AuthNavbar from '../components/AuthNavbar';
import FilterSidebar from '../components/FilterSidebar';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getImageSrc(user) {
    if (user.img && user.img.data && user.img.data.data) {
        try {
            const base64String = btoa(
                new Uint8Array(user.img.data.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ''
                )
            );
            return `data:${user.img.contentType};base64,${base64String}`;
        } catch {
            return '/pictures/Noimage.png';
        }
    }
    return '/pictures/Noimage.png';
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function UserCardSkeleton() {
    return (
        <div className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="mb-4 flex items-center gap-3">
                <div className="h-14 w-14 flex-shrink-0 rounded-full bg-slate-800" />
                <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 rounded-full bg-slate-800" />
                    <div className="h-2.5 w-20 rounded-full bg-slate-800" />
                </div>
            </div>
            <div className="mb-3 flex gap-2">
                <div className="h-5 w-24 rounded-full bg-slate-800" />
            </div>
            <div className="mb-4 space-y-1.5">
                <div className="h-2.5 w-40 rounded-full bg-slate-800" />
                <div className="h-2.5 w-28 rounded-full bg-slate-800" />
            </div>
            <div className="border-t border-slate-800/60 pt-3">
                <div className="h-7 w-28 rounded-full bg-slate-800" />
            </div>
        </div>
    );
}

// ─── UserCard ────────────────────────────────────────────────────────────────

function UserCard({ user, onClick }) {
    const imgSrc = getImageSrc(user);
    const rating = user.rating || 0;
    const location = [user.station, user.district, user.division].filter(Boolean).join(', ');

    return (
        <article className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition-all duration-200 hover:border-slate-600 hover:bg-slate-900">
            {/* Avatar + Name + Rating */}
            <div className="mb-3 flex items-center gap-3">
                <img
                    src={imgSrc}
                    alt={`${user.fname} ${user.lname}`}
                    className="h-14 w-14 flex-shrink-0 rounded-full object-cover ring-2 ring-slate-700"
                />
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-50">
                        {user.fname} {user.lname}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <i
                                key={star}
                                className={`text-xs ${
                                    rating >= star
                                        ? 'bx bxs-star text-amber-400'
                                        : 'bx bx-star text-slate-600'
                                }`}
                            />
                        ))}
                        <span className="ml-1 text-[11px] text-slate-400">
                            ({rating})
                        </span>
                    </div>
                </div>
            </div>

            {/* Category */}
            {user.category && (
                <div className="mb-3">
                    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/60 px-2.5 py-0.5 text-[11px] font-medium text-sky-300">
                        {user.category}
                    </span>
                </div>
            )}

            {/* Location + Phone */}
            <div className="mb-4 space-y-1 text-[11px] text-slate-400">
                {location && (
                    <p className="flex items-center gap-1.5">
                        <i className="bx bx-map-pin text-xs text-slate-500" />
                        {location}
                    </p>
                )}
                {user.phone && (
                    <p className="flex items-center gap-1.5">
                        <i className="bx bx-phone text-xs text-slate-500" />
                        {user.phone}
                    </p>
                )}
            </div>

            {/* CTA */}
            <div className="border-t border-slate-800/60 pt-3">
                <button
                    type="button"
                    onClick={onClick}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5 text-[11px] font-semibold text-slate-100 transition-colors hover:border-slate-600 hover:bg-slate-700"
                >
                    View Profile
                    <i className="bx bx-chevron-right text-sm leading-none" />
                </button>
            </div>
        </article>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ListPage() {
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [filters, setFilters] = useState({
        division: '',
        district: '',
        station: '',
        category: '',
    });
    const [sortOrder, setSortOrder] = useState('Descending');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const res = await api.post('/list_filter', {});
                if (res.data && res.data.alluser) {
                    setAllUsers(res.data.alluser);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        let result = [...allUsers];
        const { division, district, station, category } = filters;

        result = result.filter((user) => {
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

        result.sort((a, b) =>
            sortOrder === 'Ascending'
                ? (a.rating || 0) - (b.rating || 0)
                : (b.rating || 0) - (a.rating || 0)
        );

        setFilteredUsers(result);
        setVisibleCount(10);
    }, [allUsers, filters, searchValue, sortOrder]);

    const handleFilterChange = (newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    const visibleUsers = filteredUsers.slice(0, visibleCount);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50">
            <AuthNavbar />

            <main className="pb-10">
                {/* Header */}
                <section className="border-b border-slate-800/60 bg-slate-950/80">
                    <div className="mx-auto max-w-6xl px-4 pt-4 pb-7">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                            Browse list
                        </p>
                        <h1 className="mt-1 text-xl font-semibold text-slate-50 sm:text-2xl">
                            Find skilled professionals
                        </h1>
                        <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                            Search by name, filter by location and category to find the right person.
                        </p>
                    </div>
                </section>

                {/* Search bar */}
                <section className="border-b border-slate-800/60 bg-slate-950 py-4">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="flex items-stretch gap-2">
                            <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3">
                                <i className="bx bx-search-alt-2 flex-shrink-0 text-base text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                                />
                                {searchValue && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchValue('')}
                                        className="flex-shrink-0 text-slate-500 hover:text-slate-300"
                                    >
                                        <i className="bx bx-x text-base" />
                                    </button>
                                )}
                            </div>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
                            >
                                <i className="bx bx-search text-base" />
                                <span className="hidden sm:inline">Search</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Main content */}
                <section className="bg-slate-950">
                    <div className="mx-auto max-w-6xl px-4 pt-6 pb-12 flex flex-col gap-6 md:flex-row">
                        {/* Sidebar */}
                        <div className="md:w-1/3 lg:w-1/4">
                            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 sm:p-4">
                                <FilterSidebar onFilterChange={handleFilterChange} showPrice={false} />
                            </div>
                        </div>

                        {/* Cards */}
                        <div className="flex-1">
                            {/* Sort + count row */}
                            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <span className="text-sm font-semibold text-slate-50">
                                    {loading ? 'Loading…' : `Top results (${filteredUsers.length})`}
                                </span>
                                <div className="flex items-center gap-3 text-xs">
                                    <span className="text-slate-400">Sort by rating</span>
                                    <select
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs text-slate-100"
                                    >
                                        <option value="Descending">Descending</option>
                                        <option value="Ascending">Ascending</option>
                                    </select>
                                </div>
                            </div>

                            {/* Grid */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                {loading
                                    ? [...Array(6)].map((_, i) => <UserCardSkeleton key={i} />)
                                    : visibleUsers.map((user) => (
                                        <UserCard
                                            key={user._id}
                                            user={user}
                                            onClick={() => navigate(`/profile/${user._id}`)}
                                        />
                                    ))
                                }
                            </div>

                            {!loading && filteredUsers.length === 0 && (
                                <p className="text-xs text-slate-400 mt-2">No users found with current filters.</p>
                            )}

                            {/* Load more */}
                            {!loading && visibleCount < filteredUsers.length && (
                                <div className="mt-6 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => setVisibleCount((prev) => prev + 10)}
                                        className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-5 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-800"
                                    >
                                        <i className="bx bx-down-arrow-alt text-sm" />
                                        Load more
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
