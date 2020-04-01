const express        = require("express");
const CONFIG         = require('./config/config');
const methodOverride = require('method-override');
const bodyParser     = require("body-parser");
const cookieSession  = require('cookie-session');
const flash          = require('express-flash');
const passport       = require('passport');
const cors 					 = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8080",
	credentials: true
};

app.use(cors(corsOptions));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'))
app.use(passport.initialize());

let expiryDate = new Date(Date.now() + 60 * 60 * 1000);
app.use(cookieSession({
  name: 'session',
  keys: ["key 1"],
	cookie: {
		path: '/',
		expires: expiryDate
	}
}));

app.use(flash());
const userRoutes = require("./routes/users");
const urlRoutes = require("./routes/urls");
const uRoutes = require("./routes/u");
app.use("/users", userRoutes);
app.use("/urls", urlRoutes);
app.use("/u", uRoutes);


const models = require("./models");

models.sequelize.authenticate().then(() => {
	console.log('Connected to SQL database:', CONFIG.db_name);
})
.catch(err => {
	console.error('Unable to connect to SQL database:',CONFIG.db_name, err);
});

if (CONFIG.app==='dev') {
	//creates table if they do not already exist
	models.sequelize.sync();
	
	//deletes all tables then recreates them useful for testing and development purposes
	//models.sequelize.sync({ force: true });
}



// Main page rendering
app.get("/", (req, res) => {
  let user_id = req.session.user_id;
  
  if (user_id) {
    res.redirect("/urls");
  } else {
		res.status(200).send("Home Page");
  }
});

app.listen(CONFIG.port, () => {
  console.log(`Server running on port ${CONFIG.port}.... is there anybody out there?`);
});
