

function goto_home() {
    window.location.assign("/");
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

const toast = document.querySelector(".toast");
    closeIcon = document.querySelector(".close"),
    progress = document.querySelector(".progress");
    let timer1, timer2;
// notification part
closeIcon.addEventListener("click", () => {
    toast.classList.remove("active");
  
    setTimeout(() => {
      progress.classList.remove("active");
    }, 300);
  
    clearTimeout(timer1);
    clearTimeout(timer2);
});
function opennoti(mes) {
    document.querySelector(".text-2").innerHTML  = mes;
    toast.classList.add("active");
    progress.classList.add("active");
  
    timer1 = setTimeout(() => {
      toast.classList.remove("active");
    }, 2000); //1s = 1000 milliseconds
  
    timer2 = setTimeout(() => {
      progress.classList.remove("active");
    }, 2300);


}
async function stage1to2() {
    let p1 = document.getElementById('nid').value;
    let options = {
        method: 'POST',
        body : JSON.stringify({
            fname: document.getElementById('fname').value,
            nid : p1,
        }),
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
    }
    const response = await fetch("/register/form1", options);
    const data = await response.json();
    const val = data.message;
    console.log(val)
    if(val != "Valid") {
        opennoti(val);
        return;
    }
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
async function stage2to3() {
    let  email = document.getElementById("email").value;
    let options = {
        method: 'POST',
        body : JSON.stringify({
            email : email,
            Station : document.getElementById("polic_sta").value,
            phone:  document.getElementById("phone").value
        }),
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
    }
    const response = await fetch("/register/form2", options);
    const data = await response.json();
    const val = data.message;
    console.log(val)
    if(val != "Valid") {
        opennoti(val);
        return;
    }
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

