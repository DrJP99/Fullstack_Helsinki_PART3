const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

app.use(express.static("build"));
app.use(cors());

app.use(express.json());

morgan.token("body", (req) => {
	return JSON.stringify(req.body);
});

app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :body"
	)
);

const Person = require("./models/person");

// let persons = [
// 	{
// 		id: 1,
// 		name: "Arto Hellas",
// 		number: "040-123456",
// 	},
// 	{
// 		id: 2,
// 		name: "Ada Lovelace",
// 		number: "39-44-5323523",
// 	},
// 	{
// 		id: 3,
// 		name: "Dan Abramov",
// 		number: "12-43-234345",
// 	},
// 	{
// 		id: 4,
// 		name: "Mary Poppendieck",
// 		number: "39-23-6423122",
// 	},
// ];

app.get("/info", (req, res) => {
	Person.find({}).then((persons) => {
		const n = persons.length;
		const now = new Date();
		const info = `
			<p>Phonebook has info for ${n} people</p>
			<p>${now}</p>
		`;
		res.end(info);
	});
});

app.get("/api/persons", (req, res) => {
	Person.find({}).then((persons) => {
		res.json(persons);
	});
});

app.get("/api/persons/:id", (req, res) => {
	Person.findById(req.params.id)
		.then((person) => {
			res.json(person);
		})
		.catch((e) => {
			console.log("Could not find", req.params.id);
			return res.status(404).json({
				error: "no person with such id",
			});
		});
});

app.delete("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	persons = persons.filter((p) => p.id !== id);

	res.status(204).end();
});

// const generateId = () => {
// 	let new_id = 1;
// 	let unique = false;
// 	while (!unique) {
// 		new_id = Math.floor(Math.random() * 10000);
// 		unique = persons.find((p) => p.id === new_id) ? false : true;
// 	}
// 	return new_id;
// };

app.post("/api/persons", (req, res) => {
	const body = req.body;

	if (!body.name || !body.number) {
		return res.status(400).json({
			error: "name or number missing",
		});
	}

	Person.find({}).then((persons) => {
		if (persons.find((p) => p.name === body.name)) {
			return res.status(400).json({
				error: "name must be unique",
			});
		}
	});

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person.save().then((savedPerson) => {
		res.json(savedPerson);
	});
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on PORT ${PORT}`);
