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

app.get("/api/persons/:id", (req, res, next) => {
	Person.findById(req.params.id)
		.then((person) => {
			if (person) {
				res.json(person);
			} else {
				return res.status(404).json({
					error: "no person with such id",
				});
			}
		})
		.catch((e) => {
			next(e);
		});
});

app.delete("/api/persons/:id", (req, res, next) => {
	const id = req.params.id;

	Person.findByIdAndDelete(id)
		.then((result) => {
			res.status(204).end();
		})
		.catch((e) => {
			next(e);
		});
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

app.post("/api/persons", (req, res, next) => {
	const body = req.body;

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person
		.save()
		.then((savedPerson) => {
			res.json(savedPerson);
		})
		.catch((e) => next(e));
});

app.put("/api/persons/:id", (req, res, next) => {
	const { name, number } = req.body;

	Person.findByIdAndUpdate(
		req.params.id,
		{ name, number },
		{ new: true, runValidators: "query" }
	)
		.then((updatedPerson) => res.json(updatedPerson))
		.catch((e) => next(e));
});

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
	console.log(error.message);

	if (error.name === "CastError") {
		return res.status(400).send({ error: "malformed id" });
	} else if (error.name === "ValidationError") {
		return res.status(400).send({ error: error.message });
	}

	next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on PORT ${PORT}`);
