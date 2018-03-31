module.exports ={
  database:`mongodb://cja:cja@ds117878.mlab.com:17878/ecommerce`,
  port: 3000,
  secretKey:'Anand',

  facebook:{

    clientID: process.env.FACEBOOK_ID || '361671717672845',
    clientSecret: process.env.FACEBOOK_SECRET || '22aeb7078ad1a101077a0b81',
    profileFields:['emails','displayName'],
    callbackURL: "http://localhost:3000/auth/facebook/callback"

  }
};
