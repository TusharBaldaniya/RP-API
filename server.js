const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
//mongoose.connect(process.env.DATABASE_LOCAL, {
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('Success');
}).catch(doc => {
    console.log(`Error` + doc);
})

const port = 3000;
app.listen(port, () => {
    console.log(`# Connected on port ${port} #`)
})