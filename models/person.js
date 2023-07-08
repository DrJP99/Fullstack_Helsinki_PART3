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
		minLength: 8,
		validate: {
			validator: (v) => {
				return /(\d{2}|\d{3})-\d*/.test(v);
			},
			message: (props) =>
				`${props.value} must had 2 or 3 numbers, a dash and other numbers`,
		},
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
