let post_pos = 0
let allpostData

async function apply_filter() {
    const price_min = document.getElementById('filter-price-min').value,
    price_max = document.getElementById('filter-price-max').value,
    division = document.getElementById('divisions').value,
    district = document.getElementById('distr').value,
    station = document.getElementById('polic_sta').value,
    category = document.getElementById('filter-category').value,
    searchValue = document.getElementById('searchValue').value
    
    let options = {
        method: 'POST',
        body : JSON.stringify({
            price_min: price_min,
            price_max: price_max,
            division: division,
            district: district,
            station: station,
            category: category,
            searchValue : searchValue.toLowerCase()
        }),
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
    }
    const response = await fetch("/post_filter", options);
    allpostData = await response.json();
    

    // // sort part
    const sorton = document.getElementById('sort_type').value
    const sortdir = document.getElementById('sort_order').value
    if(sorton == "Date") {
        if(sortdir == "Descending") {
            allpostData.reverse()
        } 
    }
    else {
        if(sortdir == "Ascending") {
            allpostData.sort((a, b) => {
                return a.post.budget - b.post.budget
            })
        }
        else {
            allpostData.sort((a, b) => {
                return b.post.budget - a.post.budget
            })
        }
    }
    
    post_pos = 0
    document.querySelector('.post').innerHTML = ""
    load_more_post()
}

function load_more_post() {
    document.querySelector('.load_more').style.display = "inherit"
    
    let html = ""
    
    for(let i = 0; i < 10 && post_pos < allpostData.length; i++, post_pos++) {
        
        let detail_part1 = "", detail_part2 = "", len = allpostData[post_pos].post.detail.length
        if(len >= 200)
        detail_part1 = allpostData[post_pos].post.detail.substring(0, 200)
        else
        detail_part1 = allpostData[post_pos].post.detail.substring(0, len)

        if(len > 200)
        detail_part2 = allpostData[post_pos].post.detail.substring(200)


        html += `<div class="post-content">
                        <div class="heading" onclick="show_details(this)" data-id="${allpostData[post_pos].post._id}">
                            <p>${allpostData[post_pos].post.title}</p>
                        </div>
                        <div class="budget">
                            <p>Est. budget: ${allpostData[post_pos].post.budget} BDT</p>
                            <p>.</p>
                            <p>Posted : ${allpostData[post_pos].time_ago}</p>
                        </div>
                        <div class="details">
                            <p>${detail_part1}<span id="dots"> ...</span><button onclick="see_more(this)"
                                    id="see_more">more</button><span id="more_details">${detail_part2}</span>
                                <button onclick="see_less(this)" id="see_less">see less</button>
                            </p>
                        </div>
                        <div class="post_tag">
                            <ul>
                                <li>${allpostData[post_pos].post.category}</li>
                            </ul>
                        </div>
                        <div class="location">
                            <i class="fa-solid fa-location-dot"></i>
                            <p>${allpostData[post_pos].post.division}</p>
                        </div>
                    </div>`
    }
    document.querySelector('.post').innerHTML += html
    if(allpostData.length == post_pos) {
        document.querySelector('.load_more').style.display = "none"
    }
}

async function update_allpost() {
    const price_min = "",
    price_max = "",
    division = "",
    district = "",
    station = "",
    category = "",
    searchValue = ""
    
    let options = {
        method: 'POST',
        body : JSON.stringify({
            price_min: price_min,
            price_max: price_max,
            division: division,
            district: district,
            station: station,
            category: category,
            searchValue : searchValue.toLowerCase()
        }),
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
    }
    const response = await fetch("/post_filter", options);
    allpostData = await response.json();
    
}

apply_filter()

