export default () => ({
  auth: {
    publicKey: process.env.JWT_PUBLIC_KEY,
    privateKey: process.env.JWT_PRIVATE_KEY,
    saltRounds: process.env.AUTH_SALT_ROUNDS || 10
  },
  db: {
    uri: process.env.MONGO_URI
  }
});
