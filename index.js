const express = require('express');
const mysql = require('mysql');
const alert = require('alert');
const nodemailer = require('nodemailer');
const moment = require('moment');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'xxxxx'
});
/*var del=con._protocol._delegateError;
con._protocol._delegateError=function(err, sequence){
  if(err.fatal){
    console.trace('Fatal error:' + err.message);
  }
  return del.call(this, err,sequence);
};*/
var transporter=nodemailer.createTransport({
  service:'gmail',
  auth:{
    user:'vehiclemaina12@gmail.com',
    pass:'xxxxxx'
  }
})

var date1 = moment(Date.now()).format('YYYY-MM-DD');

con.connect(function(err) {
  con.query("CREATE DATABASE IF NOT EXISTS vehiclemania", function (err, result) {
  });
  con.query("USE vehiclemania ", function (err, result) {
  });
 const sql = "CREATE TABLE IF NOT EXISTS vehicle(name VARCHAR(30),email VARCHAR(40),pass varchar(20), no varchar(12),addr varchar(60),vtype varchar(15),vmanu varchar(30),vmodel varchar(30),vno varchar(20), service1 varchar(20), service2 varchar(30),service3 varchar(25),service4 varchar(25),service5 varchar(30), service6 varchar(25), dat date,time varchar(30),PRIMARY KEY(email))";
  con.query(sql, function (err, result) {
});
});

var email="0";

app.get('/', function(req, res)  {
    res.render('index.ejs');
});
app.get('/login', function(req, res)  {
    res.render('login.ejs');
});
app.get('/register', function(req, res)  {
    res.render('register.ejs');
});
app.get('/aboutus', function(req, res)  {
  res.render('aboutus.ejs');
});
app.get('/ourservices', function(req, res)  {
  res.render('ourservice.ejs');
});
app.get('/vehicledetails', function(req, res)  {
  res.render('vehicledetails.ejs');
});
app.get('/slotbook', function(req, res)  {
  res.render('slot.ejs');
});
app.get('/feedback', function(req, res)  {
  res.render('feedback.ejs');
});

app.post('/create',function(req, res)  {
  var name=req.body.name;
  email=req.body.emailid;
  var pass=req.body.password;
  var cont=req.body.contactnumber;
  var addr=req.body.address;
  var i=0;
  con.query('SELECT COUNT(*) AS cnt FROM vehicle WHERE email = ?', [email], function(error, results) {
    if (results[0].cnt > 0) {
      alert("Email already exits");
      res.redirect('/register');
    }
    else{ 
      con.query('INSERT INTO vehicle (name ,email,pass,no,addr ,vtype,vmanu,vmodel,vno,service1, service2,service3,service4,service5,service6,dat,time) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
       [name,email,pass,cont,addr,i,i,i,i,i,i,i,i,i,i,i,i], function(error, results) {
      alert("Sucessfully registered!");
      res.redirect('/vehicledetails');
     });
    }
  });
});

app.post('/log', function(req, res) {
email = req.body.emailid;
var pass_1 = req.body.password;
if (email && pass_1) {
  con.query('SELECT * FROM vehicle WHERE email = ? AND pass = ?', [email, pass_1], function(error, results) {
    if (results.length > 0) {
      //req.session.loggedin = true;
      //req.session.email2 = email_1;
      alert("Sucessfully logged in!");
      res.redirect('/vehicledetails');
    } else {
      alert('Incorrect Email and/or Password!');
      res.redirect('/login');
    }			
  });
}
});

app.post('/details', function(req, res)  {
  var vtype1=req.body.type_8;
  var manu=req.body.manufacturer;
  var mo=req.body.model;
  var no=req.body.vehiclenumber;
  con.query('UPDATE vehicle SET vtype=?, vmanu=?, vmodel=?, vno=? WHERE email=?',
  [vtype1,manu,mo,no,email],function(error,results){
    if(error)
    {
      throw error;
    }
  });
	res.redirect('/slotbook');
});

app.post('/slot', function(req, res)  {
  var ser1=req.body.Periodic_Service;
  var ser2=req.body.AC_Service_and_Batteries;
  var ser3=req.body.Tyres_and_Wheel_Care;
  var ser4=req.body.Cleaning_and_Detailing;
  var ser5=req.body.Glass_and_Custom_Service;
  var ser6=req.body.Denting_and_Painting;
  var da=req.body.date;
  var tisl=req.body.timeslot;
  if(da<=date1){
    alert('Choose valid Date');
    res.redirect('/slotbook');
  }
  else{
    con.query('UPDATE vehicle SET service1=?,service2=?,service3=?,service4=?,service5=?,service6=?, dat=?, time=? WHERE email=?',
    [ser1,ser2,ser3,ser4,ser5,ser6,da,tisl,email],function(error,results){
      con.query('SELECT * FROM vehicle WHERE email=?',[email],function(error,results){
        var serv= results[0].service1 + " , " + results[0].service2 + " , " + results[0].service3 + " , " + results[0].service4 + " , " + results[0].service5 + " , " + results[0].service6;
        let mailOptions={
          from:'vehiclemaina12@gmail.com',
          to:email,
          subject:'Successful Booking ',
          text: "Name = " + String(results[0].name) + "\r\n" + "Email = " + String(results[0].email) + "\r\n" + "Number = " + String(results[0].no) + "\r\n" + "Address = " + String(results[0].addr) + "\r\n" + "Vehicle Type = " + String(results[0].vtype) + "\r\n" + "Vehicle Manufacture = " + String(results[0].vmanu) + "\r\n" + "Vehicle Model = " + String(results[0].vmodel) + "\r\n" + "Vehicle Number = " + String(results[0].vno) + "\r\n" + "Service = " + String(serv) + "\r\n" + "Date = " + String(results[0].dat) + "\r\n" + "Time = " + String(results[0].time)
        }
        transporter.sendMail(mailOptions,function(err,info){
          if(err){
            console.log(err);
          }
          else{
            console.log('Email sent: ' + info.response);
          }
        });
      });
      alert("Congrats! Your booking has been done");
      if(error)
      {
        throw error;
      }
    });
	res.redirect('/feedback');
  }
});

app.post('/feed', function(req, res) {
  var feedb=req.body.feedback;
  console.log(feedb);
	res.redirect('/');
});

app.listen(9090);
