const mongoose = require('mongoose')

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://NamasteNodeJS:UEvuGihvtkuGm2ZS@namastenodejs.mhsfcdx.mongodb.net/devTinder', {
        family: 4, // Force IPv4 connection
        serverSelectionTimeoutMS: 5000, // try connect in 5s, default is 30s, this for making debugginh better by getting errors fast.
    })
}

module.exports = connectDB;