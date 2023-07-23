async function img() {

    let givenId = document.querySelector(".pd-img").getAttribute('data-givenId')
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
    let val = btoa(new Uint8Array(responseJson[0].img.data.data).reduce(function (data, byte) {
        return data + String.fromCharCode(byte);
    }, ''));
    let html = `<img src = "data:${responseJson[0].img.contentType};base64,${val}" alt="dp" class="pd-img">`;
    document.querySelector(".pd-img").src = `data:${responseJson[0].img.contentType};base64,${val}`;
}
img();

function delete_post(ev) {
    const id = ev.getAttribute("data-id");
    let text;
    if (confirm("Do you want to delete this post ?") == true) {
        text = "You pressed OK!";
        // let result = await 
    } else {
        text = "You canceled!";
    }
    console.log(text)
    // detail_load(id)
    // setTimeout(open_detail_late, 1000);
}
