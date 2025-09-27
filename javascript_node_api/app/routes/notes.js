var express = require('express');
var router = express.Router();
const Note = require("../models/note");
const withAuth = require('../middlewares/auth');


router.post("/", withAuth , async function(req,res){
    const {title, body} = req.body
    try{
        let note = new Note({title: title, body: body, author: req.user._id})
        await note.save()
        res.status(200).json({note})

    }catch(e){
        res.status(500).json({error: "error when creating note"})
    }
})

router.get("/:id", withAuth , async function(req, res){
  const {id} = req.params
  try{
    let note = await Note.findById(id)
    if (isOwens(req.user , note)){
        res.status(200).json({note})
    }else{
        req.status(403).json({error: "Access denied"})
    }
    
  }catch(e){
     res.status(500).json({error: "error when downloading grade"})
  }
})

router.get("/", withAuth , async function(req, res) {

    try{
      let notes = await Note.find({author : req.user._id})
     res.json({notes})
    }catch(e){
      res.status(500).json({error: "Error loading notes"})
    }
})

router.put("/:id", withAuth , async function(req, res){
  
  const { title, body} = req.body  
  const {id} = req.params
  try{
    let note = await Note.findById(id)
    if (isOwens(req.user , note)){
        let note = await Note.findOneAndUpdate({_id: id}, 
            {$set: { title : title, body : body}},
            {upsert: true , "new" : true}
        )
        res.json({note})
    }else{
        req.status(403).json({error: "Access denied"})
    }
    
  }catch(e){
     res.status(500).json({error: "Error updating note"})
  }
})

const isOwens = (user, note) =>{
    if(JSON.stringify(user._id) == JSON.stringify(note.author))
        return true
    else
        return false

}

module.exports = router