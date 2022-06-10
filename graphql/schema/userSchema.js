const UserTypes = `
  scalar Upload

  type User{
    _id: ID!
    email: String!
    username: String!
    fullName: String!
    profilePicture: String
    token: String
    verified: Boolean!
  }

  type AuthData {
    token: String!
    user: User!
  }

  input UserInput {
    email: String!
    password: String! 
    username: String!
    fullName: String!
  }

  input UpdateUser {
    email: String
    password: String
    username: String
    fullName: String
  }
`;

const UserQuery = `
  login(email: String!, password: String!): AuthData
  getUserData: User
`;

const UserMutation = `
  createUser(userInput: UserInput): User
  changeProfilePicture(file: Upload!): String
  verifyEmail(token: String!): User
  resendActivation(uid: String!): String!
  sendPwResetLink(email: String!): String
  resetPassword(token: String!, newPassword: String!): String
  updateUserData(userInput: UpdateUser!): User
`;

module.exports = {
  UserTypes,
  UserQuery,
  UserMutation
}