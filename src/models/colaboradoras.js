const mongoose = require('mongoose');

const colaboradorasSchema = new mongoose.Schema({
    id : { type : Number},
    nome : { type: String },
    email: { type: String },
    senha: { type: String }
},{
    //gera por padrão uma versão para cada atualização do documento
    versionKey: false
});

const colaboradoras = mongoose.model('colaboradoras', colaboradorasSchema);

// exportar o model para ser utilizado
module.exports = colaboradoras;
