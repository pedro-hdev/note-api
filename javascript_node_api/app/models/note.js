const mongoose = require('mongoose')


const nodeSchema = new mongoose.Schema({
    title: String,
    body: String,

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
    { timestamps: true }
)

module.exports = mongoose.model('Note', nodeSchema)