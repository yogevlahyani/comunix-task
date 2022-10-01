export default () => ({
  port: process.env.PORT || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    signOptions: {
      expiresIn: '15m',
    },
  },
});
