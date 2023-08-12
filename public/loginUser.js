async function loginUser(userdata) {
    
    localStorage.setItem('user_id', userdata._id)
    if(userdata.hasOwnProperty("img")) {
        let loginUserImage = btoa(new Uint8Array(userdata.img.data.data).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
        }, ''));
        localStorage.setItem('image', loginUserImage)
        localStorage.setItem('imagetype', userdata.img.contentType)
    }
    else {
        localStorage.setItem('image', "")
        localStorage.setItem('imagetype', "")
    }
    
}