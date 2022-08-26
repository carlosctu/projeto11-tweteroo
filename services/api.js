import cors from "cors";
import express from "express";

// Inicializando o express
const app = express();
// subir o servidor local na web e utilizar ele
app.use(cors());
// Dizendo pro express que iremos ter dados em JSON
// e que vai precisa fazer um parse para que o js possa ler eles
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const users = [];
const tweets = [];

app.post("/sign-up", (req, res) => {
  // Object.keys pega os ids do objeto
  // Object.values pega os valores dos ids
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);
  const validateKeys = keys[0] === "username" && keys[1] === "avatar";
  const validateValues = values[0] && values[1];

  if (validateKeys && validateValues) {
    users.push(req.body);
    res.status(201).send("Ok");
  } else {
    res.status(400).send("Todos os campos são obrigatórios!");
  }
});

app.post("/tweets", (req, res) => {
  const user = req.get("User");
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);
  // const validateKeys = keys[0] === "username" && keys[1] === "tweet";
  // const validateValues = values[0] && values[1];
  const validateKeys = user && keys[0] === "tweet";
  const validateValues = values[0];

  if (validateKeys && validateValues) {
    tweets.push({ id: tweets.length + 1, ...req.body });
    res.status(201).send("Ok");
  } else {
    res.status(400).send("Todos os campos são obrigatórios!");
  }
});

app.get("/tweets", (req, res) => {
  let lastTweets = [];
  for (let i = 0; i < tweets.length; i++) {
    if (lastTweets.length === 10) break;

    let lastTweet = tweets.length - (i + 1);
    
    const userAvatar = users.find(
      (user) => tweets[lastTweet].username === user.username
    );

    lastTweets.push({
      ...tweets[lastTweet],
      avatar: userAvatar.avatar,
    });
  }

  res.status(200).send(lastTweets);
});

app.get("/tweets/:username", (req, res) => {
  const username = req.params.username;
  const avatar = users.find((user) => user.username === username);

  let userTweets = [];

  tweets.map((tweet) => {
    if (tweet.username === username) {
      userTweets.push({ ...tweet, avatar: avatar.avatar });
    }
  });

  res.status(200).send(userTweets);
});

app.listen(5000, () => {
  console.log("Inicializando porta 5000");
});
