const User = require('../user/model')
const Fav = require('./model')

exports.create = async (req, res) => {
    const { name, favs } = req.body
    const email = req.email
    try{
        const user = await User.findOne({email})
        const fav = new Fav({
            name,
            favs
        })
        const favSaved = await fav.save()
        const favId = favSaved._id
        const favArray = [...user.favs, favId]
        const userUpdated = await User.findOneAndUpdate(
            { email },
            {favs: favArray},
            {new: true}
        )
        res.status(200).json({
            "message": "Fav created",
            userUpdated,
            favSaved
        })
    } catch(e){
        res.status(500).send({
            "message": "Something wrong",
            "error": e.message
        })
    }
}

exports.getAll = async (req, res) => {
    const email = req.email
    try{
        const user  = await User.findOne({email}).populate("favs")
        res.status(203).json({
            "message": "Favs found",
            "favs": user.favs
        })
    } catch(e){
        res.status(400).json({
            "message": e.message
        })
    }    
}

exports.getOne = async (req, res) => {
    const email = req.email
    const { id } = req.params
    const user  = await User.findOne({email})
    const idList = user.favs
    try{
        const Favs = await Fav.findById(id)
        if(idList.includes(id)){
            res.status(200).json({
                "message": "Fav found",
                Favs
            })
        } else {
            res.status(403).json({
                "message": "Not authorized",
            })
        }
    }catch(e){
        res.status(500).json({"error": "id inválido"})
    }
}



exports.delete = async (req, res) => {
    const email = req.email
    const { id } = req.params
    const user  = await User.findOne({email})
    const idList = user.favs
    try {
        const Favs = await Fav.findByIdAndDelete(id)
        if(idList.includes(id)){
            const favArray = idList.filter(x => x.toString() !== id)
            await User
            .findOneAndUpdate(
                { email },
                {favs: favArray},
                {new: true}
            )
            res.status(200).json({
                "message": "Favs deleted",
                "Favs deleted": Favs
            })
        } else {
            res.status(400).json({
                "message": "Not authorized",
            })
        }
    } catch (error) {
        res.status(500).json({"error": "id inválido"})
    } 
}