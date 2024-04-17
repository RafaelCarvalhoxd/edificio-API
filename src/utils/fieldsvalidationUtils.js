const { validateField } = require('./requiredvalidationUtils')

const validateNome = validateField('nome');
const validateLocalizacao = validateField('localizacao');
const validateCnpj = validateField('cnpj');
const validateImagem = validateField('imagem');
const validateEdfCadastrado = validateField('edf_cadastrado');

module.exports = { validateNome, validateLocalizacao, validateCnpj, validateImagem, validateEdfCadastrado }
