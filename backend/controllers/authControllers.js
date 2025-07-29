let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let pool = require('../config/db')
const { JWT_SECRET } = require('../config/env')

exports.profile = async(req,res)=>{
    try{
      // req.user => {
          // "userId": 6,
          // "iat": 1753762428,
          // "exp": 1753766028
      // }

      let userId = req.user.userId

      let user = await pool.query('select id,username,email from users where id=$1',[userId])
      const userData= user.rows[0]

      let myposts = await pool.query('select * from posts where user_id= $1',[userId])
      const myPostsData = myposts.rows

     res.status(200).json({userData:{...userData},myPosts:[...myPostsData]})
    }catch(err){
      console.log("Ақпараттар жүйесімен байланысу мүмкін болмады!");
      res.status(500).json({message:"Сервердің қатесі!"})
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
               res.status(200).json({message:"Login successfully!",user:{
                userId:result.rows[0].id,
                username:result.rows[0].username,
                email:result.rows[0].email
               },token})   
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

exports.updatePost = async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;
  const userId = req.user.userId; // токен арқылы келген

  if (!title || !content) {
    return res.status(400).json({ message: "Title және Content қажет" });
  }

  try {
    // Тексеру: пост бар ма және осы user-ге тиесілі ме?
    const postCheck = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (postCheck.rows.length === 0) {
      return res.status(404).json({ message: "Пост табылмады" });
    }
    if (postCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ message: "Сен бұл постты өзгерте алмайсың" });
    }

    const result = await pool.query(
      'UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *',
      [title, content, id]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Постты жаңарту қатесі:", err);
    res.status(500).json({ message: "Постты жаңартуда қате кетті" });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const postCheck = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (postCheck.rows.length === 0) {
      return res.status(404).json({ message: "Пост табылмады" });
    }
    if (postCheck.rows[0].user_id !== userId) {
      return res.status(403).json({ message: "Сен бұл постты өшіре алмайсың" });
    }

    await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    res.status(200).json({ message: "Пост сәтті өшірілді" });
  } catch (err) {
    console.error("Постты өшіру қатесі:", err);
    res.status(500).json({ message: "Постты өшіру кезінде қате болды" });
  }
}
