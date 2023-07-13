// For Instance, if I want to create relations between users and siblings and all this stuff. 
// Literally just like some sort of a map or some sort of a bluwprint that tells exactly how this interaction.

const graphql=require('graphql');
var _ =require('lodash');
const User=require("../model/user");
const Hobby=require("../model/hobby");
const Post=require("../model/post");

//***************:::::DUMMY DATA::::*****************
// //These data will be exported from their files or folder or anywhere else
// //dummy data:
// var userData=[
//     {id:'1',name:'Bond',age:36,professional:'student1'},
//     {id:'13',name:'Anna',age:31,professional:'Lawyer'},
//     {id:'211',name:'Bella',age:32,professional:'Doctor'},
//     {id:'19',name:'Gina',age:34,professional:'student2'},
//     {id:'150',name:'Geogina',age:38,professional:'Pornstar'}
// ];


// //dummy data for HobbyUser:
// var hobbyData=[
//     {id:'1',title:'Programming',description:'Using computer to make wolrd better',userID:'1'},
//     {id:'2',title:'Rowing',description:'Sweat and feel better before eating',userID:'13'},
//     {id:'3',title:'Swimming',description:'Get in the water',userID:'19'},
//     {id:'4',title:'Fencing',description:'A hobby for fencing people',userID:'211'},
//     {id:'5',title:'Hiking',description:'Wear hiking boots and explore the world',userID:'211'},
// ];


// //dummy posts:
// var postData=[
//     {id:'1',commnets:'Hello!',userId:'1'},
//     {id:'2',commnets:'Fuck you!',userId:'1'},
//     {id:'33',commnets:'I lover you',userId:'211'},
//     {id:'56',commnets:'dhbvchad',userId:'150'},
// ];


//Create types:


const UserType=new graphql.GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user...',
    fields: ()=> ({
        //The actual data inside the our user.
        //()=> is callBack Function which has the return type as object ({....data....})
        id: /*"2345" or */ {type:graphql.GraphQLID},
        name: /* "James"  or */ {type:graphql.GraphQLString},
        age:/* 33 or */ {type:graphql.GraphQLInt},
        professional: {type:graphql.GraphQLString},
        
        //Attaching the Post- Table table with the User-Table.....
        postU:{
        //Here GraphQLList is used for making the list of all HobbyType from hobbyData.
            type:new graphql.GraphQLList(PostType),
            resolve(parent,args){
                //here userId is from the postData which should be equal to the parent Id i.e userData.
                // And then fillter out all the hobbyies from the list that are ID = Parent-Id
             
                return Post.find({userId:parent.id})
                //return _.filter(postData,{userId:parent.id});  
            },
        },

        //Attaching the Hobby-table with the User-Table.....
        hobbyU:{
        //Here GraphQLList is used for making the list of all HobbyType from hobbyData.
            type:new graphql.GraphQLList(HobbyType),
            resolve(parent,args){
                // And then fillter out all the hobbyies from the list that are ID = Parent-Id
                
                return Hobby.find({userId:parent.id})
                //return _.filter(hobbyData,{userID:parent.id});
            },
        },
    })
});


        /*
        query{
            user(id:"1"){
                id
                name
                age
                professional      
                hobbyU{
                    id
                    title
                    description
                }
                postU{
                    id
                    commnets
                }
                
            }
        }
// Answer:
            {
            "data": {
                "user": {
                "id": "1",
                "name": "Bond",
                "age": 36,
                "professional": "student1",
                "hobbyU": [
                    {
                    "id": "1",
                    "title": "Programming",
                    "description": "Using computer to make wolrd better"
                    }
                ],
                "postU": [
                    {
                    "id": "1",
                    "commnets": "Hello!"
                    },
                    {
                    "id": "2",
                    "commnets": "Fuck you!"
                    }
                ]
                }
            }
            }
*/


//Create HobbyUser:
const HobbyType=new graphql.GraphQLObjectType({
    name:'Hobby',
    description:'Description',
    fields: ()=>({
        id:{type:graphql.GraphQLID},
        title: {type:graphql.GraphQLString},
        description:{type:graphql.GraphQLString},
        
        //Attaching the user-table with the Hobby-Table.....
        user:{
            type:UserType,
            resolve(parent,args){
                // here parent is the HobbyType
                // userData ki ID = parent user-ID i.e hobbyData me jo userId vo equal to Id in userData.
               
                return User.findById(parent.userId);
              //  return _.find(userData,{id:parent.userId});
                //it works like foreign key of Id which is primary key in userData
            }
        },
    })
});

//create Post-type:
const PostType=new graphql.GraphQLObjectType({
    name:'PostType',
    description:'Post Commnets....',
    fields:()=>({
        id:{type:graphql.GraphQLID},
        comment:{type:graphql.GraphQLString},
        
        //Attaching the user table with the Post-Table.....
        user:{
            type:UserType,
            resolve(parent,args){
                // here parent is the PostType
                // userData ki ID = parent user-ID i.e postData me jo userId vo equal to Id in userData.
                return User.findById(parent.userId);
                //return _.find(userData,{id:parent.userId});
                //it works like foreign key of Id which is primary key in userData
            }
        },
    })
});

/*
query{
    // Here id is the Primary Key of the postData
  post(id:33){
    id
    commnets
    user{
      id
      name
      age
      professional
    }
    
  }
}
*/



//  Create the RootQuery
// Word Query is essentially is the path that allows us to start traversing or going through the MAP..
// But because we only have one right now, we don't have to do that. So I went straight to the root query, which is what really allows us to go around and start querying our graph
const RootQuery=new graphql.GraphQLObjectType({
// ******We are exporting the RootQuery to the locolHost 4000 (for right now)*******
    name: 'RootQueryType',
    description:'Description',
    fields:{
        // Jb User is calling....
        user:{
            type:UserType,
            args:{
                // args refers arguments.
                id:{type:graphql.GraphQLID}},
            
                // The graphical experience will then say, all right so I'm done, I will go and get all the information and we resolve it here.
                // This is where we return, whatever that we have found from our database or query.
            resolve(parent,args){
                    //parent here refers to the parent or in this case the user type.
                //we resolve with data
                //get and return data from a datasource
                //return _.find(userData,{id:args.id});
                // we are returing the userDate table..

                 return User.findById(args.id);
            }
        },

        users:{
           type:new graphql.GraphQLList(UserType),
            resolve(parent,args){
                return User.find({});
            }
        },
        
        // Jb Hobby is calling ....
        hobby:{
            type:HobbyType,
            args:{
                id:{
                    type:graphql.GraphQLID
                }
            },
            resolve(parent,args){
                //return data for our hobby;
                //return _.find(hobbyData,{id:args.id});
                return Hobby.findById(args.id);

            }
        },

        hobbies:{
            type:new graphql.GraphQLList(HobbyType),
             resolve(parent,args){
                 return Hobby.find({id: args.userId});
             }
         },
        
        // Jb Post is calling....
        post:{
            type:PostType,
            args:{
                id:{
                    type:graphql.GraphQLID}},
            resolve(parent,args){
                //return _.find(postData,{id:args.id});
                return Post.findById(args.id);
            },
        },

        posts:{
            type:new graphql.GraphQLList(PostType),
             resolve(parent,args){
                // return postData;
                  return Post.find({});
             }
         },
    }
});

/*
    Queries + Mutations = Fetching And Modifying 
*/

// MUTATION
const Mutation=new graphql.GraphQLObjectType({
    name: 'Mutation',
    fields:{
        //createUser is a Object which have type od UserType.
        createUser:{
            type:UserType,
            args:{
               // id:{type:new graphql.GraphQLNonNull(graphql.GraphQLString)},
                // NonNull means that this attribute will not take the null value..
                name:{type:new graphql.GraphQLNonNull(graphql.GraphQLString)},
                age:{type:new graphql.GraphQLNonNull(graphql.GraphQLInt)},
                profession:{type:graphql.GraphQLString},
            },

            resolve(parent,args){
                // Dummy data for now only :
                let user=new User({
                    //id:args.id,
                    //name from User and
                    //args.name from above
                    name:args.name,
                    age:args.age,
                    professional:args.profession,
                })
                return user.save();

            }
        },

        UpdateUser: {
            type: UserType,
            args: {
             id: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
             name: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
             age: {type: graphql.GraphQLInt},
             profession: {type: graphql.GraphQLString}
     
            },
            resolve(parent, args) {
                 
             return updatedUser = User.findByIdAndUpdate(
                 args.id,
                 {
                     $set: {
                         name: args.name,
                         age: args.age,
                         profession: args.profession
                     }
                 },
                 {new: true} //send back the updated objectType
             )
 
            }
        },

        RemoveUser: {
            type: UserType,
            args: {
                 id: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)}

            },
            resolve(parent, args) {
                 let removedUser = User.findByIdAndRemove(
                     args.id
                 ).exec();

                 if(!removedUser){
                     throw new("Error");
                 }

                 return removedUser;
            }
       },




        //create Mutation-Post
        createPost:{
            type:PostType,
            args:{
                userId:{type:new graphql.GraphQLNonNull(graphql.GraphQLID)},
                comment:{type:new graphql.GraphQLNonNull(graphql.GraphQLString)},
            },

            resolve(parent,args){
                let post=Post({
                    comment:args.comment,
                    userId:args.userId,
                })
                return post.save();
            }

        },


        //Update Post
       UpdatePost: {
        type: PostType,
        args: {
             id: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
             comment: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
            // userId: {type: new GraphQLNonNull(GraphQLString)}
        },
        resolve(parent, args) {
            return updatedPost = Post.findByIdAndUpdate(
                args.id,
                {
                    $set : {
                        comment: args.comment,
                    
                    }
                },
                {new: true}
                 
            )
        }
            
       },

      //Remove a Post
      RemovePost: {
            type: PostType,
            args: {
                id: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)}
            },

            resolve(parent, args) {

                let removedPost= Post.findByIdAndRemove(
                    args.id
                ).exec();

                if(!removedPost){
                    throw new("Error");
                }

                return removedPost;
                
                
            }
        },

        createHobby:{
            type:HobbyType,
            args:{
                userId:{type:new graphql.GraphQLNonNull(graphql.GraphQLID)},
                title:{type:new graphql.GraphQLNonNull(graphql.GraphQLString)},
                description:{type:new graphql.GraphQLNonNull(graphql.GraphQLString)},
            },

            resolve(parent,args){
                let hobby=Hobby({
                    userId:args.userId,
                    title:args.title,
                    description:args.description,
                })
                return hobby.save();
            }
        },

        //Update Hobby
        UpdateHobby: {
            type: HobbyType,
            args: {
            id: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
            title: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
            description: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)}
            //userId: { type: new GraphQLNonNull(GraphQLString)}

            },

            resolve(parent, args) {
                return updatedHobby = Hobby.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            title: args.title,
                            description: args.description
                        }
                    },
                    {new: true})
            }
        },

        //Remove a Hobby
        RemoveHobby: {
            type: HobbyType,
            args: {
            id: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)} },
            
            resolve(parent, args) {
                let removedHobby = Hobby.findByIdAndRemove(
                    args.id
                ).exec();

                if(!removedHobby){
                    throw new("Error");
                }
                return removedHobby;
            }
        },
    }

});


module.exports=new graphql.GraphQLSchema({
    // capital name RootQuery from the above GraphQLObjectType
    query:RootQuery,
    // capital name Mutation from the above GraphQLObjectType
    mutation:Mutation,
})