//this is the engine that will drive everything we are able to invoke or requiree express framwork.
// as because we earlier were able to installed it inside of our project, or server project.
require("dotenv").config();
//for ""process"" use keliye....
const express=require('express');
const graphqlHTTP=require('express-graphql').graphqlHTTP;
const schema=require('./server/schema/schema');
const mongoose=require('mongoose');
const app=express();
const process=require('./nodemon.json');
const cors=require("cors");
app.use(cors());
const port=process.env.PORT || 4000
// .use  = this property here will alow us to pass an end point, write a url '/anything'
app.use(
    '/graphql', 
    graphqlHTTP({
        // whenever we serve this, the graphiql which is that very nice user interface that I showed you earlier in previous sections when I did the demo where we start typing the queries ans can see the documentation, but also the results from those queries  
        graphiql:true,
        schema:schema
    })
)


mongoose.connect(
    `mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@graphqlcluster.qw3nc1u.mongodb.net/${process.env.mongoDatabase}?retryWrites=true&w=majority` 
    ,{
        useNewUrlParser:true,useUnifiedTopology:true
    }
).then(()=>{
    app.listen({port:port},()=>{ // LocalHost:4000
        // That is the port that was saying these should be serve that.
        console.log(process.env.mongoUserName);
        console.log('Listening the request on my port '+port);
    });
}).catch(
    (e)=>{
        console.log(process.env.mongoUserName);
        console.log("Errpr:::"+e);
    }
);

//4000 is any number we can choose any port number.
// ()=> is called callBack function
// goin to call it as soon as ther is ready to listen
//before the implementation
// app.listen(4000,()=>{ // LocalHost:4000
//     // That is the port that was saying these should be serve that.
//     console.log(
//         'Listening the request on my port 4000');
// })

// *******************************//
//Remainder graphql has different frameworks, different versions out there for different languages.