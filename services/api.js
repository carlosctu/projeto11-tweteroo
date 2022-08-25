import express from "express";

const app = express();
// isso daqui fará com que o nosso body detecte
//  os dados JSON e fará o parse desses dados
// para que possamos visualizar eles através do body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const users = [
  {
    username: "Vovo Juju",
    avatar:
      "https://super.abril.com.br/wp-content/uploads/2020/09/04-09_gato_SITE.jpg?quality=70&strip=info",
  },
];

app.post("/sign-up", (req, res) => {
  console.log(req.body);
  res.status(201).send("Ok");
});

app.listen(5000, () => {
  console.log("Inicializando porta 5000");
});
