export default () => ({
  auth: {
    publicKey: process.env.JWT_PUBLIC_KEY,
    privateKey: process.env.JWT_PRIVATE_KEY
  },
  db: {
    uri: process.env.MONGO_URI
  }
});
