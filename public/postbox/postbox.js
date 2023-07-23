document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("jobPostForm");
    form.addEventListener("submit", handleSubmit);
});

function handleSubmit(event) {
    event.preventDefault();

    const jobTitle = document.getElementById("jobTitle").value;
    const jobDescription = document.getElementById("jobDescription").value;
    const jobBudget = document.getElementById("jobBudget").value;
    const jobDeadline = document.getElementById("jobDeadline").value;
    const jobTags = document.getElementById("jobTags").value;
    const jobLocation = document.getElementById("jobLocation").value;


    const postData = {
        title: jobTitle,
        description: jobDescription,
        budget: jobBudget,
        deadline: jobDeadline,
        tags: jobTags,
        location: jobLocation
    };

    alert(JSON.stringify(postData));
}
