var express = require('express');
var path = require('path')
const date = require('date-and-time')
require('dotenv').config();
var https = require('https');
var codes = {
    404: {
        code: "404 Not Found",
        icon: "🔌",
        status: "down",
        detail: "Website was not found/isn't running"
    },
    401: {
        code: "401 Unauthorised",
        icon: "🔒",
        status: "unknown",
        detail: "We don't have access to that website."
    },
    200: {
        code: "200 OK",
        icon: "✅",
        status: "up",
        detail: "Website is up and looks healthy"
    },
    500: {
        code: "500 Internal Server Error",
        icon: "🛠",
        status: "down",
        detail: "Website has some problems running smoothly."
    },
    521: {
        code: "522 Connection Timed Out",
        icon: "🌩",
        status: "partial",
        detail: "Cloudflare couldn't connect to that site."
    },
}
var statuses = {
    main_site: {
        certificate: {
            subject: "",
            issuer: {
                id: "",
                provider: ""
            },
            valid: {
                from: "",
                until: ""
            }
        },
        status: {
            code: 0,
            icon: "",
            status: "unknown",
            detail: ""
        },
        lastcheck: 0,
        formatedcheck: ""
    }
}

const app = express()
const port = process.env.PORT

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
    if ((Date.now() - statuses.main_site.lastcheck) >= 5000) {
        https.get('https://www.itoncek.cf/', function(r) {
            /*certificate.subject = JSON.parse(JSON.stringify(res.socket.getPeerCertificate().subject)).CN; // req.body = [Object: null prototype] { title: 'product' }
            certificate.issuer.id = JSON.parse(JSON.stringify(res.socket.getPeerCertificate().issuer)).CN;
            certificate.issuer.provider = JSON.parse(JSON.stringify(res.socket.getPeerCertificate().issuer)).O;
            certificate.valid.from = res.socket.getPeerCertificate().valid_from
            certificate.valid.until = res.socket.getPeerCertificate().valid_to*/
            statuses.main_site.certificate = {
                subject: JSON.parse(JSON.stringify(r.socket.getPeerCertificate().subject)).CN,
                issuer: {
                    id: JSON.parse(JSON.stringify(r.socket.getPeerCertificate().issuer)).CN,
                    provider: JSON.parse(JSON.stringify(r.socket.getPeerCertificate().issuer)).O
                },
                valid: {
                    from: r.socket.getPeerCertificate().valid_from,
                    until: r.socket.getPeerCertificate().valid_to
                }
            }
            var code = r.statusCode.toString();
            if (code.startsWith(2)) {
                statuses.main_site.status = codes[200];
            } else if (code.startsWith(4)) {
                if (code != 404) {
                    statuses.main_site.status = codes[401];
                } else {
                    statuses.main_site.status = codes[404];
                }
            } else if (code.startsWith(5)) {
                if (code != 521) {
                    statuses.main_site.status = codes[500];
                } else {
                    statuses.main_site.status = codes[512];
                }
            } else {
                statuses.main_site.status = codes[200];
            }

            statuses.main_site.lastcheck = new Date();
            statuses.main_site.formatedcheck = date.format(statuses.main_site.lastcheck, 'dddd DD YYYY, HH:mm:ss')

            res.render('index', statuses.main_site);
            console.log(statuses)
        }).on('error', function(e) {
            console.error(e);
            res.redirect('https://itoncek.cf')
        });
    } else {
        res.render('index', statuses.main_site);
        console.log("cached")
    }
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})