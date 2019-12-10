var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var request = require('request');

mongoose.connect('mongodb://localhost:27017/SelfieLess2', {useNewUrlParser: true});

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router({ automatic405: true });

acts = require('./models/acts');
categories = require('./models/categories');

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
  return res.status(405).send();
});

app.get('/api/v1/acts/count', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
  var num=[];
  count = acts.find( (err, user) =>{
      if (err) return res.status(400).send(err);
      if (!user.length) {
        num = [0]
          return res.status(200).send(JSON.stringify(num));
        }
        num = [user.length]
        return res.status(200).send(JSON.stringify(num));
    });
});

///api/v1/categories

//4
app.get('/api/v1/categories', (req, res) => {
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
    	retcat = {}
    	cat.forEach(function(ct){
    		retcat[ct['categoryname']] = ct['noofacts'];
    	});
    	return res.status(200).send(JSON.stringify(retcat));

    }

    cat = categories.find({}, usersProjection, function(err, catr) {
			if(!catr.length){
				return res.status(204).send();
			}
			callback1(catr);
	});
});

//3
app.post('/api/v1/categories', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
	if(!req.body[0]) {
    	return res.status(400).send();
	}
   	Categories = new categories({
   		categoryname: req.body[0],
   		noofacts: 0
 	});

	Categories.save()
    .then(data => {
        return res.status(201).send();
    }).catch(err => {
        return res.status(400).send()
    });
});

app.delete('/api/v1/categories', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
	return res.status(405).send();
});

app.all('/api/v1/categories', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
  return res.status(405).send();
});


///api/v1/categories/:categoryname

app.get('/api/v1/categories/:categoryname', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
	return res.status(405).send();
});

app.post('/api/v1/categories/:categoryname', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
	return res.status(405).send();
});

//5
app.delete('/api/v1/categories/:categoryname', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
  categories.find({categoryname: req.params.categoryname}, (err, category) =>{
      if (err) return res.status(400).send(err);
      if(!category.length){
        return res.status(400).send();
      }
      }).deleteOne().then(data => {
        return res.status(200).send();
    }).catch(err => {
        return res.status(400).send()
    });
});

app.all('/api/v1/categories/:categoryname', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
  return res.status(405).send();
});


///api/v1/categories/:categoryName/acts

//6 & 8
app.get('/api/v1/categories/:categoryName/acts', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
	if(!req.param('start'))
	{
		abc1();
	}
	else
	{
		abc();
	}

	function abc1(){
  var usersProjection = { 
        __v: false,
        _id: false,
        categoryname: false
    };

  cat = acts.find({categoryname: req.params.categoryName}, usersProjection, (err, act) => {
    if (err) return res.status(400).send(err);
        if(!act.length){
            return res.status(204).send(err);
          }

      if(act.length >= 100)
      {
        return res.status(413).send();
      }
      return res.status(200).send(JSON.stringify(act));
      ct.forEach(function(cate){

      });
    });
	}

	function abc(){
  var start = req.param('start');
  var end = req.param('end');

  if(end - start + 1 > 100)
    return res.status(413).send();

	if(start < 1)
		return res.status(400).send();

  var usersProjection = { 
        __v: false,
        _id: false,
        categoryname: false
    };

  cat = acts.find({categoryname: req.params.categoryName}, usersProjection).sort({timestamp:'descending'}).exec( (err, act) => {
    if (err) return res.status(400).send();
        if(!act.length){
            return res.status(204).send();
          }

      if(act.length < end)
      {
        return es.status(204).send();
      }
      result = []
      var c1 = 0
      var c2 = act.length;
      console.log(act);
      act.forEach(function(cate){
        if(c2 <= end && c2 >= start)
        {
          result[c1] = cate;
          c1 ++;
        }
        c2 --;
      });
      return res.status(200).send(JSON.stringify(result));
    });
	}
});

app.post('/api/v1/categories/:categoryname/acts', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
	return res.status(405).send();
});

app.delete('/api/v1/categories/:categoryname/acts', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
	return res.status(405).send();
});

app.all('/api/v1/categories/:categoryname/acts', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
  return res.status(405).send();
});


///api/v1/categories/:categoryName/acts/size

//7
app.get('/api/v1/categories/:categoryName/acts/size', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
	var num=[];
	count = categories.find({categoryname: req.params.categoryName}, (err, user) =>{
    	if (err) return res.status(400).send(err);
    	if (!user.length) {
        	return res.status(204).send(err);
        }
        num[0] = user[0]['noofacts'];
        return res.status(200).send(JSON.stringify(num));
    });
});

app.post('/api/v1/categories/:categoryName/acts/size', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
  return res.status(405).send();
});

app.delete('/api/v1/categories/:categoryName/acts/size', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
  return res.status(405).send();
});

app.all('/api/v1/categories/:categoryName/acts/size', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
  return res.status(405).send();
});


///api/v1/acts/upvote

app.get('/api/v1/acts/upvote', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
	return res.status(405).send();
});

//9
app.post('/api/v1/acts/upvote', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
	var num;
  act = acts.find({actId: req.body[0]}, (err, act) =>{
        if (err) return res.status(400).send();
        if(!act.length){
            return res.status(400).send();
          }
      num = act[0]['upvotes'];
      

  acts.findOneAndUpdate({actId: req.body[0]}, {$set:{upvotes:num+1}},(err, act) =>{
    if (err) return res.status(400).send();
    return res.status(200).send();
  });
  }); 
});


app.delete('/api/v1/acts/upvote', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
	return res.status(405).send();
});

app.all('/api/v1/acts/upvote', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
  return res.status(405).send();
});


///api/v1/acts/:actId

app.get('/api/v1/acts/:actId', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
	return res.status(405).send();
});

app.post('/api/v1/acts/:actId', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
	return res.status(405).send();
});

//10
app.delete('/api/v1/acts/:actId', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;

	function callback2(data){
		var num;
		categories.find({categoryname: data[0]['categoryname']}, (err, act) =>{
			if(!act.length)
				return;
      num = act[0]['noofacts'];
	categories.findOneAndUpdate({categoryname: data[0]['categoryname']},
		{$set:{noofacts:num-1}},(err, act) =>{
		});
	});
	}

    acts.find({actId: req.params.actId}, (err, act) =>{
        if (err) return res.status(400).send(err);
        if(!act.length){
            return res.status(400).send();
          }
          else
          callback2(act);
        }).deleteOne().then(data => {
        return res.status(200).send();
    });
});

app.all('/api/v1/acts/:actId', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
  return res.status(405).send();
});


///api/v1/acts

app.get('/api/v1/acts', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
	return res.status(405).send();
});

//11

app.post('/api/v1/acts', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
  if(!req.body.username || !req.body.actId || !req.body.timestamp ||
  	!req.body.caption || !req.body.categoryName || !req.body.imgB64) {
      return res.status(400).send();
  }	
  var fg = 0;
	function callback4c()
	{
	var num;
		categories.find({categoryname: req.body.categoryName}, (err, act) =>{
			if(!act.length)
				return;
      num = act[0]['noofacts'];
	categories.findOneAndUpdate({categoryname: req.body.categoryName},
		{$set:{noofacts:num+1}},(err, act) =>{
		});
	});
	}

	function callback4b()	
	{
  var dt = req.body.timestamp;
  var date = dt.split(':')[0];
  var time = dt.split(':')[1];
  var d = date.split('-');
  var t = time.split('-');
  var st = d[2] + "-" + d[1] + "-" + d[0] + "T" + t[2] + ":" + t[1] + ":" + t[0];
  ts = new Date(st);
  Act = new acts({
      actId: req.body.actId,
      username: req.body.username,
      timestamp: ts,
      caption: req.body.caption,
      categoryname: req.body.categoryName,
      upvotes: 0,
      imgB64: req.body.imgB64
  });

  Act.save()
    .then(data => {
    	if(fg == 0)
    	{
    		callback4c();
		}
        return res.status(201).send();
    }).catch(err => {
        return res.status(400).send()
    });

	}

	function callback4a()
  {	
  categories.find({categoryname: req.body.categoryName}, (err, user) =>{
      if (err) return res.status(400).send(err);
      if (!user.length) {
      	fg++;
          return res.status(400).send(err);
    }
  	if(fg == 0)
    {
    callback4b();
	}
	});
	}
  var repo = ''
  request.get('http://localhost:5000/api/v1/users', { json: true }, (error, resp, rebody) => {
  if (error) { return console.log(error); }
    use = req.body.username;
    len = rebody.length;
    console.log(rebody);
    i = 0
    f = 0
    while(i < len)
    {
      if(rebody[i] == use)
      {
        f=1
        console.log(rebody[i],f);
        callback4a();
      }
      i++;
    }
    console.log(f);
    if(f == 0)
      return res.status(400).send();
  });
});
	
app.delete('/api/v1/acts', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
	return res.status(405).send();
});


app.all('/api/v1/acts', (req, res) => {
  if(health == 0)
  {
    return res.status(500).send();  
  }
  noreq++;
  return res.status(405).send();
});


//Open Port
app.listen(8000);
console.log('Listening on port 3000...');
