//importação pacotes

const express = require("express");
const app = express();

const bodyParser = require("body-parser");

//config bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
//conversão JSON
app.use(bodyParser.json());

//import cors
const cors = require("cors");

//import mongoose
const mongoose = require("mongoose");

//string de conexão MongoBD

const uri =
  "mongodb+srv://usuario:<senha>@cluster0.bwug3.mongodb.net/banco-de-dados?retryWrites=true&w=majority";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Conexão realizada!");
  })
  .catch((error) => {
    console.log(error);
  });

//import user e room
var User = require("./models/user");
var Room = require("./models/room");

//server da aplicação
var port = 4000;

//definição para usar instancias de rotas do express
var router = express.Router();

//Definição de middleware para acessar solicitações enviadas - API
router.use(function (req, res, next) {
  console.log("Pagina inicial do middleware");
  //definindo site de origem. O * permite qualquer site faça conexão.
  //Coloque uma URL do front no lugar do *, caso existir.
  res.header("Access-Control-Allow-Origin", "*");
  //definindo os metodos
  res.header("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST");
  //config do cors
  app.use(cors());
  next();
});

//rota raiz
app.get("/", (req, res) => {
  res.send("Bem vindo");
});

app.get("/test", (req, res) => {
  res.send("Teste!");
});

/**
 * Rota de verificação da API
 */
router.get("/", function (req, res) {
  res.json({
    message: "Acesso a aplicação."
  });
});

/**
 * rotas vinculadas ao modelo user, terminadas em /users (acesso: POST e GET)
 */
router
  .route("/users")

  /**
   * POST - cadastro do usuário na aplicação
   * http://localhost:4000/api/users
   */
  .post(function (req, res) {
    var user = new User();
    user.name = req.body.name;
    user.login = req.body.login;
    user.password = req.body.password;

    user.save(function (error) {
      if (error) res.send(error);
      res.json({ message: "Usuário cadastrado no Dados" });
    });
  })

  /**
   * GET - retornar lista de usuários da aplicação
   * http://localhost:4000/api/users
   */
  .get(function (req, res) {
    User.find(function (error, users) {
      if (error) res.send(error);
      res.json(users);
    });
  });

//Rotas terminadas em '/users/:id' (rotas acessadas pelos verbos GET, PUT e DELETE)
router
  .route("/users/:id")

  /**
   * Método GET: retornar um usuário específico pelo id
   * Acesso: GET http://localhost:4000/api/users/:id
   */
  .get(function (req, res) {
    User.findById(req.params.id, function (error, user) {
      if (error) res.send(error);
      res.json(user);
    });
  })

  /**
   * Método PUT: atualizar um usuário específico pelo id
   * Acesso: PUT http://localhost:4000/api/users/:id
   */
  .put(function (req, res) {
    User.findById(req.params.id, function (error, user) {
      if (error) res.send(error);
      //A solicitação os dados para serem validados pelo esquema 'user'
      user.name = req.body.name;
      user.login = req.body.login;
      user.password = req.body.password;
      user.save(function (error) {
        if (error) res.send(error);
        res.json({ message: "Usuário atualizado!" });
      });
    });
  })

  /**
   * Método DELTE: excluir um usuário específico pelo id
   * Acesso: DELETE http://localhost:4000/api/users/:id
   */

  .delete(function (req, res) {
    User.remove(
      {
        _id: req.params.id
      },
      function (error) {
        if (error) res.send(error);
        res.json({ message: "Usuário excluído!" });
      }
    );
  });

//rota para acessar
router
  .route("/rooms")

  /**
   * Metodo POST: cadastrar uma sala
   * Acesso: http://localhost:4000/api/rooms
   */

  .post(function (req, res) {
    var room = new Room();
    room.name = req.body.name;
    room.capacity = req.body.capacity;

    room.save(function (error) {
      if (error) res.send(error);
      res.json({ message: "Sala cadastrada!" });
    });
  })

  /**
   * Método GET: Retornar salas
   * Acesso: GET http://localhost:4000/api/rooms
   */

  .get(function (req, res) {
    Room.find(function (error, rooms) {
      if (error) res.send(error);
      res.json(rooms);
    });
  });

//rotas terminadas em '/rooms/:id' (rotas dos verbos GET, PUT e DELETE)
router
  .route("/rooms/:id")

  /**
   * Método GET: retorna sala por id
   * Acesso: GET http://localhost:4000/api/rooms/:id
   */
  .get(function (req, res) {
    Room.findById(req.params.id, function (error, room) {
      if (error) res.send(error);
      res.json(room);
    });
  })

  /**
   * Método PUT: atualização sala por id
   * Acesso: PUT http://localhost:4000/api/rooms/:id
   */
  .put(function (req, res) {
    Room.findById(req.params.id, function (error, room) {
      if (error) res.send(error);
      //solicitação de dados para serem validados pelo schema 'rooms'
      room.name = req.body.room;
      room.capacity = req.body.capacity;
      room.save(function (error) {
        if (error) res.send(error);
        res.json({ message: "Sala atualizada!" });
      });
    });
  })

  /**
   * Método DELETE: excluir sala por id
   * Acesso: DELETE http://localhost:4000/api/rooms/:id
   */
  .delete(function (req, res) {
    Room.remove(
      {
        _id: req.params.id
      },
      function (error) {
        if (error) res.send(error);
        res.json({ message: "Sala excluída!" });
      }
    );
  });

app.use("/api", router);

app.listen(port);
console.log("Iniciando a aplicação na porta " + port);
