const { ApolloServer } = require('apollo-server') 

// 定义schema 
const typeDefs = `
  type Query { 
    totalPhotos: Int! 
    allPhoto: [Photo!]!

  }
  type Mutation {
    postPhoto(name: String! description: String): Boolean!
    postPhoto2(name: String! description: String): Photo!
    postPhotoInput(input:PostPhotoInput): Photo!
  }

  type Photo {
    id: ID!,
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
    postedBy: User!
  }

  enum PhotoCategory{
    SELFIE
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
  }

  input PostPhotoInput {
    name: String!
    category: PhotoCategory = PORTRAIT
    description: String
  }

  type User{
    githubLogin: ID!
    name: String!
    avatar: String!
    postedPhotos: [Photo!]!
  }

`

var _id = 0
// var photos = []

var users=[
  {"githubLogin": "mHattrup", "name": "Mike Hattrup" },
  {"githubLogin": "gPlake", "name": "Glen Plake" },
  {"githubLogin": "sSchmidt", "name": "Scot Schmidt" }
  ];
  var photos = [
    {"id": "1", "name": "Dropping the Heart Chute","description": "The heart chute is one of my favorite chutes", "category": "ACTION","githubUser": "gPlake"}, 
    {"id": "2","name": "Enjoying the sunshine", "category": "SELFIE", "githubUser": "sSchmidt"}, 
    {"id": "3", "name": "Gunbarrel 25","description": "25 laps on gunbarrel today","category": "LANDSCAPE","githubUser": "sSchmidt"}
  ]



const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhoto: () => photos
  },
  Mutation: {
    postPhoto(parent, args) {
      photos.push(args)
      return true
    },
    postPhoto2(parent, args) {
      var newPhoto = {
        id: _id++,
        ...args
      }
      photos.push(newPhoto)
      return newPhoto
    },
    postPhotoInput(parent,args){
      var newPhoto = {
        id: _id++,
        ...args.input
      }
      photos.push(newPhoto)
      return newPhoto
    }
  },
  Photo: {
    url: parent => {
      console.log("parent", parent)
      return `http://xxx.com/img/${parent.id}.jpg`;
    },
    postedBy: parent => {
       return users.find( u => u.githubLogin === parent.githubUser)
    }
  },
  User: {
    postedPhotos: parent => {
      return photos.filter(p => p.githubUser === parent.githubLogin)
    }
  }

  
}

const server = new ApolloServer({typeDefs, resolvers})

server.listen(7777).then(({port}) => console.log(`GraphQL Service running on ${port}`))





/*
url: http://localhost:7777

query q{
  totalPhotos
}

mutation newPhoto {
  postPhoto(name: "sample photo")
}
mutation newPhoto2($name: String!, $description: String){
  postPhoto(name: $name, description:$description)
}

mutation newPhotoWithId($name: String!, $description: String){
  postPhoto2(name: $name, description:$description){
    id
    name
    description
  }
}

query listPhotos {
  allPhoto{
    id
    name
    description
    url
  }
}

mutation newPhotoWithCategory($input: PostPhotoInput){
  postPhotoInput(input: $input){
    id
    name
    url
    description
    category
  }
}




Query Variables
{
  "name": "sample photoA",
  "description": "A sample photo for our dataset",
  "input": {
    "name": "sample photoA",
  	"description": "A sample photo for our dataset",
    "category": "LANDSCAPE"
  }
}



 */
