﻿var querystring	= require('querystring'),
	express		= require('express'),
	app			= express(),
	email   	= require("emailjs"),
	fs 			= require("fs"),
	mime 		= require('mime'),
	jade		= require('jade'),
	mongodb     = require('mongodb');

var mongo = {},
	MongoClient = mongodb.MongoClient,
	port = 8888;
	
app.configure('development', function(){
    mongo = {
        "hostname":"localhost",
        "port":27017,
        "username":"",
        "password":"",
        "name":"",
        "db":"db"
    }
});
app.configure('production', function(){
    var env = JSON.parse(process.env.VCAP_SERVICES);
    mongo = env['mongodb-1.8'][0]['credentials'];
});

var generate_mongo_url = function(obj){
    obj.hostname = (obj.hostname || 'localhost');
    obj.port = (obj.port || 27017);
    obj.db = (obj.db || 'test');
    if(obj.username && obj.password){
        return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }else{
        return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
    }
}

var mongourl = generate_mongo_url(mongo),
	MD = {}, //Databases connected at the end of server's code
	ObjectID = require('mongodb').ObjectID,
	userID = '';

var T = {
	months: ['January', 'February','March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	getDataObj: function(tZone, milisec){
		var date = {},
			dObject = {};
		
		if(milisec)
			date = new Date(milisec);
		else
			date = new Date()
		
		dObject.curYear = date.getFullYear();
		dObject.curMonth = date.getMonth();
		dObject.curDate = date.getDate();
		dObject.curHours = date.getHours();
		dObject.curMinutes = date.getMinutes();
		
		return dObject;
	},
	getFormatedDate: function(){

	},
	//Date format example: "month/day/year"
	getMilisecFromString: function(dataString, tZone){
		var date = dataString.split('/'),
			yearFrom = +date[2],
			monthFrom = +date[0]-1,
			dayFrom = +date[1],
			time = new Date(this.months[monthFrom]+' '+dayFrom+', '+yearFrom+' 00:00:01 GMT+'+tZone+'00');
		
		return time.getTime();
	},
	getTimeWithOffset: function(tZone, milisec){
		var dObject = this.getDataObj(tZone, milisec),
			curTime = new Date(this.months[dObject.curMonth]+' '+dObject.curDate+', '+dObject.curYear+' '+ dObject.curHours +':'+ dObject.curMinutes +':01 GMT+'+tZone+'00');

		return curTime.getTime();
	},
	getTimeMorning: function(tZone, milisec){
		var dObject = this.getDataObj(tZone, milisec),
			timeMorning = new Date(this.months[dObject.curMonth]+' '+dObject.curDate+', '+dObject.curYear+' 00:00:01 GMT+'+tZone+'00');

		return timeMorning.getTime();
	},
	getTimeEvning: function(tZone, milisec){
		var dObject = this.getDataObj(tZone, milisec),
			timeEvning = new Date(this.months[dObject.curMonth]+' '+dObject.curDate+', '+dObject.curYear+' 23:59:59 GMT+'+tZone+'00');

		return timeEvning.getTime();
	},
	getRangeTime: function(tZone, milisec){
		var rangeTime = {};

		rangeTime.start = this.getTimeMorning(tZone, milisec);
		rangeTime.end = this.getTimeEvning(tZone, milisec);
		
		return rangeTime;
	}
}

//set path to the views (template) directory
app.set('views', __dirname + '/views');

//set path to static files
app.use(express.static(__dirname+ '/static',{maxAge : new Date(Date.now() + 900000000)}));

//POST
app.use(express.bodyParser());

//Cookie
app.use(express.cookieParser());

//Handle GET requests on '/'
app.get('/', function(req, res){
	if(req.query.logout == 'logout'){
		res.clearCookie('userID');
		res.clearCookie('login');
		res.send(true);
	}
	else if(typeof(req.cookies.userID) !== 'undefined'){
		res.redirect('/salesPage');
	}
	else{
		res.render('index.jade');
	}
});

//Register
app.get('/register', function(req, res){
	var regStat		= '';
	require('mongodb').connect(mongourl, function(err, db){
		db.collection('users', function(err, collection){
			collection.find({login : req.query.login}).toArray(function(err, resultsLogin){
				if(err || resultsLogin.length == 0){

					collection.find({email : req.query.email}).toArray(function(err, resultsEmail){

						if(err || resultsEmail.length == 0){

							collection.insert({
								firstName : req.query.firstName,
								lastName : req.query.lastName,
								login : req.query.login,
								password : req.query.password,
								email : req.query.email
							}, function(err, result){
								console.log('Register_successful');
								res.send(req.query);								
							});
						}
						else{
							console.log('email alredy exist');
							res.send(regStat = 'email');
						}
					});
				}
				else{
					res.send(regStat = 'login');
					console.log('login alredy exist');
				}
			});
		});
	});
});

//Login
app.get('/login', function(req, res){
	require('mongodb').connect(mongourl, function(err, db){
		db.collection('users', function(err, collection){

			collection.find({login : req.query.loginLogin, password : req.query.passwordLogin}).toArray(function(err, results){
				if(results.length == 1){
					var userID = ''+results[0]._id+'';
					console.log('User ' +userID+ ' was logged');
					res.cookie('userID', userID, { path: '/', expires: new Date(Date.now() + 900000000), httpOnly: true });
					console.log(new Date(Date.now() + 900000000));
					res.send(true);
				}
				else{
					console.log('Wrong');
					res.send(false);
				}
			});
		});
	});
});

//Forgot password
app.get('/forgotPass', function(req, res){
	var forgotEmail = req.query.email;
	require('mongodb').connect(mongourl, function(err, db){
		db.collection('users', function(err, collection){
			collection.find({email : forgotEmail}).toArray(function(err, results){
				if(results.length !== 0){

					var server  = email.server.connect({
					   user:    "product.db.helper@gmail.com",
					   password:"produ80938858233ct",
					   host:    "smtp.gmail.com",
					   ssl:     true

					});
					var bodyHtml	= 	"<p>Шановний "+results[0].firstName+" "+results[0].lastName+", Ви отримали цього листа, тому що з Вашої поштової скриньки було здійснено запит на встановлення паролю на сайті 'mng-prod.rs.af.cm'."+
									 	"<p>Ваш пароль: <b>"+results[0].password+"</b>.</p>"+
									 	"<p>Якщо Ви не встановлювали Ваш пароль на 'mng-prod.rs.af.cm', просто видаліть лист.</p>";

					// send the message and get a callback with an error or details of the message that was sent
					server.send({
					   text: 		"empty text",
					   from:    	"Служба підтримки сервісу 'mng-prod.rs.af.cm' <product.db.helper@gmail.com>",
					   to:      	forgotEmail,
					   subject: 	"Відновлення паролю",
					   attachment: 	[ {data: bodyHtml, alternative:true}]
					},	function(err, message) {
							if(err){
						        console.log(err);
						        res.send('error');
						    }else{
						        console.log("Message sent: " + message);
						        res.send('success');
						    }
						});
				}
				else{
					res.send('email');
				}
			});
		});
	});
});

//Admin page
app.get('/admin', function(req, res){
	require('mongodb').connect(mongourl, function(err, db){
		db.collection('users', function(err, collection){
			collection.find({_id : ObjectID(req.cookies.userID)}).toArray(function(err, results){
				if(results.length !== 0){
					if(results[0].login == 'admin'){
						collection.find({}).toArray(function(err, users){
							res.render('admin.jade', {users : users});
						});
					}
					else{res.redirect('/')}
				}
				else{res.redirect('/')}
			});
		});
	});
});

//Home page
app.get('/editUser/:id', function(req, res){
	if(typeof req.cookies.userID == 'undefined'){
		res.redirect('/');
		return false;		
	}

	var dbQuery = {
			_id: ObjectID(req.params.id)
		},
		updateParams = {
			firstName: req.query.firstName,
			lastName: req.query.lastName,
			login: req.query.login,
			email: req.query.email,
			password: req.query.password
		};

	MD.users.update(dbQuery, {$set: updateParams}, function(err, result){
		res.send(updateParams);
	});
});

//Dell user from database
app.get('/removeUser/:id', function(req, res){
	if(typeof req.cookies.userID == 'undefined'){
		res.redirect('/');
		return false;		
	}

	MD.users.remove({_id: ObjectID(req.params.id)}, function(err, result){
		res.send();		
	});
});

//Home page
app.get('/home', function(req, res){
	if(typeof req.cookies.userID == 'undefined'){
		res.redirect('/');
		return false;		
	}
	//console.log(req.cookies.userID);
	MD.users.findOne({_id : ObjectID(req.cookies.userID)}, function(err, result){
		//console.log(result);
		var userLogin = result.login;
		res.cookie('login', result.login, { path: '/', expires: new Date(Date.now() + 900000000), httpOnly: true });

		//Render Product list
		MD.products.find({userID : req.cookies.userID}).sort({_id: -1}).toArray(function(err, results){
			res.render('home.jade', {user : userLogin, userID : req.cookies.userID, productsList : results, day : req.cookies.day});
		});
	});
});

//Add product
app.get('/addProduct', function(req, res){
	if(typeof req.cookies.userID == 'undefined'){
		res.redirect('/');
		return false;		
	}

	var resDAta = {};

	MD.products.find({title : {$regex: '^'+ req.query.title +'$', $options:'i'}, userID : req.cookies.userID}).toArray(function(err, results){
		if(results.length > 0){
			resDAta.error = 'This product is exist!';
			res.send(resDAta);
		}
		else{
			MD.products.insert({
				title : req.query.title,
				qty : +req.query.qty,
				unit : req.query.unit,
				price : +req.query.price,
				userID : req.cookies.userID
			}, function(err, results){
				res.send(results[0]);
			});
		}
	});
		
});

//Dell product from database
app.get('/removeProd/:id', function(req, res){
	if(typeof req.cookies.userID == 'undefined'){
		res.redirect('/');
		return false;		
	}

	MD.products.remove({userID: req.cookies.userID, _id: ObjectID(req.params.id)}, function(err, result){
		res.send();		
	});
});

//Edit prod
app.get('/editProd/:id', function(req, res){
	if(typeof req.cookies.userID == 'undefined'){
		res.redirect('/');
		return false;		
	}

	var userID = req.cookies.userID,
		prodID = req.params.id,
		editProd = {
			title : req.query.title,
			qty : +req.query.qty,
			price : +req.query.price,
			unit: req.query.unit
		};

	MD.products.update({userID: userID, _id: ObjectID(prodID)}, {$set: editProd }, function(err, result){
		res.send(editProd);		
	});
});

//Sales list
app.get('/salesPage', function(req, res){
	if(typeof req.cookies.userID == 'undefined'){
		res.redirect('/');
		return false;		
	}

	var MILISEC = +(req.cookies.mSeconds),
		timeZone = req.cookies.timeZone,
		tRange = T.getRangeTime(timeZone, MILISEC),
		userID = req.cookies.userID,
		renderData = {
			user : req.cookies.login,
			userID : req.cookies.userID,
			day : req.cookies.day
		};
	
	//Get sales
	MD.salesList.find({userID : userID, date: {$gte: tRange.start, $lte: tRange.end} } ).sort({day: -1}).toArray(function(err, results){
		renderData.salesList = results;
		//Get clients
		MD.clients.find({userID: userID}).toArray(function(err, results){
			renderData.clientList = results;
			res.render('salesPage.jade', renderData);
		});
	});
});

//Live search
app.get('/search', function(req, res){
	if(typeof req.cookies.userID == 'undefined'){
		res.redirect('/');
		return false;		
	}

	MD.products.find({title : {$regex: req.query.saerchName, $options:'i'}, userID : req.cookies.userID}).toArray(function(err, results){
		res.send(results);
	});
});

//Add product to sales list
app.get('/saleCheck', function(req, res){
	if(typeof req.cookies.userID == 'undefined'){
		res.redirect('/');
		return false;		
	}

	var timeZone = req.cookies.timeZone,
		curTime = +T.getTimeWithOffset(timeZone),
		checkNumb = (curTime +'').slice(curTime.length-10, curTime.length),
		userID = req.cookies.userID,
		clientID = req.query.clientId,
		clientFullName = req.query.clientFullName,
		totalAmount = 0,
		prodList = req.query.prodList,	
		prodListLength = +prodList.length - 1,
		newProdList = [],
		check = {};
		
	//Generate new prodList array - without label info
	for(i=0; i <= prodListLength; prodListLength--){
		(function(prodListLength) {
			var prod = {
					title: prodList[prodListLength].title.val,
					qty: +prodList[prodListLength].qty.val,
					price: +prodList[prodListLength].price.val,
					amount: +prodList[prodListLength].amount.val,
					unit: prodList[prodListLength].unit.val
				};
			totalAmount += prod.amount;
			newProdList.push(prod);
			
			//Update product - reduce qty
			MD.products.update({userID : userID, _id: ObjectID(prodList[prodListLength]._id.val)}, {$inc: {qty : -prod.qty, soldQty: +prod.qty}}, function(err, result){
				if(err) throw err;
			});
		})(prodListLength);
	}

	check = {
		userID: userID,
		clientID: clientID,
		clientFullName: clientFullName,
		date: curTime,
		checkNumb: checkNumb,
		totalAmount: totalAmount,
		prodList: newProdList
	}
	//console.log(newProdList);

	//Store solded check
	MD.salesList.insert(check, function(err, result){
		if(err) throw err;

		res.send(result);
	});

});

//Show check
app.get('/showCheck/:id', function(req, res){
	if(typeof req.cookies.userID == 'undefined'){
		res.redirect('/');
		return false;		
	}

	var userID = req.cookies.userID,
		checkId = req.params.id;

	MD.salesList.findOne({userID: userID, _id: ObjectID(checkId)}, function(err, result){
		res.render('checkDetails.jade', result);
	});
});

//Report page
app.get('/report', function(req, res){
	if(typeof req.cookies.userID == 'undefined'){
		res.redirect('/');
		return false;		
	}

	var userID = req.cookies.userID,
		renderData = {
			user : req.cookies.login,
			userID : req.cookies.userID,
			day : req.cookies.day
		};

	MD.clients.find({userID: userID}).toArray(function(err, results){
		renderData.clientList = results;
		res.render('report.jade', renderData);
	});
});

//Get report
app.get('/getReport', function(req, res){
	if(typeof req.cookies.userID == 'undefined'){
		res.redirect('/');
		return false;		
	}

	var clientID = req.query.clientId.length > 0 ? '' : req.query.clientId,
		reportType = req.query.reportType,
		tZone = req.cookies.timeZone,
		rangeTime = {
			start: req.query.timeFrom.length > 0 ? T.getTimeMorning(tZone, T.getMilisecFromString(req.query.timeFrom, tZone)) : T.getTimeMorning(tZone), 
			end: req.query.timeTill.length > 0 ? T.getTimeEvning(tZone, T.getMilisecFromString(req.query.timeTill, tZone)) : T.getTimeEvning(tZone)
		},
		dbQuery = {
			userID: req.cookies.userID,
			date: {
				$gte: rangeTime.start,
				$lte: rangeTime.end
			}
		},
		sendData = {
			reportType: reportType,
			dFrom: rangeTime.start,
			dTill: rangeTime.end
		};

	if(req.query.clientId.length > 0)
		dbQuery.clientID = req.query.clientId;

	switch (reportType){
		case 'productStatistic':
			dbQuery.prodList = { $elemMatch: {title: req.query.title} }

			MD.salesList.find(dbQuery, {'prodList.$': 1, date: 1}).sort({date: 1}).toArray(function(err, results){
				jade.renderFile('views/rProdStatistic.jade', {salesList: results, dFrom: rangeTime.start, dTill: rangeTime.end}, function(err, html){
					if(err) throw err;
					sendData.html = html;
					sendData.callback = reportType;
					sendData.salesList = results;
					
					res.send(sendData);
				});
			});
			break;
		case 'salesStatistic':
			MD.salesList.find(dbQuery).sort({date: 1}).toArray(function(err, results){				
				jade.renderFile('views/rSalesStatistic.jade', {salesList: results, dFrom: rangeTime.start, dTill: rangeTime.end}, function(err, html){
					if(err) throw err;
					sendData.html = html;
					sendData.callback = reportType;
					sendData.salesList = results;
					
					res.send(sendData);
				});
			});
			break;
		case 'salesChecks':
			MD.salesList.find(dbQuery).sort({date: 1}).toArray(function(err, results){
				jade.renderFile('views/rCheckList.jade', {salesList: results, dFrom: rangeTime.start, dTill: rangeTime.end}, function(err, html){
					if(err) throw err;
					sendData.html = html;
					
					res.send(sendData);
				});
			});
			break;
	}
});

//Clients page
app.get('/clients', function(req, res){
	if(typeof(req.cookies.userID) == 'undefined')
		res.redirect('/');

	MD.clients.find({userID: req.cookies.userID}).toArray(function(err, results){
		//console.log(results);
		res.render('clients.jade', {
			clients: results,
			user : req.cookies.login,
			day : req.cookies.day
		});
	});
});

//Client
app.get('/client/:id', function(req, res){
	if(typeof(req.cookies.userID) == 'undefined')
		res.redirect('/');
	
	var userID = req.cookies.userID,
		clientID = req.params.id,
		data = {
			user : req.cookies.login,
			day : req.cookies.day
		}

	MD.clients.findOne({_id: ObjectID(clientID)}, function(err, results){
		data.clientDet = results;
		MD.salesList.find({userID : userID, clientID: clientID}).toArray(function(err, results){
			data.salesList = results;
			res.render('client.jade', data);
		});
	});

});

//Add client
app.get('/addClient', function(req, res){
	if(typeof(req.cookies.userID) == 'undefined')
		res.redirect('/');
	
	var client = {
		firstName: req.query.firstName,
		lastName: req.query.lastName,
		email: req.query.email,
		birthday: req.query.birthday,
		tel: req.query.tel,
		userID : req.cookies.userID
	}

	MD.clients.insert(client, function(err, results){
		res.send(results);			
	});
});

//Remove Client
app.get('/removeClient', function(req, res){
	var userID = req.cookies.userID;
	if(typeof userID == 'undefined')
		res.redirect('/');
		
		MD.clients.remove({_id : ObjectID(req.query.clientId)}, function(err, removed){
			if(err){
				console.log(err);
				res.send('Client not find');				
			}
			res.send('Success');
		});
});


//Edit Client
app.get('/editClient', function(req, res){
	var userID = req.cookies.userID;
	if(typeof userID == 'undefined')
		res.redirect('/');

	var editClient = {
		firstName: req.query.firstName,
		lastName: req.query.lastName,
		email: req.query.email,
		birthday: req.query.birthday,
		tel: req.query.tel
	};
	
	MD.clients.update({_id : ObjectID(req.query.clientId), userID : userID}, {$set: editClient }, function(){
		res.send(editClient);
	});		
});

app.get('/aboutUS', function(req, res){
	res.render('aboutUS.jade');
});

//Page 404
app.get('/error404', function(req, res){
	res.render('error404.jade', {'title' : 'Error 404'});
});

app.get('*', function(req, res){
	//console.log(req.originalUrl);
	fs.readFile(__dirname + req.originalUrl, 'utf8', function(err, text){
		var type = mime.lookup(__dirname + req.originalUrl);
		if(!err){
			if (!res.getHeader('Content-Type')) {
			  	var charset = mime.charsets.lookup(type);
				res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
        		res.send(text);
			}
		}
		else{
			res.redirect('/error404');
		}
    });
});

/* Connect mongoDB and log that srver started */
MongoClient.connect(mongourl, function(err, database) {
	if(err) throw err; 
	
	MD.db = database;
	MD.users = MD.db.collection('users');
	MD.products = MD.db.collection('products');
	MD.salesList = MD.db.collection('salesList');
	MD.clients = MD.db.collection('clients');
 	
	//listen on localhost 8888
 	console.log('Server started on port: '+ port);
	app.listen(port);
});