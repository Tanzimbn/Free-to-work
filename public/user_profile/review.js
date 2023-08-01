function review_noti(mes) {
    document.getElementById('review_status').innerHTML = mes
    setTimeout(function(){
        document.getElementById("review_status").innerHTML="";
    },1000);
}

async function review_submit(ev) {
    console.log("ashce")
    var text = document.querySelector('#review_text').value;
    var rating  = document.querySelector('#give_rating').value;
    var reviewer_name  = document.querySelector('#nav_user_name').innerHTML;
    var user = ev.getAttribute("data-id")
    let options = {
        method: 'POST',
        body : JSON.stringify({
            id: user,
            reviewer: reviewer_name,
            text: text,
            rating: rating
        }),
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
    }
    const response = await fetch("/review", options);
    const data = await response.json();
    
    review_noti(data.message)
    
    if(data.message == "Review Added!") {
        let html = `<div class="review">
                        <div class="user-info">
                            <span class="user-name">${reviewer_name}</span>
                            <span class="user-rating">${rating}/5</span>
                        </div>
                        <div class="user-comment">
                            <p>${text}</p>
                        </div>
                    </div>`
        
        console.log(data.rating)
        document.querySelector('#user_rating').innerHTML = data.rating
        html += document.querySelector('.reviews').innerHTML
        document.querySelector('.reviews').innerHTML = html

        document.querySelector('#review_text').value = null;
        document.querySelector('#give_rating').value = "";
        ReviewToggle()
    }
}