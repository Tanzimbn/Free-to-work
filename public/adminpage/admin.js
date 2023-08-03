const toggleMenu = document.querySelector('.menu');

function logout() {
  window.location.href = "/";
}
function menuToggle() {
  toggleMenu.classList.toggle('active');
}
function ReviewToggle() {
  console.log("asce")
  var reviewpop = document.querySelector('.profile-page');
  reviewpop.classList.toggle('review-active');

  var closepop = document.querySelector('.rev_container');
  closepop.classList.toggle('review-active');
}
function ReportToggle() {
  var reviewpop = document.querySelector('.profile-page');
  reviewpop.classList.toggle('review-active');

  var report_pop = document.querySelector('.rep_container');
  report_pop.classList.toggle('review-active');

}
function categoryToggle() {
  var reviewpop = document.querySelector('.profile-page');
  reviewpop.classList.toggle('review-active');

  var report_pop = document.querySelector('.add_category');
  report_pop.classList.toggle('review-active');
}
function edittoggle() {
  var editpop = document.querySelector('.profile-page');
  editpop.classList.toggle('review-active');

  var editpop = document.querySelector('.profile-section');
  editpop.classList.toggle('review-active');

}
async function Accept(ev) {
  var user = ev.getAttribute("data-id")
  var reportid = ev.getAttribute("data-report")

  let options = {
    method: 'POST',
    body: JSON.stringify({
      id: user,
      reportid: reportid
    }),
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
  }
  const response = await fetch("/block_user", options);
  const data = await response.json();
  ev.parentNode.parentNode.remove()
}
async function Reject(ev) {
  var id = ev.getAttribute("data-report")
  
  let options = {
    method: 'POST',
    body: JSON.stringify({
      reportid: id
    }),
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
  }
  const response = await fetch("/report_process", options);
  const data = await response.json();
  ev.parentNode.parentNode.remove()
}
let category = [];

async function add_category(){
  const val = document.getElementById("filter-category").value

  if(val == "") return
  let options = {
    method: 'POST',
    body: JSON.stringify({
      value : val
    }),
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
  }
  const response = await fetch("/category", options);
  const resjson = await response.json()
  if(resjson.message == "Success")
  category.push(val)
  
  category_filter()
}


async function takecategory() {
  let options = {
    method: 'POST',
    body: JSON.stringify({
    }),
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
  }
  const allcategory = await fetch("/allcategory", options);
  const ans = await allcategory.json()

  for(let i = 0; i < ans.length; i++) {
    category.push(ans[i].value)
  }
}
takecategory()
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
    console.log("asas")
    const content = result.map((list)=>{
        return "<li>" + list + "</li>";
    });
    resultbox.innerHTML = "<ul>" + content.join('') + "</ul>";
}