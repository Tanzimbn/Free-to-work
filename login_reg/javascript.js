function goto_home() {
    window.location.assign("../home/landingpage.html");
}
let signupConent = document.querySelector(".signup-form-container"),
    stagebtn1b = document.querySelector(".stagebtn1b"),
    stagebtn2a = document.querySelector(".stagebtn2a"),
    stagebtn2b = document.querySelector(".stagebtn2b"),
    stagebtn3a = document.querySelector(".stagebtn3a"),
    stagebtn3b = document.querySelector(".stagebtn3b"),
    signupContent1 = document.querySelector(".stage1-content"),
    signupContent2 = document.querySelector(".stage2-content"),
    signupContent3 = document.querySelector(".stage3-content"),
    popup = document.getElementById("popup");

signupContent2.style.display = "none"
signupContent3.style.display = "none"

function stage1to2() {
    // let  nid = document.getElementById("nid").value;
    // if(nid.length != 10) {
    //     alert("NId wrong");
    //     return;
    // }
    signupContent1.style.display = "none"
    signupContent3.style.display = "none"
    signupContent2.style.display = "block"
    document.querySelector(".stageno-1").innerText = "✔"
    document.querySelector(".stageno-1").style.backgroundColor = "#52ec61"
    document.querySelector(".stageno-1").style.color = "#fff"
}
function stage2to1() {
    signupContent1.style.display = "block"
    signupContent3.style.display = "none"
    signupContent2.style.display = "none"
    document.querySelector(".stageno-1").innerText = "1"
    document.querySelector(".stageno-1").style.backgroundColor = "#f5f5f9"
    document.querySelector(".stageno-1").style.color = "#000000"
}
function stage2to3() {
    signupContent1.style.display = "none"
    signupContent3.style.display = "block"
    signupContent2.style.display = "none"
    document.querySelector(".stageno-2").innerText = "✔"
    document.querySelector(".stageno-2").style.backgroundColor = "#52ec61"
    document.querySelector(".stageno-2").style.color = "#fff"
}
function stage3to2() {
    signupContent1.style.display = "none"
    signupContent3.style.display = "none"
    signupContent2.style.display = "block"
    document.querySelector(".stageno-2").innerText = "2"
    document.querySelector(".stageno-2").style.backgroundColor = "#f5f5f9"
    document.querySelector(".stageno-2").style.color = "#000000"
}
function openpopup(){
    popup.classList.add("open-popup")
}
function verify() {
    let p1 = document.getElementById("password").value;
    let p2 = document.getElementById("confirmpassword").value;
    if(p1 != p2) {
        alert("WA");
    }
    popup.classList.add("open-popup")
    return false;
}
function closepopup() {
    popup.classList.remove("open-popup");
    window.location.assign("index.html");
}
