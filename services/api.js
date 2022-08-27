import cors from "cors";
import express from "express";

const app = express();
// Permitindo que o Front se comunique com o back
app.use(cors());
// Dizendo pro express que os dados virão em json e ele precisará fazer o parse
app.use(express.json());

const users = [];
const tweets = [];

app.post("/sign-up", (req, res) => {
  // Desestruturação
  const { username, avatar } = req.body;
  // Fast fail
  if (!username || !avatar) {
    return res.status(400).send({ error: "Todos os campos são obrigatórios!" });
  }
  // add username: username e avatar: avatar
  users.push({ username, avatar });
  res.status(201).send({ message: "Ok", user: { username, avatar } });
});

app.post("/tweets", (req, res) => {
  const { tweet } = req.body;
  const username = req.get("User");
  if (!tweet || !username) {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }

  tweets.push({
    // Adicionando um id que vai aumentando conforme a qtd dos tweets
    id: tweets.length + 1,
    username,
    tweet,
  });

  res.status(201).send({ message: "Ok", tweet: { username, tweet } });
});

app.get("/tweets", (req, res) => {
  const { page } = req.query;
  // Fast fail: caso a página comece em zero
  if (!pageNumb > 0) {
    return res.status(400).send("Informe uma página válida!");
  }
  
  const pageNumb = parseInt(page, 10);
  let lastTweets = [];

  console.log(page);
  // Caso o query string (página) seja > 1
  if (pageNumb > 1 && tweets.length >= pageNumb * 10 - 10) {
    for (let i = 0; i < tweets.length - 10; i++) {
      const userAvatar = users.find(
        (user) =>
          tweets[tweets.length - 10 - (i + 1)].username === user.username
      );
      lastTweets.push({
        ...tweets[tweets.length - 10 - (i + 1)],
        avatar: userAvatar.avatar,
      });
    }
    return res.status(200).send(lastTweets);
  }

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
