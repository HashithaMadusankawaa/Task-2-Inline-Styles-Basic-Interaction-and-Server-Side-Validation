const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();
const tempStorage = []; 

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));


app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login");
  });



app.post("/submit", async (req, res) => {
    const { name, email, password, phone, age, gender } = req.body;
  
    
    if (!/^\d{10}$/.test(phone)) {
      return res.send("<h1>Error: Phone number must be 10 digits</h1>");
    }
  
    if (age < 18 || age > 100) {
      return res.send("<h1>Error: Age must be between 18 and 100</h1>");
    }
  
    if (password.length < 6) {
      return res.send("<h1>Error: Password must be at least 6 characters long</h1>");
    }
  
    try {
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
     
      tempStorage.push({
        name,
        email,
        password: hashedPassword,
        phone,
        age,
        gender,
      });
  
      console.log("Validated and Hashed Data:", tempStorage);
  
      res.send(`<h1>Thank you, ${name}! Your data has been securely stored.<a href="/login" style="text-decoration: none; color: blue;">Go to Login</a></h1>`);
    } catch (error) {
      console.error("Error hashing password:", error);
      res.status(500).send("<h1>Internal Server Error</br></h1>");
    }
  });

  app.post("/loginsubmit", async (req, res) => {
    const { email, password } = req.body;

    const user = tempStorage.find((user) => user.email === email);

    if (!user) {
        return res.send("<h1>Error: No user found with that email.</h1>");
      }

      try {
        
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (isMatch) {
          res.send(`<h1>Welcome back, ${user.name}!</h1>`);
        } else {
          res.send("<h1>Error: Incorrect password.</h1>");
        }
      } catch (error) {
        console.error("Error verifying password:", error);
        res.status(500).send("<h1>Internal Server Error</h1>");
      }
  });



app.listen(3000);