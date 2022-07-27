const mongoose = require('mongoose')

let connection
try {
    connection = mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Connected To Database")
} catch (err) {
    console.log(err)
}

module.exports = connection;