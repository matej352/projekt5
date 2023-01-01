const express = require('express');
const path = require('path');

const pizzas = require('./database/pizzas.js')

const multer = require("multer");
const fse = require('fs-extra');

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, '/public')));



const externalUrl = process.env.RENDER_EXTERNAL_URL;
const PORT = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 3000;


//routes
app.get('/', (req, res) => {
	res.redirect('home');
});

app.get('/home', async function (req, res) {
	res.render('home');
});

app.get('/menu', async function (req, res) {

	res.render('menu', {
		pizzas: pizzas.pizzas,
	});
});


app.get('/about-us', async function (req, res) {
	res.render('about-us');
});



app.get('/not-found', async function (req, res) {
	res.render('not-found');
});



// potrebno za VER05+
const UPLOAD_PATH = path.join(__dirname, "public", "uploads");
var uploadSnaps = multer({
    storage:  multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, UPLOAD_PATH);
        },
        filename: function (req, file, cb) {
            let fn = file.originalname.replaceAll(":", "-");
            cb(null, fn);
        },
    })
}).single("image");


app.post("/saveSnap",  function (req, res) {
    uploadSnaps(req, res, async function(err) {
        if (err) {
            console.log(err);
            res.json({
                success: false,
                error: {
                    message: 'Upload failed:: ' + JSON.stringify(err)
                }
            });
        } else {
            console.log(req.body);
            res.json({ success: true, id: req.body.id });
            //if (VERSION==="06") await sendPushNotifications(req.body.title);
        }
    });
});


app.get("/snaps", function (req, res) {
    let files = fse.readdirSync(UPLOAD_PATH);
    //files = files.reverse().slice(0, 10);
    console.log("In", UPLOAD_PATH, "there are", files);
    res.json({
        files
    });
});
// /potrebno za VER05+














app.get('*', function(req, res){
	res.status(404).render('not-found')
  });


if (externalUrl) {
	const hostname = '127.0.0.1';
	app.listen(PORT, hostname, () => {
		console.log(`Server locally running at http://${hostname}:${PORT}/ and from
	outside on ${externalUrl}`);
	});
} else {
	app.listen(PORT, function () {
		console.log(`Server running at http://localhost:${PORT}/`);
	});
}