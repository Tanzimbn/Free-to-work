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
function opennoti() {
    

    toast.classList.add("active");
    progress.classList.add("active");
  
    timer1 = setTimeout(() => {
      toast.classList.remove("active");
    }, 2000); //1s = 1000 milliseconds
  
    timer2 = setTimeout(() => {
      progress.classList.remove("active");
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
        opennoti();
    }
    else {
        localStorage.setItem('user_id', data.id)
        loginUser(data.id)
        window.location.assign("./newsfeed");
    }
    
})


