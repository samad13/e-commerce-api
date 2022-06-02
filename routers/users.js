const{ User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



router.get(`/`, async (req, res) =>{
    const userList = await User.find().select('-passwordHash');

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList);
});

// get individual users
router.get('/:id', async(req, res)=>{
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user) {
        res.status(500).json({message: 'The user doesnt exist'})
    }
    res.status(200).send(user);
})


router.post('/', async(req, res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    
    user = await user.save();
    
    if(!user)
    return res.status(404).send('user cannot be created')

    res.send(user);
    
});



// login post
router.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    const secret = process.env.secret
    
    if(!user) {
        return res.status(400).send('The user not found');
    }
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            {
                userId: user.id
              // isAdmin: user.isAdmin
            },
            secret,
            {expiresIn : '1d'}
        )
        
        res.status(200).send({user: user.email, token: token})
    }else{
    res.status(400).send('wrong password') 
    }
    
});

// register route
router.post('/register', async (req,res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})


router.delete('/:id', (req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user=>{
        if(user){
            return res.status(200).json({success: true, message: 'This user has been deleted'})
        }else {
            res.status(404).json({success: false, message: 'user not found' })
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})
    })
});

router.get(`/get/count`, async (req, res)=>{
    const userCount = await User.countDocuments()
    
    if(!userCount) {
        res.status(500).json({success: false,})
    }

    res.send({userCount: userCount})
} );




module.exports = router;