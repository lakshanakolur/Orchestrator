var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');

mongoose.connect('mongodb://localhost:27017/SelfieLess1', {useNewUrlParser: true});

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router({ automatic405: true });

users = require('./models/users');

var noreq = 0
var health = 1

app.get('/api/v1/_health', (req, res) => {
	if(health == 1)
	{
		return res.status(200).send();
	}
	return res.status(500).send();
});

app.all('/api/v1/_health', (req, res) => {
	if(health == 0)
	{
		return res.status(500).send();	
	}
  return res.status(405).send();
});

app.post('/api/v1/_crash', (req, res) => {
	if(health == 0)
	{
		return res.status(500).send();	
	}
	health = 0;
  return res.status(200).send();
});

app.all('/api/v1/_crash', (req, res) => {
	if(health == 0)
	{
		return res.status(500).send();	
	}
  return res.status(405).send();
});

app.get('/api/v1/_count', (req, res) => {
	if(health == 0)
	{
		return res.status(500).send();	
	}
  num = [noreq]
  return res.status(200).send(num);
});

app.delete('/api/v1/_count', (req, res) => {
	if(health == 0)
	{
		return res.status(500).send();	
	}
  noreq = 0
  return res.status(200).send();
});


app.all('/api/v1/_count', (req, res) => {
	if(health == 0)
	{
		return res.status(500).send();	
	}
  noreq = 0
  return res.status(405).send();
});

///api/v1/users

app.get('/api/v1/users', (req, res) => {
	if(health == 0)
	{
		return res.status(500).send();	
	}
  noreq++;
	var usersProjection = { 
        __v: false,
        _id: false
    };

    function callback1(cat)
    {
      retcat = [];
      i = 0;
      cat.forEach(function(ct){
        retcat[i++] = ct['username'];
      });
      console.log("User Get - 200");
      return res.status(200).send(JSON.stringify(retcat));

    }

    cat = users.find({}, usersProjection, function(err, catr) {
      if(!catr.length){
        return res.status(204).send();
      }
      callback1(catr);
  });
});

//1
app.post('/api/v1/users', (req, res) => {
	if(health == 0)
	{
		return res.status(500).send();	
	}
  noreq++;
	if(!req.body.username) {
    	return res.status(400).send();
	}
    if(!req.body.password) {
    	return res.status(400).send();
	}

	User = new users({
   		username: req.body.username,
   		password: req.body.password
 	});

	User.save()
    .then(data => {
        return res.status(201).send();
    }).catch(err => {
        return res.status(400).send()
    });
});

app.delete('/api/v1/users', (req, res) => {
	if(health == 0)
	{
		return res.status(500).send();	
	}
  noreq++;
	return res.status(405).send();
});

app.all('/api/v1/users', (req, res) => {
	if(health == 0)
	{
		return res.status(500).send();	
	}
  noreq++;
  return res.status(405).send();
});


///api/v1/users/:username

app.get('/api/v1/users/:username', (req, res) => {
	if(health == 0)
	{
		return res.status(500).send();	
	}
  noreq++;
	return res.status(405).send();
});

app.post('/api/v1/users/:username', (req, res) => {
	if(health == 0)
	{
		return res.status(500).send();	
	}
  noreq++;
	return res.status(405).send();
});

//2
app.delete('/api/v1/users/:username', (req, res) => {
	if(health == 0)
	{
		return res.status(500).send();	
	}
  noreq++;
	users.find({username: req.params.username}, (err, user) =>{
    	if (err) return res.status(400).send(err);
    	if (!user.length) {
        	return res.status(400).send();
    }
    }).deleteOne().then(data => {
        return res.status(200).send();
    }).catch(err => {
        return res.status(400).send()
    });
});

app.all('/api/v1/users/:username', (req, res) => {
	if(health == 0)
	{
		return res.status(500).send();	
	}
  noreq++;
  return res.status(405).send();
});

//Open Port
app.listen(5000);
console.log('Listening on port 3000...');
