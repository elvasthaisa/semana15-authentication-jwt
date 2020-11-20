const { JsonWebTokenError } = require('jsonwebtoken');
const colaboradoras = require('../models/colaboradoras');
const SECRET = process.env.SECRET;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const getAll = (req, res) => {
  const authHeader = req.get('authorization');

if (!authHeader) {
  return res.status(401).send("Falta os headers, kiridx!")
}

  const token = authHeader.split(' ')[1];

  jwt.verify(token, SECRET, function(erro) {
    if (erro) {
      return res.status(403).send('Nope');
    }
    
    colaboradoras.find(function(err, colaboradoras){
      if(err) { 
        return res.status(500).send({ message: err.message })
      }
        return res.status(200).send(colaboradoras);
    })
  });
};

const postColaboradora = (req, res) => {
  const senhaComHash = bcrypt.hashSync(req.body.senha, 10);
  req.body.senha = senhaComHash;
  const colaboradora = new colaboradoras(req.body)

  colaboradora.save(function(err){
    if(err) { 
      return res.status(500).send({ message: err.message })
    }
    return res.status(201).send(colaboradora.toJSON())
  }) 
};

const login = (req, res) => {
    colaboradoras.findOne({ email: req.body.email }, function(err, colaboradora) {
        if (!colaboradora) {
            return res.status(404).send(`Não existe colaborada com o email ${req.body.email}`)
        }

        const senhaValida = bcrypt.compareSync(req.body.senha, colaboradora.senha);
        
        const token = jwt.sign({ email: req.body.email }, SECRET);

        return res.status(200).send(token);
    });
}

module.exports = {
  getAll,
  postColaboradora,
  login
};