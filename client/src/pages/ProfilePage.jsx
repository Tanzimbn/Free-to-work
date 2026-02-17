import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthNavbar from '../components/AuthNavbar';
import PostDetailsModal from '../components/PostDetailsModal';
import EditProfileModal from '../components/EditProfileModal';
import ReviewsModal from '../components/ReviewsModal';
import ReportUserModal from '../components/ReportUserModal';
import './ProfilePage.css';

// Default images
import NoImage from '../../public/pictures/Noimage.png';
// We might not have the exact path for cover placeholder, let's use a generic one or handle error
// The HBS used: /user_profile/pictures/1600w-qt_TMRJF4m0.webp

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

    if (loading) return <div>Loading...</div>;
    if (!profileData) return <div>Profile not found</div>;

    return (
        <div className="profile-page">
            <AuthNavbar />
            <div className="advertise"></div>
            
            <div className="profile-container">
                <form encType="multipart/form-data">
                    {coverImgSrc ? (
                        <img src={coverImgSrc} className="cover-img" alt="coverimage" onError={(e) => {e.target.style.display='none'}} />
                    ) : (
                        <div className="cover-img" style={{ backgroundColor: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                            <label htmlFor="mycoverFile" id="choose_cp"> Choose image </label>
                        </>
                    )}
                </form>

                <div className="profile-details">
                    <div className="pd-left">
                        <div className="pd-row">
                            <div className="edit_pp">
                                <form encType="multipart/form-data">
                                    <img 
                                        src={profileImgSrc} 
                                        alt="dp" 
                                        className="pd-img" 
                                        onError={(e) => {e.target.src = NoImage}}
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
                                            <label htmlFor="myFile" id="choose_pp">Choose image</label>
                                        </>
                                    )}
                                </form>
                            </div>
                            <div>
                                <h3 className="user_name">
                                    {profileData.fname} <span> </span> {profileData.lname} 
                                    <img src="/user_profile/pictures/verified.png" id="verified_img" alt="verified" onError={(e) => e.target.style.display='none'} />
                                </h3>
                                <p className="work_title">{profileData.category}</p>
                                <div className="rating">
                                    <p>Ratings:</p>
                                    <p id="user_rating">{profileData.rating ? Number(profileData.rating).toFixed(1) : '0.0'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pd-right">
                        <button type="button" id="reviewbtn" onClick={() => setIsReviewsOpen(true)}>
                            <img src="/user_profile/pictures/review.png" alt="review" onError={(e) => e.target.style.display='none'} />Reviews
                        </button>
                        {isMainUser ? (
                            <button type="button" id="reportbtn" onClick={() => setIsEditProfileOpen(true)}>
                                <img src="/user_profile/pictures/edit.png" alt="edit" onError={(e) => e.target.style.display='none'} />Edit profile
                            </button>
                        ) : (
                            <button type="button" id="reportbtn" onClick={() => setIsReportOpen(true)}>
                                <img src="/user_profile/pictures/report.png" alt="report" onError={(e) => e.target.style.display='none'} />Report User
                            </button>
                        )}
                    </div>
                </div>

                <div className="profile-info">
                    <div className="info-col">
                        <div className="profile-intro">
                            <h3>Bio-</h3>
                            <p id="profile_bio">{profileData.bio || "No bio available"}</p>
                            <hr />
                            <h3>Details</h3>
                            <ul>
                                <li><i className="fa-regular fa-envelope"></i>&nbsp; Email : <span>&nbsp;{profileData.email}</span></li>
                                <li><i className="fa-solid fa-phone"></i>&nbsp; Phone : <span>&nbsp;{profileData.phone}</span></li>
                                <li><i className="fa-solid fa-map-location-dot"></i>&nbsp; Division : <span>&nbsp;{profileData.division}</span></li>
                                <li><i className="fa-solid fa-location-dot"></i>&nbsp; District : <span>&nbsp;{profileData.district}</span></li>
                                <li><i className="fa-solid fa-location-crosshairs"></i>&nbsp; Police Station : <span>&nbsp;{profileData.station}</span></li>
                            </ul>
                            <hr />
                        </div>
                    </div>

                    <div className="post-col">
                        <div className="main_content">
                            <h3>Recent Posts:</h3>
                            <div className="post">
                                {posts && posts.length > 0 ? posts.map(post => (
                                    <div className="post-content" key={post._id}>
                                        <div className="heading">
                                            <p onClick={() => setSelectedPost(post)} style={{ cursor: 'pointer' }}>{post.title}</p>
                                            {isMainUser && (
                                                <p>
                                                    <i 
                                                        className="fa-solid fa-trash-can" 
                                                        style={{ color: '#db0f0f', cursor: 'pointer' }}
                                                        onClick={() => handleDeletePost(post._id)}
                                                    ></i>
                                                </p>
                                            )}
                                        </div>
                                        <div className="budget">
                                            <p>Est. budget: {post.budget} BDT</p>
                                            <p>.</p>
                                            <p>Posted : {post.time_ago || new Date(post.time).toLocaleDateString()}</p>
                                        </div>
                                        <div className="details">
                                            <p>
                                                {post.detail && post.detail.length > 100 
                                                    ? `${post.detail.substring(0, 100)}...` 
                                                    : post.detail}
                                            </p>
                                        </div>
                                        <div className="post_tag">
                                            <ul>
                                                <li>{post.category}</li>
                                            </ul>
                                        </div>
                                        <div className="location">
                                            <i className="fa-solid fa-location-dot"></i>
                                            <p>{post.division}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p>No posts available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
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
            
            {/* Overlay for blurring background when modals are open - Optional, can be handled by CSS classes on body */}
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
