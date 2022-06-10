module.exports= {
  apiUrl : process.env.NODE_ENV === "production" ? '/graphql' : 'http://192.168.0.88:8080/graphql'
}