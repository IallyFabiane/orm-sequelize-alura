const database = require('../models')
const Services = require('./Services')

class PessoasServices extends Services {
    constructor () {
        super('Pessoas')
        this.matriculas = new Services('Matriculas')
    }
    //métodos específicos do PessoasController
    async pegaRegistrosAtivos ( where = {} ) {
        return database[this.nomeDoModelo].findAll({ where: {...where}})
    }
    async pegaTodosOsRegistros ( where = {} ) {
        return database[this.nomeDoModelo].scope().findAll({ where: {...where}})
    }
    async cancelaPessoaEMatriculas (estudanteId) {
        return database.sequelize.transaction(async transacao => {
            await super.atualizaRegistro( { ativo: false }, estudanteId, { transaction: transacao })
            await this.matriculas.atualizaRegistros( { sataus: 'cancelado'}, {estudante_Id: estudanteId }, { transaction: transacao })
        })
    }
    async pegaMatriculasPorEstudante(where = {}) {
        const matriculas = await database[this.nomeDoModelo]
          .findOne({ where: { ...where } })
        return matriculas.getAulasMatriculadas()
      }
}
module.exports = PessoasServices