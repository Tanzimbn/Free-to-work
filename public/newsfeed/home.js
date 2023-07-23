
// pp open
const toggleMenu = document.querySelector('.menu');
function menuToggle(){
    
    toggleMenu.classList.toggle('active');
}

// category filter 
let category = ['Ac repair', 'Appliance repair', 'Electrician', "Driver", "Pickup & Trucks", "Cleaning & Pest Control", "Painting", "Carpentry"];
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
    display_category_result(result);
}
function show_all_category() {
    display_category_result(category);
}
function display_category_result(result){
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
    console.log(id)
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

    document.getElementById("post_detail_title").innerHTML = data.title
    document.getElementById("post_detail_time_ago").innerHTML = `Time Limit: ${time_limit[0]} (${time_limit_time[0]}:${time_limit_time[1]})`
    document.getElementById("post_detail_budget").innerHTML = `Est. budget: ${data.budget} BDT`
    document.getElementById("post_detail_category").innerHTML = `${data.category}`
    document.getElementById("post_detail_division").innerHTML = `${data.division}`
    document.getElementById("post_detail_detail").innerHTML = data.detail
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
}
function show_details(ev) {
    const id = ev.getAttribute("data-id");
    detail_load(id)
    setTimeout(open_detail_late, 1000);
    
}
function close_details() {
    document.querySelector(".post_details").classList.remove("open_details");
}
function goto_post() {
    window.location.assign("../post_page/postbox.html");
}

function logout() {
    localStorage.removeItem('user_id')
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