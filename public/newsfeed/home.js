// async function userinfo () {
//     let options = {
//         method: 'POST',
//         body : JSON.stringify({
//             id: localStorage.user_id
//         }),
//         headers: {
//             "Content-Type": "application/json;charset=UTF-8"
//         },
//     }
//     const response = await fetch("/user_info", options);
//     const data = await response.json();
//     console.log(data)
//     document.getElementById("nav_user_name").innerHTML = data.fname + data.lname
//     document.getElementById("nav_user_category").innerHTML = data.category
// }
// userinfo()
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
    document.getElementById("post_detail_title").innerHTML = data.title
    document.getElementById("post_detail_time_ago").innerHTML = data.time_ago
    document.getElementById("post_detail_budget").innerHTML = `Est. budget: ${data.budget}BDT`
    document.getElementById("post_detail_category").innerHTML = `${data.category}`
    document.getElementById("post_detail_division").innerHTML = `${data.division}`
    document.getElementById("post_detail_detail").innerHTML = `${data.detail}`


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

