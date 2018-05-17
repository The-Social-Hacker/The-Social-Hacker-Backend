/*************************************
*   The Social Hacker Blog
*         Main Server
*************************************/
require('dotenv').config()
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// Initializing
const app = express();

// PORT connection
const PORT = process.env.PORT || 3000

/****************************************************
 *  SQL Connection
 ***************************************************/
const Sequelize = require('sequelize');
const sequelize = new Sequelize('socialhacker', process.env.DBUSER, null, { dialect: 'postgres', logging: false });

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err.message);
  });

  /****************************************************
   *  Check for login token on every request
   ***************************************************/
  let verifyAuthentication = (req, res, next) => {
      if (typeof req.cookies.jwtToken === 'undefined' || req.cookies.jwtToken === null) {
        req.user = null;
      } else {
        var token = req.cookies.jwtToken;

        //Synchronous verification
        try{
          decodedToken = jwt.verify(token, process.env.SECRETKEY);
          //console.log("***Authenticate***");
          req.user = decodedToken.id;
        }catch(err){
          console.log("Authentication Error:", err.message);
        };
      };
      next();
    };

  let verifyUserLoggedIn = (req, res)=>{
      if(!req.user){
          res.redirect("/");
      };
      next();
  };

/**************************************
*         Middleware
***************************************/
app.use(express.static(__dirname));
app.use(express.static('./public'));
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));
app.use(verifyAuthentication)

/*****************************************
*          ROUTES LOAD
*****************************************/
require('./controlers/index.js')(app);
require('./controlers/user.js')(app);

/****************************************
*         PORT LISTENER
****************************************/
app.listen(PORT, function() {
  console.log('THE SOCIAL HACKER LISTENING ON PORT', PORT);
});
