var express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
var status = {
    icon: "❌",
    state: "down",
    status: "418 I'm a teapot",
    reason: "no data yet"
}
const DataInput = mongoose.Schema;
const DataInputModel = new DataInput({
    status: String
});

const app = express()
const port = 12345
await mongoose.connect(process.env.MONGO_URL);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
    res.render('index', status);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

function checkStatus() {

}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})