import React, { useState, useEffect } from 'react';
import api from '../services/api';

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [bio, setBio] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (user) {
            setBio(user.bio || '');
            setCategory(user.category || '');
        }
        fetchCategories();
    }, [user, isOpen]);

    const fetchCategories = async () => {
        try {
            const res = await api.post('/allcategory');
            setCategories(res.data);
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };

    const handleSave = async () => {
        if (!oldPassword && newPassword) {
            setStatus("Please enter old password to change password.");
            return;
        }

        setStatus("Updating...");
        try {
            // First verify old password if provided
            if (oldPassword) {
                // Ideally backend should verify this. The original code fetched user data and compared password in frontend!
                // This is insecure but we must preserve backend logic or improve it.
                // The original code:
                // const response = await fetch("/user_data", ...); const data = await response.json();
                // if(ops != data[0].password) ...
                
                const userRes = await api.post('/user_data', { id: user._id });
                if (userRes.data && userRes.data.length > 0) {
                    if (oldPassword !== userRes.data[0].password) {
                        setStatus("Password is Wrong!");
                        setTimeout(() => setStatus(""), 1000);
                        return;
                    }
                }
            }

            const payload = {
                id: user._id,
                password: newPassword || user.password, // Use existing if not changed
                bio: bio,
                category: category
            };

            // edit_user_info endpoint expects multipart/form-data according to routes/auth.js: 
            // router.post('/edit_user_info',upload.single('testImage'), edit_user_info)
            // But the controller accesses req.body.
            // Let's use FormData to be safe since the route uses multer.
            const formData = new FormData();
            formData.append('id', user._id);
            formData.append('password', newPassword || user.password); // Note: Original code sends password even if not changed?
            // Original code: if(nps == "") nps = data[0].password
            formData.append('bio', bio);
            formData.append('category', category);

            await api.post('/edit_user_info', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setStatus("");
            onUpdate(); // Refresh profile data
            onClose();
            
            // Reset fields
            setOldPassword('');
            setNewPassword('');

        } catch (err) {
            console.error("Error updating profile:", err);
            setStatus("Error updating profile.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="profile-section" style={{ display: 'block', visibility: 'visible' }}>
            <h2>Edit Profile</h2>
            <div className="close-button" onClick={onClose}>&#10005;</div>
            <div className="form-group">
                <label htmlFor="old-password">old-password: <span style={{ color: '#db0f0f' }}> *</span></label>
                <input 
                    type="password" 
                    id="old-password" 
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Your old password" 
                />
            </div>
            <div className="form-group">
                <label htmlFor="new-password">new-password:</label>
                <input 
                    type="password" 
                    id="new-password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Type new password" 
                />
            </div>
            <div className="form-group">
                <label htmlFor="bio">Bio:</label>
                <textarea 
                    id="bio" 
                    rows="4" 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                ></textarea>
            </div>
            <div className="form-group">
                <label htmlFor="jobTags">Category:</label>
                <input 
                    type="text" 
                    id="jobTags" 
                    list="category_list" 
                    autoComplete="off"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <datalist id="category_list">
                    {categories.map((cat, index) => (
                        <option key={index} value={cat.value} />
                    ))}
                </datalist>
            </div>
            <button className="btn-save" onClick={handleSave}>Save Changes</button>
            <div id="edit_status">
                <p>{status}</p>
            </div>
        </div>
    );
};

export default EditProfileModal;
