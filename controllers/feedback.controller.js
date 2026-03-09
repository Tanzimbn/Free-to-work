const feedbackModel = require("../models/feedback")

exports.feedback = async (req, res) => {
    try {
        const new_feedback = new feedbackModel({
            email: req.body.email,
            message: req.body.message
        })
        const post_res = await new_feedback.save()
        // res.redirect("/")
        res.json({ success: true, message: "Feedback submitted successfully" });

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
}
