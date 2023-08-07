const postModel = require("../models/post");
const { tm } = require("./allpost.controller");

exports.post_filter = async (req, res) => {
    const post = await postModel.find({});
    const allpost = []
    const time_ago = []


    for(let i = 0; i < post.length; i++) {
        if(req.body.price_min != "" && parseInt(req.body.price_min) > post[i].budget) {
            continue;
        }
        if(req.body.price_max != "" && parseInt(req.body.price_max) < post[i].budget) {
            continue;
        }
        if(req.body.division != "" && req.body.division != post[i].division) {
            continue;
        }
        if(req.body.district != "" && req.body.district != post[i].district) {
            continue;
        }
        if(req.body.station != "" && req.body.station != post[i].station) {
            continue;
        }
        if(req.body.category != "" && req.body.category != post[i].category) {
            continue;
        }
        if(req.body.searchValue != "" && post[i].title.toLowerCase().search(req.body.searchValue) == -1) {
            continue;
        }
        time_ago.push(tm.format(post[i].time))
        allpost.push({post : post[i], time_ago : tm.format(post[i].time)})
    }
    allpost.reverse()
    time_ago.reverse()
    res.json(allpost)
}
