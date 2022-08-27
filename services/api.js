import cors from "cors";
import express from "express";

//#region 
// Incializando o express
const app = express();
// Permitindo que o Front se comunique com o back
app.use(cors());
// Dizendo pro express que os dados virão em json e ele precisará fazer o parse
app.use(express.json());
//#endregion

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
  res.status(201).send({ message: "OK", user: { username, avatar } });
});

app.post("/tweets", (req, res) => {
  const { tweet } = req.body;
  const username = req.get("User");
  // Fast fail
  if (!tweet || !username) {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }
  // #Refatorando
  // Adicionando o avatar no post do tweet para retirar o find dos anteriores commits
  // nos endpoints (get) abaixo
  const avatar = users.find((user) => user.username === username);

  // Adicionando o último tweet no começo para facilitar o tratamento dos dados
  tweets.unshift({
    id: tweets.length + 1,
    username,
    avatar: avatar.avatar,
    tweet,
  });

  res.status(201).send({ message: "OK", tweet: { username, tweet } });
});

app.get("/tweets", (req, res) => {
  const { page } = req.query;
  // Como o query string é opcional, fazemos um ternario
  // para atribuir um pageNumb = 1 caso page não vier
  const pageNumb = page ? parseInt(page, 10) : 1;
  // Fast fail
  if (!pageNumb > 0) {
    return res.status(400).send("Informe uma página válida!");
  }

  let lastTweets = [];

  if (pageNumb > 1) {
    const end = pageNumb * 10;
    const start = pageNumb * 10 - 10;
    return res.status(200).send(tweets.slice(start, end));
  }

  for (let i = 0; i < tweets.length; i++) {
    if (lastTweets.length === 10) break;
    lastTweets.push(tweets[i]);
  }
  res.status(200).send(lastTweets);
});

app.get("/tweets/:username", (req, res) => {
  const { username } = req.params;
  const userTweets = tweets.filter((tweet) => tweet.username === username);
  res.status(200).send(userTweets);
});

app.listen(5000, () => {
  console.log("Inicializando porta 5000");
});
