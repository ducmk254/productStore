const express = require("express"),
      app = express(),
      bodyParser = require("body-parser");
      require("dotenv").config(".env");
const PORT = process.env.PORT,
      mongoose = require("mongoose"),
      morgan = require("morgan");
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${process.env.HOSTNAME}:${process.env.DB_PORT}/${process.env.DB_NAME}`,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
                  .then(()=>{
                      console.log("    connected to db");
                  })
                  .catch(err=>{
                        console.log("!!!!!!!!!!!!!!!!!Cannot connect to DB + error: "+err);
                        process.exit();
                  })
const route = require("./API/routes/index.route");

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

route(app);

app.listen(PORT,()=>console.log("Server is up on "+PORT + " port"));