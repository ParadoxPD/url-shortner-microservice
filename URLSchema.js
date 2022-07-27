const {
    Schema
} = require('mongoose')

// Model
const URLSchema = new Schema({
    original: {
        type: String,
        required: true
    },
    short: {
        type: Number,
        required: true
    }
});

module.exports = URLSchema;