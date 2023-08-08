function goto_home() {
    window.location.assign("/");
}

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
function opennoti(mess, state) {
    
    document.querySelector(".text-2").innerHTML = mess
    if(state == "1") {
        document.querySelector(".toast-content i").classList.remove("fa-exclamation")
        document.querySelector(".toast-content i").classList.add("fa-check")
        document.querySelector(".text-1").innerHTML = "Success"
    }
    
    
    toast.classList.add("active");
    progress.classList.add("active");
  
    timer1 = setTimeout(() => {
      toast.classList.remove("active");
    }, 2000); //1s = 1000 milliseconds
  
    timer2 = setTimeout(() => {
      progress.classList.remove("active");
      document.querySelector(".text-1").innerHTML = "Error"
      document.querySelector(".fa-solid").classList.add("fa-exclamation")
      document.querySelector(".toast-content i").classList.remove("fa-check")
    }, 2300);
    

}

// verification part
const form = document.getElementById("login_form")
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let p1 = document.getElementById('email').value;
    let p2 = document.getElementById('password').value;
    let options = {
        method: 'POST',
        body : JSON.stringify({
            email : p1,
            password : p2
        }),
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
    }
    const response = await fetch("/login", options);
    const data = await response.json();
    if(data.message == "admin") {
        window.location.assign("./admin");
    }
    else if(data.message == "Email or Password is incorrect") {
        opennoti(data.message, 0);
    }
    else {
        localStorage.setItem('user_id', data.userdata.id)
        loginUser(data.userdata)
        window.location.assign("./newsfeed");
    }
    
})


function forgetPasswordToggle() {
    document.querySelector('.container').classList.toggle('review-active');

    document.querySelector('.forget_password_popup').classList.toggle('review-active');
}

document.querySelector('.change_password_form').addEventListener('submit', async function(e) {
    e.preventDefault()
    let email =  document.getElementById('change_password').value;
    let options = {
        method: 'POST',
        body : JSON.stringify({
            email : email
        }),
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
    }
    const response = await fetch("/change_password", options);
    let message = await response.json()
    opennoti(message.message, message.state)
    if(message.state == "1")
    forgetPasswordToggle()
})

function show_password() {
    
    if(document.getElementById("password").type == "text") {
        document.getElementById("password").type = "password"
        document.getElementById("password_hide").classList.remove("fa-eye")
        document.getElementById("password_hide").classList.add("fa-eye-slash")
    }
    else {
        document.getElementById("password").type = "text"
        document.getElementById("password_hide").classList.add("fa-eye")
        document.getElementById("password_hide").classList.remove("fa-eye-slash")
    }

    
}
