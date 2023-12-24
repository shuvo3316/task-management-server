
const express=require('express')
const app=express();
const cors= require('cors')


const port =  process.env.PORT||5000


// middle were 
app.use(express.json())

app.use(cors());

// user pass 
// Task_Master
// 7ERxPYi3SiTdUz6g


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Task_Master:7ERxPYi3SiTdUz6g@cluster0.mab1nuw.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const usersCollection = client.db("Task").collection('users')
    const taskCollection = client.db("Task").collection('tasks')




    // users manage 

   app.post("/users",async(req,res)=>{
    const user =req.body;
    console.log(user)
    //user already exist kina dekhbo
    const query={email:user.email}
    const existingUser = await usersCollection.findOne(query)
    if(existingUser){
        return res.send({message :'user already exist',insertedId:null})
    }
    const result = await usersCollection.insertOne(user)
    res.send(result)
})

app.get('/users',async(req,res)=>{
    console.log(req.query.email)
    if(req.query.email){
        const query={email:req.query.email}
        const result=await usersCollection.findOne(query)
        return res.send(result)


    }
    const result=await usersCollection.find().toArray()
    res.send(result)
})


// task manage 
//    blood- request manage 
app.post('/tasks',async(req,res)=>{
    const data=req.body;
    const result = await taskCollection.insertOne(data);
    res.send(result)

})
app.get('/tasks',async(req,res)=>{
    const userEmail=req.query;
    console.log(userEmail)
    let query={}
    if(req.query.email){
         query={taskrequesterEmail:req.query.email}
    
    const result = await taskCollection.find(query).toArray();
    return res.send(result)
    }
    const result= await taskCollection.find().toArray();
    res.send(result)

})



    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();
    // Send a ping to confirm a successful connection
   // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Welcome to my server!');
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });