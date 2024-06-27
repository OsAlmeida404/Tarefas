const express =  require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const {Sequelize, DataTypes} = require("sequelize");

dotenv.config();

const app = express();
const PORT = process.env.PORT ||5000;

//Middleware

app.use(cors());
app.use(express.json());

//conexão com o banco de dados 

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
    }

);

//model para tarefas

const Tarefa = sequelize.define("tarefas", {
    tarefas_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    titulo:{
        type: DataTypes.STRING(255),

    },

    descricao:{
        type: DataTypes.TEXT,

    },

    data_vencimento:{
        type: DataTypes.DATE,

    },

    prioridade:{
        type: DataTypes.ENUM("baixa", "media", "alta"),

    },

    status:{
        type: DataTypes.ENUM("a fazer", "em pregresso", "completada"),

    },

});

//Sincronizar model com banco de dados 

sequelize 
.sync({alter:true})
.then(() => console.log("Database synced"))
.catch((err) => console.error("Error syncing database:", err));

//Rotas

app.get("/tarefas", async(req, res) => {
    try{
        const tarefas = await Tarefa.findAll();
        res.json(tarefas);

    } catch (err) {
        console.error(err);
        res.status(500).json({menssage: "Internal server error"})
    }

});

//Rota para criar uma nova tarefa

app.post("/tarefa", async (req, res) =>{
    try{
        const { titulo, descricao, data_de_vencimento, prioridade, status} = req.body;
        const novaTerra = await Tarefa.create({
            titulo,
            descricao,
            data_de_vencimento,
            prioridade,
            status,
        });
        res.status(201).json(novaTarefa);
    } catch(err) {

        console.error(err);
        res.status(500).json({menssage: "Internal server error"});

    }
});

//Start no servidor

app.listen(PORT, () => {
    console.log(`Server running on port &{PORT}`);

});