const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

const url = process.env.MONGODB_URL;
const ObjectID = require('mongodb').ObjectID;


const port = 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'static')));


app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');


const { MongoClient } = require('mongodb');
MongoClient.connect(url,(err,db)=>
{
	if(err)
	{
		return console.log(err);
	}
	console.log('connected');
	var db = db.db("tododb");

	Todos = db.collection('todos');

	app.listen(process.env.PORT || port, () => {
		console.log('Server running on port ' + port);
	});
})


app.get('/', (req, res, next) => {
	Todos.find({}).toArray((err, todos) => {
		if (err) {
			return console.log(err);
		}

		res.render('index', { todos: todos });
	});

});


app.get('/todo/search/',(req,res,next)=>{

	if(!req.query.name)
	{
		res.redirect('/');
		return;
	}

	const query = { name: new RegExp(req.query.name, "i")  };

	Todos.find(query).toArray((err,todos)=>
	{
		if (err) {
			return console.log(err);
		}

		res.render('index', { todos: todos });
	});
});

app.post('/todo/add', (req, res, next) => {

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
