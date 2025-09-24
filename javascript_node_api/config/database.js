const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/node-list', {
}).then(() => console.log("MongoDB connected successfully!")).catch((err) => console.log(err))