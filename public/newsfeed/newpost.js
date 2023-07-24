async function make_post() {
    const jobTitle = document.getElementById("jobTitle").value;
    const jobDescription = document.getElementById("jobDescription").value;
    const jobBudget = document.getElementById("jobBudget").value;
    const jobDeadline = document.getElementById("jobDeadline").value;
    const jobTags = document.getElementById("jobTags").value;
    const post_divisions = document.getElementById("post_divisions").value;
    const post_distr = document.getElementById("post_distr").value;
    const post_polic_sta = document.getElementById("post_polic_sta").value;
    let options = {
        method: 'POST',
        body : JSON.stringify({
            title: jobTitle,
            detail: jobDescription,
            category: jobTags,
            budget: jobBudget,
            time: jobDeadline,
            division: post_divisions,
            district: post_distr,
            station: post_polic_sta
        }),
        headers: {
            "Content-Type": "application/json;charset=UTF-8"
        },
    }
    const response = await fetch("/post", options);
    const data = await response.json();
    apply_filter();
    close_post_popup();
}