// popup user image
function popupImage() {
    
    let url = localStorage.getItem("image");
    let type = localStorage.getItem("imagetype")
    
    if(url == "") return;

    document.querySelector(".nav_profile_img").src = `data:${type};base64,${url}`;
    document.querySelector(".popup_image").src = `data:${type};base64,${url}`;
}
popupImage()
// pp open
const toggleMenu = document.querySelector('.menu');
function menuToggle(){
    
    toggleMenu.classList.toggle('active');
}

// category filter 
let category = [];

async function load_category() {
    let options = {
        method: 'POST',
        body : JSON.stringify({
        }),
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
    }
    const response = await fetch("/allcategory", options);
    const data = await response.json();
    
    for(let i = 0; i < data.length; i++) {
        category.push(data[i].value)
    }
    category.sort()
}
load_category()

const resultbox = document.querySelector(".category-suggest");    
const inputbox = document.getElementById("filter-category");
function category_filter() {
    let result = [];
    let input = inputbox.value;
    if(input.length) {
        result = category.filter((keyword)=>{
            return keyword.toLowerCase().includes(input.toLowerCase());
        });    
    }
    left_display_category_result(result);
}
function left_show_all_category() {
    left_display_category_result(category);
}
function left_display_category_result(result){
    
    const content = result.map((list)=>{
        return "<li onclick = select_category(this)>" + list + "</li>";
    });
    resultbox.innerHTML = "<ul>" + content.join('') + "</ul>";
}
function select_category(list) {
    inputbox.value = list.innerHTML;
    resultbox.innerHTML = '';
}
function clear_price() {
    document.getElementById("filter-price-min").value = null;
    document.getElementById("filter-price-max").value = null;
}
function clear_category() {
    resultbox.innerHTML = '';
    document.getElementById("filter-category").value = null;
}

// post list part
function see_more(ev) {
    var par = ev.parentNode;
    var temp = par.getElementsByTagName("span");
    temp[0].style.display = "none";
    temp[1].style.display = "inline";
    var bt = par.getElementsByTagName("button");
    bt[0].style.display = "none";
    bt[1].style.display = "inline";

}
function see_less(ev) {
    var par = ev.parentNode;
    var temp = par.getElementsByTagName("span");
    temp[0].style.display = "inline";
    temp[1].style.display = "none";
    var bt = par.getElementsByTagName("button");
    bt[0].style.display = "inline";
    bt[1].style.display = "none";
    
}
async function detail_load(id) {
    let options = {
        method: 'POST',
        body : JSON.stringify({
            id: id
        }),
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
    }
    const response = await fetch("/post_detail", options);
    const data = await response.json();
    const time_limit = data.time_limit.split("T")
    const time_limit_time = time_limit[1].split(":")
    
    var finalDetail = data.detail.split("\n")
    var detailHtml = ""
    for(let i = 0; i < finalDetail.length; i++) {
        detailHtml += `<p>${finalDetail[i]}</p>`
    }

    document.getElementById("post_detail_title").innerHTML = data.title
    document.getElementById("post_detail_time_ago").innerHTML = `Time Limit: ${time_limit[0]} (${time_limit_time[0]}:${time_limit_time[1]})`
    document.getElementById("post_detail_budget").innerHTML = `Est. budget: ${data.budget} BDT`
    document.getElementById("post_detail_category").innerHTML = `${data.category}`
    document.getElementById("post_detail_division").innerHTML = `${data.division}`
    document.getElementById("post_detail_detail").innerHTML = detailHtml
    document.getElementById("bid_sumbit").dataset.id = id
    document.getElementById("best_bidder_name").innerHTML = data.max_bid_user_name
    if(data.max_bid_user_name == "No bid yet") {
        document.getElementById("best_bid_value").innerHTML = ""
        document.getElementById("best_bidder_name").dataset.id = ""
    }
    else {
        document.getElementById("best_bid_value").innerHTML = data.max_bid
        document.getElementById("best_bidder_name").dataset.id = data.max_bid_user
    }

}
function open_detail_late() {
    document.querySelector(".post_details").classList.add("open_details");
    document.querySelector("nav").classList.add("blur_active");
    document.querySelector(".advertise").classList.add("blur_active");
    document.querySelector(".container").classList.add("blur_active");
    document.querySelector(".profile-container").classList.add("blur_active");
}
function show_details(ev) {
    const id = ev.getAttribute("data-id");
    detail_load(id)
    setTimeout(open_detail_late, 1000);
    
}
function close_details() {
    document.querySelector("nav").classList.remove("blur_active");
    document.querySelector(".advertise").classList.remove("blur_active");
    document.querySelector(".container").classList.remove("blur_active");
    document.querySelector(".post_details").classList.remove("open_details");
    document.querySelector(".profile-container").classList.remove("blur_active");
}
function goto_post() {
    window.location.assign("../post_page/postbox.html");
}

function logout() {
    localStorage.removeItem('user_id')
    localStorage.removeItem('image')
    window.location.assign("/login");
    return false;
}

function show_best_bidder(ev) {
    const id = ev.getAttribute("data-id");
    if(id == "") return;
    window.location.assign(`/profile/${id}`);
}
function goto_landing() {
    window.location.assign(`/`);
}
function gotoNewsfeed() {
    window.location.assign(`/newsfeed`);
}
function gotoList() {
    window.location.assign(`/list`);
}

function show_post_popup() {
    console.log("as")
    document.querySelector(".post_popup").classList.remove("open_post_popup");
}
function takebreak() {
    document.querySelector("nav").classList.remove("nav_positive")
    document.querySelector("nav").classList.remove("nav_negative")
    document.querySelector(".alert_mess").style.display = "none"
}
function alert_mess(mess, state) {
    document.getElementById("alert_mess").innerHTML = mess
    if(state == 1) {
        document.querySelector("nav").classList.add("nav_positive")
        document.querySelector(".alert_mess").style.display = "inline"
        setTimeout(takebreak, 1000)
        
    }
    else {
        document.querySelector("nav").classList.add("nav_negative")
        document.querySelector(".alert_mess").style.display = "inline"
        setTimeout(takebreak, 2000)
    }
}
async function mood_toggle() {
    
    document.getElementById("mood_toggle").click()
    
    let options = {
        method: 'POST',
        body : JSON.stringify({
            check: document.getElementById("mood_toggle").checked
        }),
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
    }
    const response = await fetch("/update_mood", options);
    const data = await response.json();
    if(document.getElementById("mood_toggle").checked) {
        alert_mess("Free mood is on!", 1)
    }
    else {
        alert_mess("Work mood on! You won't get any notification of new post.", 0)
    }
    
}