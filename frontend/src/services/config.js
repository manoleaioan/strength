module.exports= {
  apiUrl : process.env.NODE_ENV === "production" ? '/graphql' : 'http://192.168.1.13:8080/graphql'
}