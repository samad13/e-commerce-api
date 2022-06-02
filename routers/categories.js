const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const categoryList = await Category.find();

    if(!categoryList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(categoryList);
});

router.get('/:id', async(req, res)=>{
    const category = await Category.findById(req.params.id);

    if(!category) {
        res.status(500).json({message: 'The category with the given in doesnt exist'})
    }
    res.status(200).send(category);
})

router.post('/', async(req, res)=>{
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    category = await category.save();

    if(!category)
    return res.status(404).send('this category cannot be created')

    res.send(category);
});


router.put('/:id', async (req, res)=>{
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        },
        {new: true}
    )
    if(!category)
    return res.status(404).send('this category cannot be updated')

    res.send(category);
});




router.delete('/:id', (req, res)=>{
    Category.findByIdAndRemove(req.params.id).then(category=>{
        if(category){
            return res.status(200).json({success: true, message: 'The category has been deleted'})
        }else {
            res.status(404).json({success: false, message: 'category not found' })
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})
    })
})


module.exports =router;