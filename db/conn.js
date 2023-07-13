const mongoose = require("mongoose");

const url = process.env.DATABASE;
async function connect() {
    
    try {
        await mongoose.connect(url);
        console.log("DB connected");
    } catch (error) {
        console.error(error);
    }
}
connect();