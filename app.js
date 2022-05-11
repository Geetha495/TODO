const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');


const app = express();

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const url = 'mongodb://localhost:27017/tododb';


const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'static')));

app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');



MongoClient.connect(url, (err, database) => {
	if (err) {
		return console.log(err);
	}

	console.log('Mongodb connected');

	db = database;
	Todos = db.collection('todos');

	app.listen(port, () => {
		console.log('Server running on port ' + port);
	});


}
);

app.get('/', (req, res, next) => {
	Todos.find({}).toArray((err, todos) => {
		if (err) {
			return console.log(err);
		}
		// console.log(todos);
		res.render('index', { todos: todos });
	});

});


app.post('/todo/add', (req, res, next) => {
	// console.log(req.body.name,req.body.description);

	const todo = {
		name: req.body.name,
		body: req.body.description
	}


	Todos.insert(todo, (err, result) => {
		if (err) {
			return consoles.log(err);
		}
		res.redirect('/');
	});

});


app.get('/todo/delete/:id', (req, res, next) => {
	const query = { _id: ObjectID(req.params.id) };
	Todos.deleteOne(query, (err, response) => {
		if (err) {
			return console.log(err);
		}
		res.redirect('/');
	});

});

app.get('/todo/edit/:id', (req, res, next) => {
	const query = { _id: ObjectID(req.params.id) };

	Todos.find(query).next((err, todo) => {
		if (err) {
			return console.log(err);
		}
		res.render('edit', { todo: todo });
	});
});

app.post('/todo/edit/:id', (req, res, next) => {
	const query = { _id: ObjectID(req.params.id) };

	Todos.find(query).next((err, result) => {
		if (err) {
			return console.log(err);
		}

		const todo = {
			name: req.body.name,
			body: req.body.description
		}

		Todos.updateOne(query, {$set: todo},(err, result) => {
			if (err) {
				return consoles.log(err);
			}
			res.redirect('/');
		});
	});
});
