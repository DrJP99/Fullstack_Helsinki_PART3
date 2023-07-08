const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("Connecting to", url);

mongoose
	.connect(url)
	.then((res) => {
		console.log("Connected to MongoDB successfully!");
	})
	.catch((e) => {
		console.log("Could not connect to MongoDB:", e.message);
	});

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true,
	},
	number: {
		type: String,
		required: true,
	},
});

personSchema.set("toJSON", {
	transform: (doc, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Person", personSchema);
