const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const mysql = require('mysql');
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }))


app.use(express.static(__dirname + "/public"));

app.set('views', path.join(__dirname +"/public"));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+"/public/home.html"))
})

app.get("/signup",(req,ref) => {
res.sendFile(path.join(__dirname+"/public/sign up page.html"))
})

app.post('/signup', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const cPassword = req.body.cpassword;
  let data = {}
  if (password == cPassword) {
    data = {
      name: name,
      email: email,
      password: password
    }
    // connect to database
    let connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "ic project"
    });

    connection.connect();
    console.warn("db connected")

    connection.query("INSERT INTO users SET ? ", data,
      function (error, result, fields) {
        if (error) throw error;
        console.warn("insertion successful");
      });

    connection.end();
    res.sendFile(path.join(__dirname+"/public/home.html"))
  } 
else {
  res.sendFile(path.join(__dirname+"/public/sign up page.html"))
    console.log('Error');
  }
})







app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ic project"
  });
  connection.connect();
  console.log("db connected");

  connection.query("SELECT email, password FROM users where email=?", email,
    function (error, result) {
      if (error) {
        throw error;
      } else {
        if (result.length == 0) {

          console.log('name not available');
          res.sendFile(path.join(__dirname+"/public/sign up page.html"))
        } else if (result[0].password == password) {
          console.log("loging succesful");
          res.sendFile(path.join(__dirname+"/public/welcom.html"))
        } else {
          console.log('invalid user and password');
          res.sendFile(path.join(__dirname+"/public/home.html"))
        }
      }
    });
  connection.end();
})


app.get("/apply",(req,res) => {
  res.sendFile(path.join(__dirname+"/public/application.html"))
  })

  app.post("/apply", (req, res) => {
    const name = req.body.name;
    
    const email = req.body.email;
   const address = req.body.address;
   
    let userData = {
      name :name,
      
      email: email,
     
      address: address,
     
    }
  var connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "ic project"
    });
    connection.connect();
    console.log("db connected");

    connection.query("INSERT INTO application SET ? ", userData,
      function (error, result, fields) {
        if (error) throw error;
        console.warn("insertion successful");
        res.sendFile(path.join(__dirname+"/public/applicationdone.html"))
      });

    connection.end();
    res.sendFile(path.join(__dirname+"/public/applicationdone.html"))
  

})
  
    

app.post("/loginadmin", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ic project"
  });
  connection.connect();
  console.log("db connected");

  connection.query("SELECT email, password FROM admin where email=?", email,
    function (error, result) {
      if (error) {
        throw error;
      } else {
        if (result.length == 0) {

          console.log('name not available');
          res.sendFile(path.join(__dirname+"/public/home.html"))
        } else if (result[0].password == password) {
          console.log("loging succesful");
          // res.sendFile(path.join(__dirname+"/public/welcom.html"))

           res.redirect('admin');
        } else {
          console.log('invalid user and password');
          res.sendFile(path.join(__dirname+"/public/home.html"))
        }
      }
    });
  connection.end();
})


app.get("/admin", function (req, res) {
  //   res.sendFile(path.join(__dirname + "/admin.html"));
  // var mysql = require("mysql"); // npm i msql
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ic project",
  });
  connection.connect();
  console.log("connected to db");
  //2
  connection.query("SELECT * FROM application", function (err, result) {
    if (err) throw err;
    res.render("admin", { bdata: result });
  });
  connection.end();
});


// delete start
app.get("/users/delete/(:id)", function (req, res) {
  var did = req.params.id; // id read from the front end

  var mysql = require("mysql"); //connect to database
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ic project",
  });
  connection.connect();
  var sql = "DELETE FROM application WHERE id=?";
  connection.query(sql, did, function (err, result) {
    console.log("deleted record");
  });
  connection.end();
  res.redirect(req.get("referer"));
});
// delete end

//accept or reject
app.get("/users/edit/(:id)/(:s)", function (req, res) {
  var id = req.params.id; // get the id from FE
  var sel = req.params.s;

  if (sel == 0) {
    sel = 1;
  } else {
    sel = 0;
  }
  // connect to db
  // var mysql = require("mysql");
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ic project",
  });
  connection.connect();
  // query to accept or reject

  let udata = [sel, id];
  connection.query(
    "UPDATE application SET Status=? WHERE id=?",
    udata,
    function (err, res) {
      if (err) throw err;
      console.log("updated");
    }
  );
  connection.end();
  res.redirect(req.get("referer"));
});

app.get("/Status", function (req, res) {
  //   res.sendFile(path.join(__dirname + "/admin.html"));
   
    var connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "ic project",
    });
    connection.connect();
    console.log("connected to db");
    //2
    connection.query("SELECT * FROM application", function (err, result) {
      if (err) throw err;
      res.render("Status", { bdata: result });
    });
    connection.end();
  });


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
