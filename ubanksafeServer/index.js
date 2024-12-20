const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/config')
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({origin:["http://localhost:3000", "http://localhost:3001"]}));
app.use(express.urlencoded())
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require("./Route/route"))

app.listen(process.env.PORT || PORT, (req, res) => {
  console.log("http://" + config.DB_HOST + ":" + PORT);
})