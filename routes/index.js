var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var os = require("os");
var connection = mysql.createConnection({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE
});
connection.connect(function(error) {
  if (!!error){
     console.log("Connect to MySQL Server failed!");
	 console.log("Continue ...");
  } else {
     console.log("Connect to MySQL Server successfully!");
  }
});
const strQuery = "CREATE TABLE IF NOT EXISTS `tblsample` ("
+"`id` int(11) NOT NULL auto_increment, "
+"`text` varchar(1024) NOT NULL default '',"
+"PRIMARY KEY  (`id`)"
+")";
connection.query(strQuery, function(error, rows, fi) {
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NodeJs Sample', instance: os.hostname(), condition: true, anyArray: [1,2,3] });
});

router.get('/test/:message', function(req, res, next) {
connection.query("select count(*) as count from `tblsample`", function(error, rows, fi) {
  if (!!error) {
	res.render('test', {count: "Failed!", output: req.params.message});  
  } else {
    let count = rows[0].count;
    console.log(count);
    res.render('test', {count: count, output: req.params.message});}
});
});

router.post('/test/submit', function(req, res, next) {
  let message = {text: req.body.message};
  console.log(message);
  connection.query("INSERT INTO tblsample SET ?", message, function(error, rows, fi) {
  if (!!error) {
    console.log(error);
  } else {
    console.log(rows);
  }
});
  res.redirect('/test/' + req.body.message);
});

module.exports = router;