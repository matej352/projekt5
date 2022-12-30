const express = require('express');
const path = require('path');

const pizzas = require('./database/pizzas.js')


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

	//console.log(pizzas.pizzas)

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