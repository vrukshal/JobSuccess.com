//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.use(express.json());

mongoose.connect(`mongodb+srv://vrukshal:${process.env.mongoPass}@cluster0.agw6grb.mongodb.net/Users?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    userID: String,
    firstName: String,
    lastName: String,
    Email: String,
    Password: String,
    ProfilePicture: String,
    Bio: String,
    Company: String,
    Position: String,
    Location: String,
    Education: String,
    ConnectionStatus: String
});

const User = new mongoose.model("User",userSchema);




app.get("/users",async function(req,res){
    try{
        const user_data = await User.find();
        res.send(user_data);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
});





app.post("/users", async function(req,res){


    try{

        const new_user = new User({
            userID: req.body.userID,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            Email: req.body.Email,
            Password: req.body.Password,
            ProfilePicture: req.body.ProfilePicture,
            Bio: req.body.Bio,
            Company: req.body.Company,
            Position: req.body.Position,
            Location: req.body.Location,
            Education: req.body.Education,
            ConnectionStatus: req.body.ConnectionStatus
            });
            await new_user.save(); 
            res.status(201).json(new_user); 
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
});

app.patch("/users/:userID", async function (req, res) {
    const userID = req.params.userID;

    try {
        const user = await User.findOne({ userID });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        for (const key in req.body) {
            if (Object.hasOwnProperty.call(req.body, key)) {
                if (userSchema.obj.hasOwnProperty(key)) {
                    user[key] = req.body[key];
                }
            }
        }

        await user.save();
        res.json(user); // Respond with the updated user data
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



        
   

app.listen(3000, function() {
  console.log("Server started on port 3000");
});