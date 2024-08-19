const {Reference} = require('../models')

exports.createRef = async (req, res) => {
    const data = req.body;
  
    let ref = await Reference.create(data)
  
    return res.json(ref);
};

exports.deleteRef = async (req, res) => {
    const id = req.params.id
    console.log("ID: ", id)
    let ref = await Reference.findByPk(id)
    await ref.destroy()

    return res.json({message: "Deleted successfully"})
}

exports.getRef = async(req, res) => {
    const {name} = req.query
    let refs = await Reference.findAll({where: {field: name}})
    return res.json(refs)
}