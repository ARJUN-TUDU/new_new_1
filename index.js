const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());

app.use(cors({
     
    origin:["http://localhost:3000"],
    methods:["GET","POST","PUT","DELETE"],
      credentials: true

}));



const mongoose = require("mongoose");

try{
   
    mongoose.connect('mongodb+srv://arjuntudu:gxpFj2gp4bsWMGmN@cluster0.ssu2p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    console.log("DATABASE CONNECTION SUCCESSS");
}catch(err){
    if(err){
        console.log("DATABSE CONNECTION FAILED")
    }
}

const date = new Date();


//
const User = mongoose.model("my_users",{
    name:String,
    email:String,
    password:String,
    
    
})

const Post = mongoose.model("posts",{
    
    owner:String,
    desc:String,
    likes:Number,
    currdate:String

})






//section 
app.post("/register_user",async(req,res)=>{

    
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password ; 

    try{
          
        const new_user = new User({name,email,password});
        await new_user.save();

    }catch(e){
        console.log(e);
    }

})


//login
app.get("/user/:name",async(req,res)=>{
     
    const name = req.params.name;
    
    let flag = false ;
    let user = {};

    try{

        const list =await User.find();
        list.map((x)=>{
            if(x.name+x.password === name){
                flag = true;
                user = x;
            }
        })

    }
    catch(e){
        console.log(e);
    }

    if(flag){
        
        res.json([user]);
        console.log(user);


    }else{
        res.json([]);
    }

})



//the_main part
app.get("/",async (req,res)=>{
    
    
    try{
        const list = await User.find();
        res.json(list);
    }catch(e){
        console.log("backend Data send error , "/" ")
    }
})


app.put("/like/:name",async(req,res)=>{
    
    const name = req.params.name

    try{
         const updated = await User.findOneAndUpdate({name:name},{likes:5});
         res.json(updated);
        

    }catch{
         console.log(e);
    }

})

app.post("/post",async (req,res)=>{
   
    owner = req.body.owner;
    desc = req.body.desc;
    likes = req.body.likes
    currdate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} `

    try{
        
        const new_post = new Post({owner,desc,likes,currdate});
        await new_post.save()

    }catch(e){
        if (e){
            console.log("new post error");
        }
    }

})

app.get("/get_post",async(req,res)=>{
    
    try{
        const response = await Post.find();
        res.json(response);
    }catch(e){
        console.log(e)
    }
     

})




// 
app.listen(5000,(err)=>{
    if(err){
        console.log("app started failed")
    }else{
        console.log("app started")
    }
})