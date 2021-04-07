const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mc:mc123mcmc@app-note.ut7xe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
	useCreateIndex: true,
	useNewUrlParser: true,
	useFindAndModify: false
}).then(db => console.log("Successful connection to the database"))
  .catch(err => console.error(err));