let login_menu = document.getElementById("login-menu");
function show_menu() {
    login_menu.classList.toggle("open-menu");
}
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
function see_more() {
    var dots = document.getElementById("dots");
    var moreText = document.getElementById("more_details");
    dots.style.display = "none";
    moreText.style.display = "inline";
    document.getElementById("see_more").style.display = "none";
    document.getElementById("see_less").style.display = "inline";
}
function see_less() {
    document.getElementById("dots").style.display = "inline";
    document.getElementById("more_details").style.display = "none";
    document.getElementById("see_more").style.display = "inline";
    document.getElementById("see_less").style.display = "none";
}
function show_details() {
    // document.querySelector(".post_details").style.display = "flex";
    // document.querySelector(".details_content").style.width = "75%";
    document.querySelector(".post_details").classList.add("open_details");
}
function close_details() {
    document.querySelector(".post_details").classList.remove("open_details");
}
function goto_post() {
    window.location.assign("post.html");
}

