const { JsonWebTokenError } = require('jsonwebtoken');

//apontamento do model que criamos para as Tarefas
const tarefas = require('../models/tarefas');
const SECRET = process.env.SECRET;
const jwt = require('jsonwebtoken');

const getAll = (req, res) => {
  const authHeader = req.get('authorization');
  // console.log(`Meu header: ${authHeader}`)

  if (!authHeader) {
    return res.status(401).send('Não foi encontrado nenhum Header');
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, SECRET, function(err) {
    if(err) {
      return res.status(403).send('Acesso negado: O token não é válido');
    }

    tarefas.find(function(err, tarefas){
      if(err) { 
        return res.status(500).send({ message: err.message })
      }
      return res.status(200).send(tarefas);
    })
  });
};

const getById = (req, res) => {
  const id = req.params.id;
  //Find sempre retorna uma lista
  //FindOne retorna um unico documento
  tarefas.find({ id }, function(err, tarefas){
    if(err) { 
      return res.status(500).send({ message: err.message })
    }

    return res.status(200).send(tarefas);
  })
};

const postTarefa = (req, res) => {
  console.log(req.body)
  
  let tarefa = new tarefas(req.body)

  tarefa.save(function(err){
    if(err) { 
      return res.status(500).send({ message: err.message })
    }
    return res.status(201).send(tarefa.toJSON())
  })
  
};

const deleteTarefa = (req, res) => {
  const id = req.params.id;

  tarefas.find({ id }, function(err, tarefa){
    if(tarefa.length > 0){
      tarefas.deleteMany({ id }, function(err){
        if(err) { 
          return res.status(500).send({ 
            message: err.message, 
            status: "FAIL" 
           })
        }
        return res.status(200).send({ 
          message: 'Tarefa removida com sucesso', 
          status: "SUCCESS" 
        })
      })
    }else{
      return res.status(200).send({ 
        message: 'Não há tafera para ser removida', 
        status: "EMPTY" 
      })
    }
  })
};

const deleteTarefaConcluida = (req, res) => {
  //Deleta quando concluido = true
  try {
    tarefas.deleteMany({ concluido: true }, function (err) {
        if (!err) {
            return res.status(200).send({ message: 'Tarefas concluidas removidas com sucesso', status: "SUCCESS" })
        }
    })
  } catch (err) {
    console.log(err)
    return res.status(424).send({ message: err.message })
  }
}

const putTarefa = (req, res) => {
  const id = req.params.id;

  tarefas.find({ id }, function(err, tarefa){
    if(tarefa.length> 0){
      //faz o update apenas para quem respeitar o id passado no parametro
      // set são os valores que serão atualizados
      //UpdateMany atualiza vários registros de uma unica vez
      //UpdateOne atualiza um único registro por vez
      
      tarefas.updateMany({ id }, { $set : req.body }, function (err) {
        if (err) {
          return res.status(500).send({ message: err.message })
        }
        return res.status(200).send({ message: "Registro alterado com sucesso"})
      })
    }else {
      return res.status(200).send({ message: "Não há registros para serem atualizados com esse id"})
    }
  })

}

module.exports = {
  getAll,
  getById,
  postTarefa,
  deleteTarefa,
  deleteTarefaConcluida,
  putTarefa
};
