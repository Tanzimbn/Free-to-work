async function img() {
    let url = localStorage.getItem('image');
    let type = localStorage.getItem("imagetype")
    if(url != "") {
        document.querySelector(".nav_profile_img").src = `data:${type};base64,${url}`;
        document.querySelector(".popup_image").src = `data:${type};base64,${url}`;
    }
    
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
    if(responseJson[0].hasOwnProperty("img")) {
        let val = btoa(new Uint8Array(responseJson[0].img.data.data).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
        }, ''));
        // let html = `<img src = "data:${responseJson[0].img.contentType};base64,${val}" alt="dp" class="pd-img">`;
        document.querySelector(".pd-img").src = `data:${responseJson[0].img.contentType};base64,${val}`;
    }
    else {
        document.querySelector(".pd-img").src = "../pictures/Noimage.png";
    }
    
}
img();

async function coverimg() {
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
    const response = await fetch("/cover_data", options);
    const responseJson = await response.json();
    if(responseJson.length == 0) {
        document.querySelector(".cover-img").src = "/user_profile/pictures/1600w-qt_TMRJF4m0.webp"
        return
    }
    let val = btoa(new Uint8Array(responseJson[0].cover.data.data).reduce(function (data, byte) {
        return data + String.fromCharCode(byte);
    }, ''));
    document.querySelector(".cover-img").src = `data:${responseJson[0].cover.contentType};base64,${val}`;
}
coverimg();

async function delete_post(ev) {
    const id = ev.getAttribute("data-id");
    if (confirm("Do you want to delete this post ?") == true) {
        let options = {
            method: 'POST',
            body : JSON.stringify({
                id : id
            }),
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
        }
        const response = await fetch("/delete_post", options);
        let givenid = document.querySelector(".pd-img").getAttribute('data-givenId')
        window.location.replace(`/profile/${givenid}`);
    }
}

function ReviewToggle(){
    var reviewpop= document.querySelector('.profile-page');
    reviewpop.classList.toggle('review-active');
    console.log("achs")
    var closepop= document.querySelector('.rev_container');
    closepop.classList.toggle('review-active');
}
function ReportToggle(){
    var reviewpop= document.querySelector('.profile-page');
    reviewpop.classList.toggle('review-active');

    var report_pop= document.querySelector('.rep_container');
    report_pop.classList.toggle('review-active');

}
function editToggle(){

    var report_pop= document.querySelector('.profile-section');
    report_pop.classList.toggle('review-active');
    console.log("asa")
    var reviewpop= document.querySelector('.profile-page');
    reviewpop.classList.toggle('review-active');

}


