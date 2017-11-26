console.log('hello world');


const port = 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const User = require('./models/users');
const path = require('path');
const app = express();
const methodOverride = require('method-override');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride('_method'));

connect()
  .on('error', console.log)
  .on('disconnected', connect)
  .once('open', listen);

function listen() {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
}
function connect() {
  var mongoDB = 'mongodb://localhost/todo_database';
  return mongoose.connect(mongoDB, {
    useMongoClient: true
  });
}

app.get('/',(req, res) => {
  res.end("Hello World");
});

app.get('/hello_form', function(req, res) {
  res.render("hello_form");
});

app.delete('/users/:userId',(req, res) => {
  const userId = req.params.userId;
  User.remove({_id: userId})
    .then(() => {
      res.redirect('/users');
    })
    .catch((err) => {
      res.statusCode = 400;
      res.end(err.message);
    });
});

app.get('/users/:userId/edit', (req, res) => {
  const query = {_id: req.params.userId};
  User.findOne(query)
    .then((user) => {
      res.render('user_edit_form', {user: user});
    })
    .catch((err) => {
      res.statusCode = 400;
      res.end(err.message);
    });
});

app.put('/users/:userId', (req, res) => {
  // const userId = req.params.userId;
  const query = {_id: req.params.userId};
  const data = req.body;
  User.update(query, {$set: data})
    .then(() => {
      res.redirect('/users');
    })
    .catch((err) => {
      res.statusCode = 400;
      res.end(err.message);
    });
});

app.get('/users', function(req, res) {
  User.find({})
  .select('name')
  .then(users => {
    res.render("users", {users: users});    
    })
    .catch((err) => {
      res.statusCode = 400;
      res.end(err.message);
    });
});

app.post('/hello', function(req, res){
  const name = req.body.name;
  const user = new User({name: name});
  user.save()
     .then((data) => {
        res.end(`Hello ${data.name}, we have saved you.`);
      })
  .catch((err) => {
    res.statusCode = 400;
    res.end(err.message);
  });
});
