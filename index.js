const express = require("express");
const app = express();

app.use(express.json());

let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

app.get("/info", (req, res) => {
	const n = persons.length;
	const now = new Date();
	console.log(now);
	const info = `
        <p>Phonebook has info for ${n} people</p>
        <p>${now}</p>
    `;
	res.end(info);
});

app.get("/api/persons", (req, res) => {
	res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	const person = persons.find((p) => p.id === id);
	if (person) {
		res.json(person);
	} else {
		res.status(404).end();
	}
});

app.delete("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	persons = persons.filter((p) => p.id !== id);

	res.status(204).end();
});

const generateId = () => {
	let new_id = 1;
	let unique = false;
	while (!unique) {
		new_id = Math.floor(Math.random() * 10000);
		unique = persons.find((p) => p.id === new_id) ? false : true;
	}
	return new_id;
};

app.post("/api/persons", (req, res) => {
	const body = req.body;

	if (!body.name || !body.number) {
		return res.status(400).json({
			error: "name or number missing",
		});
	}

	if (persons.find((p) => p.name === body.name)) {
		return res.status(400).json({
			error: "name must be unique",
		});
	}

	const person = {
		id: generateId(),
		name: body.name,
		phone: body.number,
	};

	persons = persons.concat(person);
	res.json(person);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on PORT ${PORT}`);
