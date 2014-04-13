var querystring	= require('querystring'),
	express		= require('express'),
	app			= express(),
	email   	= require("emailjs"),
	fs 			= require("fs"),
	mime 		= require('mime');

var mongo;
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
var mongourl = generate_mongo_url(mongo);

var ObjectID = require('mongodb').ObjectID;

//GLOBAL VARIABLES
var userID = '';

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
							});
							console.log('Register_successful');
							res.send(req.query);
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
app.get('/home', function(req, res){
	if(typeof(req.cookies.userID) !== 'undefined'){
		require('mongodb').connect(mongourl, function(err, db){
			db.collection('users', function(err, collection){
				collection.find({_id : ObjectID(req.cookies.userID)}).toArray(function(err, results){
					var userLogin = results[0].login;
					res.cookie('login', results[0].login, { path: '/', expires: new Date(Date.now() + 900000000), httpOnly: true });

					//Render Product list
					require('mongodb').connect(mongourl, function(err, db){
						db.collection('products', function(err, collection){
							collection.find({userID : req.cookies.userID}).toArray(function(err, results){
								res.render('home.jade', {user : userLogin, userID : req.cookies.userID, productsList : results, day : req.cookies.day});
							});
						});
					});
				});
			});
		});
	}
	else{
		res.redirect('/');
	}
});

//Add product
app.get('/addProduct', function(req, res){
	require('mongodb').connect(mongourl, function(err, db){
		db.collection('products', function(err, collection){
			collection.find({title : req.query.nameProd, userID : req.cookies.userID}).toArray(function(err, results){
				collection.find({userID : req.cookies.userID}).toArray(function(err, results){
				});
				if(results.length == 0){
					var qty = +(req.query.qtyProd);
					collection.insert({
						title : req.query.nameProd,
						qty : qty,
						unit : req.query.unit,
						price : req.query.priceProd,
						userID : req.cookies.userID
					});
					console.log('Product added!');
					res.send(req.query);
				}
				else{
					console.log('This product is exist!');
					res.send(false);
				}
			});
		});
	});
});
//Dell product from database
app.get('/delProduct', function(req, res){
	require('mongodb').connect(mongourl, function(err, db){
		db.collection('products', function(err, collection){
			collection.remove({title : req.query.titleProd, userID : req.cookies.userID});
		});
	});
	res.send(req.query);
});

//Apply editing
app.get('/applyEditing', function(req, res){
	require('mongodb').connect(mongourl, function(err, db){
		db.collection('products', function(err, collection){
			var qty = +(req.query.qtyProd);
			collection.update({title : req.query.defaultProdName, userID : req.cookies.userID}, {$set: {title : req.query.nameProd, qty : qty, price : req.query.priceProd, unit: req.query.unitProd} });
		});
	});
	res.send(req.query);
});

//Sales list
app.get('/salesPage', function(req, res){
	if(typeof(req.cookies.userID) !== 'undefined'){
		var MILISEC = +(req.cookies.mSeconds);
		var d = new Date(MILISEC),
			curDate = d.getDate(),
			curMonth = d.getMonth(),
			curYear = d.getFullYear(),
			timeZone = req.cookies.timeZone,
			months = ['January', 'February','March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

			setTimeMorning = new Date(months[curMonth]+' '+curDate+', '+curYear+' 00:00:01 GMT+'+timeZone+'00'),
			setTimeEvning = new Date(months[curMonth]+' '+curDate+', '+curYear+' 23:59:59 GMT+'+timeZone+'00'),

			MILISECONDSsetTimeMorning = setTimeMorning.getTime(),
			MILISECONDSsetTimeEvning = setTimeEvning.getTime();

		require('mongodb').connect(mongourl, function(err, db){
			db.collection('salesList', function(err, collection){
				collection.find({userID : req.cookies.userID, day: {$gte: MILISECONDSsetTimeMorning, $lte: MILISECONDSsetTimeEvning} } ).sort({day: 1}).toArray(function(err, results){
					res.render('salesPage.jade',  {user : req.cookies.login, userID : req.cookies.userID, day : req.cookies.day, salesList : results});
				});
			});
		});
	}
	else{
		res.redirect('/');
	}
});

//Live search
app.get('/search', function(req, res){
	require('mongodb').connect(mongourl, function(err, db){
		db.collection('products', function(err, collection){
			collection.find({title : {$regex: req.query.saerchName, $options:'i'}, userID : req.cookies.userID}).toArray(function(err, results){
				res.send(results);
			});
		});
	});
});

//Add product to sales list
app.get('/addToSaleList', function(req, res){

	var MILISEC = +(req.query.mSeconds);
	var d = new Date(MILISEC),
		curYear = d.getFullYear(),
		curMonth = d.getMonth(),
		curDate = d.getDate(),
		timeZone = req.cookies.timeZone,
		months = ['January', 'February','March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

		setTimeMorning = new Date(months[curMonth]+' '+curDate+', '+curYear+' 00:00:01 GMT+'+timeZone+'00'),
		setTimeEvning = new Date(months[curMonth]+' '+curDate+', '+curYear+' 23:59:59 GMT+'+timeZone+'00'),

		MILISECONDSsetTimeMorning = setTimeMorning.getTime(),
		MILISECONDSsetTimeEvning = setTimeEvning.getTime();

	require('mongodb').connect(mongourl, function(err, db){
		db.collection('products', function(err, collection){
			if(req.query.sold == 'true'){                      //for selling
				var chekList = req.query.arrCheckList,
					chekListLength = +(chekList.length) - 1;
				for(i=0; i <= chekListLength; chekListLength--){
					(function(chekListLength) {
						var qty = +(chekList[chekListLength].qtySold),
							titleSold = chekList[chekListLength].titleSold,
							priceSold = chekList[chekListLength].priceSold;

						require('mongodb').connect(mongourl, function(err, db){
							db.collection('salesList', function(err, collection){

								collection.find({userID : req.cookies.userID, day: {$gte: MILISECONDSsetTimeMorning, $lte: MILISECONDSsetTimeEvning}, title : titleSold, price : priceSold }).toArray(function(err, results){

									if(results.length !== 0){
										collection.update({userID : req.cookies.userID, day: {$gte: MILISECONDSsetTimeMorning, $lte: MILISECONDSsetTimeEvning}, title : titleSold, price : priceSold}, {$inc: {qty : +qty}});
										console.log('Alredy exist');
									}
									else{
										collection.insert({
											userID : req.cookies.userID,
											day : MILISEC,
											title : titleSold,
											qty : qty,
											price : priceSold
										});
										console.log('New price');
									}
								});
								db.collection('products', function(err, collection){
									collection.update({userID : req.cookies.userID, title : titleSold}, {$inc: {qty : -qty}});
								});
							});
						});
					})(chekListLength);
				}
				res.send('sold');
			}
			else{                                             //Check fields for sell
				collection.find({userID : req.cookies.userID, title : req.query.titleSold}).toArray(function(err, result){
					if(result.length !== 0){
						var qty = +(req.query.qtySold);

						collection.find({userID : req.cookies.userID, title : req.query.titleSold, qty : {$gte : qty}}).toArray(function(err, results){
							if(results.length !== 0){
								res.send('sold');
							}
							else{
								res.send('qty');
							}
						});
					}
					else{
						res.send('title');
					}
				});
			}
		});
	});
});

//Report
app.get('/report', function(req, res){
	if(typeof(req.cookies.userID) !== 'undefined'){
		res.render('report.jade', {user : req.cookies.login, day : req.cookies.day});
	}
	else{
		res.redirect('/');
	}
});

//Render report list
app.get('/renderReportList', function(req, res){
	var reportDateFrom = (req.query.reportDateFrom).split('/'),
		yearFrom = +reportDateFrom[2],
		monthFrom = +reportDateFrom[0]-1,
		dayFrom = +reportDateFrom[1],
		timeZone = req.cookies.timeZone,
		months = ['January', 'February','March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		setTimeReportFrom = new Date(months[monthFrom]+' '+dayFrom+', '+yearFrom+' 00:00:01 GMT+'+timeZone+'00'),
		MILISECONDSsetTimeReportFrom = setTimeReportFrom.getTime();
	require('mongodb').connect(mongourl, function(err, db){
		db.collection('salesList', function(err, collection){
			if(req.query.reportDaysTill.length == 0){
				var setTimeReportTill = new Date(months[monthFrom]+' '+dayFrom+', '+yearFrom+' 23:59:59 GMT+'+timeZone+'00'),
					MILISECONDSsetTimeReportTill = setTimeReportTill.getTime();
				collection.find({userID : req.cookies.userID, day: {$gte: MILISECONDSsetTimeReportFrom, $lte: MILISECONDSsetTimeReportTill } } ).sort({day: 1}).toArray(function(err, results){
					res.send(results);
				});
			}
			else{
				var reportDaysTill = (req.query.reportDaysTill).split('/'),
					yearTill = +reportDaysTill[2],
					monthTill = +reportDaysTill[0]-1,
					dayTill = +reportDaysTill[1],
					setTimeReportTill = new Date(months[monthTill]+' '+dayTill+', '+yearTill+' 23:59:59 GMT+'+timeZone+'00'),
					MILISECONDSsetTimeReportTill = setTimeReportTill.getTime();
				collection.find({userID : req.cookies.userID, day: {$gte: MILISECONDSsetTimeReportFrom, $lte: MILISECONDSsetTimeReportTill } } ).sort({day: 1}).toArray(function(err, results){
					res.send(results);
				});
			}
		});
	});
});
app.get('/clearSalesList', function(req, res){
	require('mongodb').connect(mongourl, function(err, db){
		db.collection('salesList', function(err, collection){
			collection.remove({userID : req.cookies.userID}, function(err, result){
				if(!err){
					res.send('success');
				}
				else{
					res.send('error');
				}
			});
		})
	})
});

//Clients page
app.get('/clients', function(req, res){
	if(typeof(req.cookies.userID) == 'undefined')
		res.redirect('/');

	

});

app.get('/aboutUS', function(req, res){
	res.render('aboutUS.jade');
})
//Page 404
app.get('/error404', function(req, res){
	res.render('error404.jade', {'title' : 'Error 404'});
});

app.get('*', function(req, res){
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

//listen on localhost 8888
app.listen(8888);