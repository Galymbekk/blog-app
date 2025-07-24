let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let pool = require('../config/db')
const { JWT_SECRET } = require('../config/env')

exports.users = async(req,res)=>{
    try{
        let result = await pool.query('select * from users')
        result.rows.length > 0 ? res.status(200).json(result.rows) : res.status(400).json({message:"Userlerdi alu mumkin bolmady!!"})
    }catch(err){
        console.log('DB-men bailanysu mumkin bolmady!', err);   
    }
}  

exports.register = async(req,res)=>{
     let {username, email, password } = req.body

    if(!username || !email || !password){
        res.status(400).json({message:"Jiberilgen aqparat tolyq emes!"})
    }else{
        try{
            let hashedPassword = await bcrypt.hash(password, 10)
            if(hashedPassword){
                let result = await pool.query('insert into users (username,email,password) values ($1, $2, $3) returning *',[username, email,hashedPassword])
                result.rows.length > 0 ? res.status(201).json(result.rows) : res.status(400).json({message:"Jana user qurstyru mumkin bolmady!"})
            }else{
                res.status(400).json({message:"qupyia sozdi hashtau kezinde qatelik tuyndady!"})
            }
        }catch(err){
            console.log('DB-men bailanysu mumkin bolmady!', err);   
        }
    }
}

exports.login = async(req,res)=>{
    let { email,password } = req.body

    if(!email || !password){
        res.status(400).json({message: "Jiberilgen aqparatty tolyqtai toltyr!"})
    }else{
        try{    
            let result = await pool.query('select * from users where email = $1',[email])
            if(result.rows.length == 0) res.status(404).json({message:"User not found!"})
            
            let isMatch = await bcrypt.compare(password, result.rows[0].password)

            if(isMatch){
                const token = jwt.sign({userId: result.rows[0].id},JWT_SECRET,{expiresIn:'1h'})
               res.status(200).json({message:"Login successfully!",userName:result.rows[0].username,token})   
            }else{
               res.status(400).json({message:"Qupiya soz saikes kelmeidy!"})
            }
        }catch(err){
            console.log('DB-men bailanysu mumkin bolmady!',err);
        }
    }
}

exports.addPost = async(req,res)=>{
    let { title,content } = req.body
    let image = req.file ? req.file.filename : null
    let userId = req.user.userId

    if(!title) res.status(400).json({message:"title is required"})
    try{
       let result = await pool.query('insert into posts(title,content,image,user_id) values($1,$2,$3,$4) returning *',[title, content, image, userId])
       res.status(201).json(result.rows[0])  
    }catch(err){
        console.log("DB-ға еңгізу сәтсіз болды!", err);
        res.status(500).json({message:"Постты еңгізуде қателіктер туындады!"})
    }
}

exports.posts = async(req,res)=>{
    try{
        let results = await pool.query('select * from posts order by created_at desc')
        results.rows.length > 0 ? res.status(200).json(results.rows) : res.status(404).json({message:"Posts not found!"})
    }catch(err){
        console.log("DB-дан алу сәтсіз болды!", err);
        res.status(400).json({message:"Постты алуда қателіктер туындады!"})
    }
}