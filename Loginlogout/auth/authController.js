const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const config = require('../config');

const Users = require('./usermodal');

router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());

router.get('/',(req,res)=>{
    res.send("welcome to login backend")
})

router.get('/users', (req, res) => {
    Users.find({}, (err,data)=>{
        if(err) throw err
        res.send(data)
    })
})

// route for  registration//

router.post('/register', (req,res)=>{
    var hashpw = bcrypt.hashSync(req.body.password,8); // to encrypt the password //
    var email=req.body.email
    Users.find({email:email},(err,data)=>{
        if(data.length>0){
            res.status(500).send({auth:false,token:"Email already in use"})
        }
        else{
            Users.create({
                name:req.body.name,
                email:req.body.email,
                password:hashpw,
                phone:req.body.phone,
                role:req.body.role?req.bodyrole:'User'
        
            },(err,data)=>{
                if(err) return res.status(500).send({auth:false ,token:"Error while Registration"}); // if connection related error//
                res.status(200).send({auth:true,token:"Registration Successful"});
            })

        }

    })
    // encryption for password//

    
})
//login//
router.post('/login',(req,res)=>{
    Users.findOne({email:req.body.email},(err,userdata)=>{
        if(err) return res.status(500).send({auth:false,token:"Some Error in login"});
        if(!userdata) return res.status(500).send({auth:false,token:"No User Found"});
        else{
            const Passvalid = bcrypt.compareSync(req.body.password,userdata.password)
            if(!Passvalid) return res.status(500).send({auth:false,token:"Invalid Password"})

            // if password valid//
            var token =jwt.sign({id:userdata._id}, config.secret, {expiresIn:86400}) // 24 hrs = 86400 ms//
            res.send({auth:true,token:token})

        }

    })
})


//Profile// 

router.get('/userProfile',(req,res)=>{
    var token = req.headers['x-access-token'];
    if(!token) return res.status(500).send({auth:false,token:"No token provided"})

    // verfying token if exist 
    jwt.verify(token, config.secret, (err,userinfo)=>{
        if(err) res.status(500).send({auth:false,token:"Invalid Token"})
        Users.findById(userinfo.id,(err,result) => {
            res.send(result)
        })

    })
})




module.exports = router
