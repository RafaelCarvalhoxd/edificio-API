
function validateField(fieldName) {
    return function(req, res) {
        if (!req.body[fieldName]) {
            return res.status(422).json({ error: `${fieldName} é obrigatorio` });
        }
    };
}  
          
module.exports = { validateField }