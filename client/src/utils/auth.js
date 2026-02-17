export const loginUser = (userdata) => {
    localStorage.setItem('user_id', userdata._id);
    if (userdata.img && userdata.img.data) {
        // Convert buffer to base64
        // Note: In the original code, it was doing a manual conversion.
        // Here we might need to handle it similarly or check the data format.
        // Assuming the backend sends the buffer in userdata.img.data.data
        try {
            const base64String = btoa(
                new Uint8Array(userdata.img.data.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ''
                )
            );
            localStorage.setItem('image', base64String);
            localStorage.setItem('imagetype', userdata.img.contentType);
        } catch (e) {
            console.error("Error processing image", e);
            localStorage.setItem('image', "");
            localStorage.setItem('imagetype', "");
        }
    } else {
        localStorage.setItem('image', "");
        localStorage.setItem('imagetype', "");
    }
};

export const logoutUser = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('image');
    localStorage.removeItem('imagetype');
};

export const getUserId = () => {
    return localStorage.getItem('user_id');
};
