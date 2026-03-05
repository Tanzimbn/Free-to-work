import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthNavbar from '../components/AuthNavbar';
import PostDetailsModal from '../components/PostDetailsModal';
import EditProfileModal from '../components/EditProfileModal';
import ReviewsModal from '../components/ReviewsModal';
import ReportUserModal from '../components/ReportUserModal';
import ProfilePostCard from '../components/ProfilePostCard';

const NoImage = '/pictures/Noimage.png';

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <AuthNavbar />
      <div className="animate-pulse">
        <div className="h-48 w-full bg-slate-900 sm:h-56" />
        <div className="relative z-10 mx-auto max-w-5xl px-4">
          <div className="-mt-12 mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="h-24 w-24 flex-shrink-0 rounded-full bg-slate-800 ring-4 ring-slate-950 sm:h-28 sm:w-28" />
              <div className="mb-2 space-y-2">
                <div className="h-4 w-36 rounded-full bg-slate-800" />
                <div className="h-3 w-24 rounded-full bg-slate-800" />
                <div className="h-3 w-20 rounded-full bg-slate-800" />
              </div>
            </div>
            <div className="flex gap-2 pb-2">
              <div className="h-8 w-24 rounded-full bg-slate-800" />
              <div className="h-8 w-28 rounded-full bg-slate-800" />
            </div>
          </div>
          <div className="border-t border-slate-800/60" />
          <div className="mt-6 flex flex-col gap-6 lg:flex-row">
            <div className="space-y-4 lg:w-5/12">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
                <div className="h-2.5 w-12 rounded-full bg-slate-800" />
                <div className="h-3 w-full rounded-full bg-slate-800" />
                <div className="h-3 w-5/6 rounded-full bg-slate-800" />
                <div className="h-3 w-4/6 rounded-full bg-slate-800" />
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
                <div className="h-2.5 w-12 rounded-full bg-slate-800" />
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-slate-800" />
                    <div className="h-3 w-40 rounded-full bg-slate-800" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-2">
                  <div className="h-4 w-2/3 rounded-full bg-slate-800" />
                  <div className="h-3 w-1/3 rounded-full bg-slate-800" />
                  <div className="h-3 w-full rounded-full bg-slate-800" />
                  <div className="h-3 w-4/5 rounded-full bg-slate-800" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isMainUser, setIsMainUser] = useState(false);

  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const [profileImgSrc, setProfileImgSrc] = useState(NoImage);
  const [coverImgSrc, setCoverImgSrc] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    let navigated = false;
    try {
      let targetId = id;
      if (!targetId) {
        const res = await api.get('/profile');
        if (res.data.userId) {
          navigated = true;
          navigate(`/profile/${res.data.userId}`, { replace: true });
          return;
        } else {
          navigated = true;
          navigate('/login');
          return;
        }
      }

      const res = await api.get(`/profile/${targetId}`);
      if (res.data.error === 'Unauthorized') {
        navigated = true;
        navigate('/login');
        return;
      }

      const data = res.data;
      setProfileData(data.view_user[0]);
      setCurrentUser(data.user[0]);
      setPosts(data.allpost);
      setReviews(data.allreview);
      setIsMainUser(data.MainUser);

      loadProfileImage(targetId);
      loadCoverImage(targetId);
    } catch (err) {
      console.error('Error fetching profile:', err);
      if (err.response?.status === 401) navigate('/login');
    } finally {
      if (!navigated) setLoading(false);
    }
  };

  const loadProfileImage = async (userId) => {
    try {
      const res = await api.post('/user_data', { id: userId });
      const data = res.data;
      if (data?.[0]?.img?.data) {
        const base64String = btoa(
          new Uint8Array(data[0].img.data.data).reduce(
            (acc, byte) => acc + String.fromCharCode(byte), ''
          )
        );
        setProfileImgSrc(`data:${data[0].img.contentType};base64,${base64String}`);
      } else {
        setProfileImgSrc(NoImage);
      }
    } catch {
      setProfileImgSrc(NoImage);
    }
  };

  const loadCoverImage = async (userId) => {
    try {
      const res = await api.post('/cover_data', { id: userId });
      const data = res.data;
      if (data?.[0]?.cover?.data) {
        const base64String = btoa(
          new Uint8Array(data[0].cover.data.data).reduce(
            (acc, byte) => acc + String.fromCharCode(byte), ''
          )
        );
        setCoverImgSrc(`data:${data[0].cover.contentType};base64,${base64String}`);
      } else {
        setCoverImgSrc(null);
      }
    } catch {
      setCoverImgSrc(null);
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('testImage', file);
    try {
      await api.post('/edit_user', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      loadProfileImage(id);
    } catch (err) {
      console.error('Error uploading profile image:', err);
    }
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('testImage', file);
    try {
      await api.post('/edit_cover', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      loadCoverImage(id);
    } catch (err) {
      console.error('Error uploading cover image:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.post('/delete_post', { id: postId });
      fetchProfile();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  if (loading) return <ProfileSkeleton />;
  if (!profileData) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-400">
      Profile not found.
    </div>
  );

  const rating = profileData.rating ? Number(profileData.rating).toFixed(1) : '0.0';
  const locationParts = [profileData.station, profileData.district, profileData.division].filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-[#d11f0c]/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" />
      </div>

      <AuthNavbar />

      {/* Cover image */}
      <div className="relative h-48 w-full overflow-hidden sm:h-56">
        {coverImgSrc ? (
          <img src={coverImgSrc} alt="Cover" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        {isMainUser && (
          <label
            htmlFor="coverFileInput"
            className="absolute bottom-3 right-3 flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-[11px] font-medium text-slate-200 backdrop-blur-sm transition-colors hover:border-slate-500 hover:bg-slate-900/90"
          >
            <i className="bx bx-camera text-sm" />
            Change cover
            <input
              id="coverFileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverImageUpload}
            />
          </label>
        )}
      </div>

      {/* Profile header */}
      <div className="relative z-10 mx-auto max-w-5xl px-4">
        {/* Row 1: avatar overlaps cover on the left, action buttons on the right */}
        <div className="-mt-12 flex items-start justify-between">
          <div className="relative flex-shrink-0">
            <img
              src={profileImgSrc}
              alt="Profile"
              onError={(e) => { e.target.src = NoImage; }}
              className="h-24 w-24 rounded-full object-cover ring-4 ring-slate-950 sm:h-28 sm:w-28"
            />
            {isMainUser && (
              <label
                htmlFor="profileFileInput"
                className="absolute bottom-0.5 right-0.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition-colors hover:bg-slate-800"
                title="Change profile picture"
              >
                <i className="bx bx-camera text-xs" />
                <input
                  id="profileFileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageUpload}
                />
              </label>
            )}
          </div>

          {/* Action buttons sit below the cover edge */}
          <div className="flex items-center gap-2 mt-14">
            <button
              type="button"
              onClick={() => setIsReviewsOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-slate-500 hover:bg-slate-800"
            >
              <i className="bx bxs-star text-amber-400 text-sm" />
              Reviews
            </button>
            {isMainUser ? (
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#d11f0c] px-4 py-2 text-xs font-medium text-white shadow-md shadow-[#d11f0c]/30 transition-colors hover:bg-[#b91a09]"
              >
                <i className="bx bx-edit text-sm" />
                Edit profile
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsReportOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-800/60 bg-red-950/40 px-4 py-2 text-xs font-medium text-red-400 transition-colors hover:border-red-700 hover:bg-red-950/60"
              >
                <i className="bx bx-flag text-sm" />
                Report
              </button>
            )}
          </div>
        </div>

        {/* Row 2: name, category, rating — fully below the cover photo */}
        <div className="mt-3">
          <h1 className="text-lg font-semibold text-slate-50 sm:text-xl">
            {profileData.fname} {profileData.lname}
          </h1>
          {profileData.category && (
            <span className="mt-1 inline-flex items-center rounded-full border border-slate-700 bg-slate-950/60 px-2.5 py-0.5 text-[11px] font-medium text-sky-300">
              {profileData.category}
            </span>
          )}
          <div className="mt-1.5 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`text-xs ${
                  Number(rating) >= star
                    ? 'bx bxs-star text-amber-400'
                    : 'bx bx-star text-slate-600'
                }`}
              />
            ))}
            <span className="ml-1 text-[11px] text-slate-400">({rating})</span>
          </div>
        </div>

        <div className="mt-4 border-t border-slate-800/60" />

        {/* Main content */}
        <div className="mt-6 flex flex-col gap-6 pb-12 lg:flex-row">
          {/* Left: Bio + Details */}
          <div className="space-y-4 lg:w-5/12">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">About</p>
              <p className="text-sm leading-relaxed text-slate-300">
                {profileData.bio || 'No bio available.'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">Details</p>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2.5">
                  <i className="bx bx-envelope flex-shrink-0 text-base text-slate-500" />
                  <span className="truncate">{profileData.email}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <i className="bx bx-phone flex-shrink-0 text-base text-slate-500" />
                  <span>{profileData.phone || '—'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <i className="bx bx-map flex-shrink-0 text-base text-slate-500 mt-0.5" />
                  <span>{locationParts.length > 0 ? locationParts.join(', ') : '—'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Posts */}
          <div className="flex-1">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Recent Posts ({posts.length})
            </p>
            {posts.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center text-sm text-slate-500">
                No posts yet.
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <ProfilePostCard
                    key={post._id}
                    post={post}
                    isOwner={isMainUser}
                    onShowDetails={setSelectedPost}
                    onDelete={handleDeletePost}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <PostDetailsModal
        post={selectedPost}
        user={currentUser}
        onClose={() => setSelectedPost(null)}
      />
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={currentUser}
        onUpdate={fetchProfile}
      />
      <ReviewsModal
        isOpen={isReviewsOpen}
        onClose={() => setIsReviewsOpen(false)}
        reviews={reviews}
        targetUserId={id}
        currentUser={currentUser}
        onUpdate={fetchProfile}
      />
      <ReportUserModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        targetUserId={id}
      />
    </div>
  );
}