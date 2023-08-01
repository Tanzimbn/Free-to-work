async function loginUser(givenId) {

    let options = {
        method: 'POST',
        body : JSON.stringify({
            id : givenId
        }),
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
    }
    const response = await fetch("/user_data", options);
    const responseJson = await response.json();
    if(responseJson[0].hasOwnProperty("img")) {
        loginUserImage = btoa(new Uint8Array(responseJson[0].img.data.data).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
        }, ''));
        localStorage.setItem('image', loginUserImage)
        localStorage.setItem('imagetype', responseJson[0].img.contentType)
    }
    else {
        localStorage.setItem('image', "")
        localStorage.setItem('imagetype', "")
    }
    
}