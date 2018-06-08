const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Chatkit = require("pusher-chatkit-server");

const chatkit = new Chatkit.default({
  instanceLocator: "v1:us1:58a0e37c-e074-4082-bcca-2bb3631910e2",
  key:
    "7e8682a9-d3e7-4746-9e51-5c73c229cd4f:Q7fCg2ZeR4hKd42sgYU9dq9myB2ccmo6vE5wvtshDQQ="
});
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post("/users", (req, res) => {
  const { username } = req.body;
  const user = { name: username, id: username };
  chatkit
    .createUser(user)
    .then(() => {
      console.log("Created User ", user.name);
      res.status(201).json(user);
    })
    .catch(error => {
      if (error.error === "services/chatkit/user_already_exists") {
        console.log("User already exists ", user.name);
        res.status(201).json(user);
      } else {
        console.error(error);
        res.status(error.status).json(error);
      }
    });
});

app.listen(3001);
console.log("Running on port 3001");
