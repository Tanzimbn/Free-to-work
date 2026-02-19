import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthNavbar from '../components/AuthNavbar';
import PostDetailsModal from '../components/PostDetailsModal';
import EditProfileModal from '../components/EditProfileModal';
import ReviewsModal from '../components/ReviewsModal';
import ReportUserModal from '../components/ReportUserModal';
import './ProfilePage.css';

const NoImage = "/pictures/Noimage.png";

const ProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isMainUser, setIsMainUser] = useState(false);
    
    // Modals
    const [selectedPost, setSelectedPost] = useState(null);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isReviewsOpen, setIsReviewsOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);

    // Images
    const [profileImgSrc, setProfileImgSrc] = useState(NoImage);
    const [coverImgSrc, setCoverImgSrc] = useState(null); // Or default cover

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            let targetId = id;
            if (!targetId) {
                // If no ID provided, get logged-in user's ID
                const res = await api.get('/profile');
                if (res.data.userId) {
                    targetId = res.data.userId;
                    navigate(`/profile/${targetId}`, { replace: true });
                    return; // navigate will trigger useEffect again
                } else {
                    navigate('/login');
                    return;
                }
            }

            const res = await api.get(`/profile/${targetId}`);
            if (res.data.error === "Unauthorized") {
                navigate('/login');
                return;
            }

            const data = res.data;
            // Data structure: {user, view_user, allpost, givenId, loginId, MainUser, noti, unseen, allreview}
            // user: logged in user (array)
            // view_user: profile owner (array)
            
            setProfileData(data.view_user[0]);
            setCurrentUser(data.user[0]);
            setPosts(data.allpost);
            setReviews(data.allreview);
            setIsMainUser(data.MainUser);
            
            // Load images
            loadProfileImage(targetId);
            loadCoverImage(targetId);

        } catch (err) {
            console.error("Error fetching profile:", err);
            if (err.response && err.response.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const loadProfileImage = async (userId) => {
        try {
            const res = await api.post('/user_data', { id: userId });
            const data = res.data;
            if (data && data.length > 0 && data[0].img && data[0].img.data) {
                const base64String = btoa(
                    new Uint8Array(data[0].img.data.data)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                setProfileImgSrc(`data:${data[0].img.contentType};base64,${base64String}`);
            } else {
                setProfileImgSrc(NoImage);
            }
        } catch (err) {
            console.error("Error loading profile image:", err);
            setProfileImgSrc(NoImage);
        }
    };

    const loadCoverImage = async (userId) => {
        try {
            const res = await api.post('/cover_data', { id: userId });
            const data = res.data;
            if (data && data.length > 0 && data[0].cover && data[0].cover.data) {
                const base64String = btoa(
                    new Uint8Array(data[0].cover.data.data)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                setCoverImgSrc(`data:${data[0].cover.contentType};base64,${base64String}`);
            } else {
                // Default cover
                setCoverImgSrc("/user_profile/pictures/1600w-qt_TMRJF4m0.webp"); // You might need to adjust this path
            }
        } catch (err) {
            console.error("Error loading cover image:", err);
            setCoverImgSrc(null);
        }
    };

    const handleProfileImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('testImage', file); // 'testImage' is the field name in backend multer config

        try {
            await api.post('/edit_user', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Reload image
            loadProfileImage(id);
        } catch (err) {
            console.error("Error uploading profile image:", err);
        }
    };

    const handleCoverImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('testImage', file);

        try {
            await api.post('/edit_cover', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Reload image
            loadCoverImage(id);
        } catch (err) {
            console.error("Error uploading cover image:", err);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm("Do you want to delete this post?")) return;

        try {
            await api.post('/delete_post', { id: postId });
            // Refresh posts
            fetchProfile();
        } catch (err) {
            console.error("Error deleting post:", err);
        }
    };

    if (loading) return <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-600 text-sm">Loading...</div>;
    if (!profileData) return <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-600 text-sm">Profile not found</div>;

    return (
        <div className="profile-page bg-gray-50 min-h-screen">
            <AuthNavbar />
            <div className="advertise h-6"></div>
            
            <div className="profile-container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                <form encType="multipart/form-data" className="mb-6">
                    {coverImgSrc ? (
                        <img
                            src={coverImgSrc}
                            className="cover-img w-full h-40 sm:h-52 md:h-64 object-cover rounded-xl"
                            alt="coverimage"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                    ) : (
                        <div className="cover-img w-full h-40 sm:h-52 md:h-64 rounded-xl bg-gray-200 flex items-center justify-center text-gray-600 text-sm">
                            No Cover Image
                        </div>
                    )}
                    
                    {isMainUser && (
                        <>
                            <input 
                                type="file" 
                                className="admin__input"
                                id="mycoverFile" 
                                name="testImage" 
                                onChange={handleCoverImageUpload}
                                style={{ display: 'none' }}
                            />
                            <label
                                htmlFor="mycoverFile"
                                id="choose_cp"
                                className="inline-flex mt-3 px-4 py-1 rounded-full bg-slate-900 text-white text-xs cursor-pointer"
                            >
                                Choose image
                            </label>
                        </>
                    )}
                </form>

                <div className="profile-details flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="pd-left flex-1">
                        <div className="pd-row flex gap-4">
                            <div className="edit_pp">
                                <form encType="multipart/form-data" className="flex flex-col items-center">
                                    <img 
                                        src={profileImgSrc} 
                                        alt="dp" 
                                        className="pd-img w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-md -mt-14 md:-mt-16 bg-white"
                                        onError={(e) => { e.target.src = NoImage; }}
                                    />
                                    {isMainUser && (
                                        <>
                                            <input 
                                                type="file" 
                                                className="admin__input" 
                                                id="myFile" 
                                                name="testImage" 
                                                onChange={handleProfileImageUpload}
                                                style={{ display: 'none' }}
                                            />
                                            <label
                                                htmlFor="myFile"
                                                id="choose_pp"
                                                className="mt-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs cursor-pointer"
                                            >
                                                Choose image
                                            </label>
                                        </>
                                    )}
                                </form>
                            </div>
                            <div className="flex flex-col justify-end">
                                <h3 className="user_name text-lg sm:text-xl font-semibold flex items-center gap-2">
                                    {profileData.fname} <span> </span> {profileData.lname} 
                                    <img src="/user_profile/pictures/verified.png" id="verified_img" alt="verified" onError={(e) => e.target.style.display='none'} className="w-4 h-4" />
                                </h3>
                                <p className="work_title text-sm text-gray-600">{profileData.category}</p>
                                <div className="rating flex items-center gap-2 mt-1 text-sm text-gray-700">
                                    <p>Ratings:</p>
                                    <p id="user_rating" className="font-semibold">{profileData.rating ? Number(profileData.rating).toFixed(1) : '0.0'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pd-right flex items-center gap-2 mt-2 md:mt-0">
                        <button
                            type="button"
                            id="reviewbtn"
                            onClick={() => setIsReviewsOpen(true)}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-white text-xs sm:text-sm"
                        >
                            <img src="/user_profile/pictures/review.png" alt="review" onError={(e) => e.target.style.display='none'} className="w-4 h-4" />
                            Reviews
                        </button>
                        {isMainUser ? (
                            <button
                                type="button"
                                id="reportbtn"
                                onClick={() => setIsEditProfileOpen(true)}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs sm:text-sm"
                            >
                                <img src="/user_profile/pictures/edit.png" alt="edit" onError={(e) => e.target.style.display='none'} className="w-4 h-4" />
                                Edit profile
                            </button>
                        ) : (
                            <button
                                type="button"
                                id="reportbtn"
                                onClick={() => setIsReportOpen(true)}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-200 bg-red-50 text-xs sm:text-sm text-red-700"
                            >
                                <img src="/user_profile/pictures/report.png" alt="report" onError={(e) => e.target.style.display='none'} className="w-4 h-4" />
                                Report User
                            </button>
                        )}
                    </div>
                </div>

                <div className="profile-info mt-6 flex flex-col lg:flex-row gap-6">
                    <div className="info-col lg:w-5/12">
                        <div className="profile-intro bg-white rounded-xl shadow-sm p-4">
                            <h3 className="text-base font-semibold mb-2">Bio</h3>
                            <p id="profile_bio" className="text-sm text-gray-700">{profileData.bio || "No bio available"}</p>
                            <hr className="my-3" />
                            <h3 className="text-base font-semibold mb-2">Details</h3>
                            <ul className="space-y-1 text-sm text-gray-700">
                                <li><i className="fa-regular fa-envelope"></i>&nbsp; Email : <span>&nbsp;{profileData.email}</span></li>
                                <li><i className="fa-solid fa-phone"></i>&nbsp; Phone : <span>&nbsp;{profileData.phone}</span></li>
                                <li><i className="fa-solid fa-map-location-dot"></i>&nbsp; Division : <span>&nbsp;{profileData.division}</span></li>
                                <li><i className="fa-solid fa-location-dot"></i>&nbsp; District : <span>&nbsp;{profileData.district}</span></li>
                                <li><i className="fa-solid fa-location-crosshairs"></i>&nbsp; Police Station : <span>&nbsp;{profileData.station}</span></li>
                            </ul>
                            <hr className="my-3" />
                        </div>
                    </div>

                    <div className="post-col flex-1">
                        <div className="main_content bg-white rounded-xl shadow-sm p-4">
                            <h3 className="text-base font-semibold mb-3">Recent Posts:</h3>
                            <div className="post space-y-4">
                                {posts && posts.length > 0 ? posts.map(post => (
                                    <div className="post-content border border-gray-100 rounded-lg p-3" key={post._id}>
                                        <div className="heading flex items-start justify-between gap-2">
                                            <p
                                                onClick={() => setSelectedPost(post)}
                                                style={{ cursor: 'pointer' }}
                                                className="font-semibold text-sm text-gray-900"
                                            >
                                                {post.title}
                                            </p>
                                            {isMainUser && (
                                                <p>
                                                    <i 
                                                        className="fa-solid fa-trash-can text-sm text-red-600 cursor-pointer"
                                                        onClick={() => handleDeletePost(post._id)}
                                                    ></i>
                                                </p>
                                            )}
                                        </div>
                                        <div className="budget flex flex-wrap items-center gap-2 text-xs text-gray-600 mt-1">
                                            <p>Est. budget: {post.budget} BDT</p>
                                            <p>•</p>
                                            <p>Posted : {post.time_ago || new Date(post.time).toLocaleDateString()}</p>
                                        </div>
                                        <div className="details mt-2 text-sm text-gray-700">
                                            <p>
                                                {post.detail && post.detail.length > 100 
                                                    ? `${post.detail.substring(0, 100)}...` 
                                                    : post.detail}
                                            </p>
                                        </div>
                                        <div className="post_tag mt-2">
                                            <ul className="flex flex-wrap gap-2 text-xs">
                                                <li className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">{post.category}</li>
                                            </ul>
                                        </div>
                                        <div className="location flex items-center gap-1 mt-2 text-xs text-gray-600">
                                            <i className="fa-solid fa-location-dot"></i>
                                            <p>{post.division}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-sm text-gray-600">No posts available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PostDetailsModal 
                isOpen={!!selectedPost} 
                onClose={() => setSelectedPost(null)} 
                post={selectedPost} 
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

            {(isEditProfileOpen || isReviewsOpen || isReportOpen) && (
                <div className="overlay" onClick={() => {
                    setIsEditProfileOpen(false);
                    setIsReviewsOpen(false);
                    setIsReportOpen(false);
                }}></div>
            )}
        </div>
    );
};

export default ProfilePage;
