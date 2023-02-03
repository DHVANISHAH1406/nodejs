var mysql = require("mysql");
const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const app = express();
const bcrypt = require("bcryptjs");
var router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
var con = mysql.createConnection({
  host: "192.168.2.8",
  user: "trainee",
  password: "trainee@123",
});
app.post("/cregister", function (req, res) {
    const id = req.body.id;
    const Fname = req.body.Fname;
    const Lname = req.body.Lname;
    const Email = req.body.Email;
    const Pass = req.body.Pass;
    const Cpass = req.body.Cpass;
    const phone=req.body.phone;
    const Gender=req.body.Gender;
    const Addr=req.body.Addr;
    const Dob=req.body.Dob;
    
  let useobj={
    email : Email,
    cpass : Pass
  }
    let accesstoken = jwt.sign(useobj, "secretkey", { expiresIn: 300 });
  
    if (Pass !== Cpass) {
      console.log("PASSWORD DOES'T MATCH!");
      res.send({ message: "PASSWORD DOES'T MATCH!" });
    } else {
      if (
        !String(Fname).trim() ||
        !String(Lname).trim() ||
        !String(Email).trim() ||
        !String(Pass).trim() ||
        !String(Cpass).trim()||
        !String(phone).trim()||
        !String(Gender).trim()||
        !String(Addr).trim()||
        !String(Dob).trim()
      ) {
        console.log("Filed Requied");
        res.send({ message: "Filed Requied"  });
      } else {
        con.connect(function (err) {
          var sql = `INSERT INTO  trainee.dcustomer(id,Fname,Lname,Email,Pass,Cpass,phone,Gender,Addr,Dob,accesstoken) VALUES ('${id}','${Fname}','${Lname}','${Email}','${Pass}','${Cpass}','${phone}','${Gender}','${Addr}','${Dob}','${accesstoken}')`;
          con.query(sql, function (err, result) {
            if (err) throw err;
            res.send({message:"ok",token:accesstoken,Email:Email });
          });
        });
      }
    }
  });
  app.post("/clogin", function (req, res) {
    const Email = req.body.Email;
    const Pass = req.body.Pass;
    let useobj={
      email : Email,
      Pass : Pass
    }
    let accesstoken = jwt.sign(useobj, "secretkey", { expiresIn: 300 });
    // let accesstoken = jwt.sign(req.body, "secretkey", { expiresIn: 300,});
    con.query(
      "SELECT *FROM trainee.dcustomer where Email=? and Pass=?",
      [Email, Pass],
      (err, result) => {
        if (err) {
          req.setEncoding({ err: err });
        } else {
          if (result.length > 0) {
            res.send({result,token:accesstoken,Email:Email});
          //   request.session.loggedin = true;
				  //   request.session.Fname = Fname;
				  //  response.redirect('/Home');
                 
          } else {
            res.send({ message: "WRONG USERNAME OR PASSWORD" });
            
          }
        }
      }
    );
  });
  
  app.post("/token", function (req, res) {
    // const accesstoken = req.body.accesstoken;
    con.query("SELECT *FROM trainee.dcustomer", (err, result) => {
      try {
        result.map((val, i) => {
          
          
          if (val.accesstoken == req.body.token) {
            
            res.json({ flag: true });
            console.log(true);
            // console.log(req.body.token);
            // console.log(val.accesstoken);
          }
        });
      } catch (err) {
        console.log(err);
      }
     
    });
   
  });
  // app.get('/home', function(request, response) {
  //   // If the user is loggedin
  //   if (request.session.loggedin) {
  //     // Output username
  //     response.send('Welcome back, ' + request.session.Fname + '!');
  //   } else {
  //     // Not logged in
  //     response.send('Please login to view this page!');
  //   }
  //   response.end();
  // });
  app.get("/get",function(req,res){
  const Email=req.body.Email
    con.connect( function(err) {
      con.query("SELECT * FROM trainee.dcustomer WHERE Email=?",[Email], function (err, result, fields) {
          res.send(result)
     });
 });
});
let PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is up and running on ${PORT} ...`);
});
