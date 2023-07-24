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

function ReviewToggle(){
    var reviewpop= document.querySelector('.profile-page');
    reviewpop.classList.toggle('review-active');

    var closepop= document.querySelector('.rev_container');
    closepop.classList.toggle('review-active');
}
function ReportToggle(){
    var reviewpop= document.querySelector('.profile-page');
    reviewpop.classList.toggle('review-active');

    var report_pop= document.querySelector('.rep_container');
    report_pop.classList.toggle('review-active');

}
var darkicon = document.getElementById('darkicon');
darkicon.onclick = function(){
    document.body.classList.toggle("dark-theme");
    if(document.body.classList.contains("dark-theme")){
        darkicon.src = "src/switch-off.png";
    }
    else{
        darkicon.src ="src/switch-on.png";
    }
}