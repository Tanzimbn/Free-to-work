
async function submit_bid (ev) {

    let id = ev.getAttribute("data-id")
    let max_bid = document.getElementById('best_bid_value').innerHTML
    let new_bid = document.getElementById("bid_value").value
    if(new_bid == "") new_bid = "0"
    if(max_bid == "" || parseInt(new_bid) < parseInt(max_bid)) {
        let new_options = {
            method: 'POST',
            body : JSON.stringify({
                id: id,
                new_bid: new_bid,
                new_user_name : document.getElementById('nav_user_name').innerHTML
            }),
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
        }
        response = await fetch("/update_bid", new_options);
        data = await response.json();
        if(data.user_id == "-1") return;
        if(data.user_id == "-2") {
            alert("Bidding time ended!");
            return;
        }
        document.getElementById("best_bidder_name").dataset.id = data.user_id
        document.getElementById("best_bidder_name").innerHTML = document.getElementById('nav_user_name').innerHTML
        document.getElementById("best_bid_value").innerHTML = new_bid
        document.getElementById("bid_value").value = null
    }
}