const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const {Users} = require('./models');

const jwtStrategy = new JwtStrategy(
	{
	secretOrKey: 'brendan',
    jwtFromRequest: ExtractJwt.fromBodyField('token'),
    algorithms: ['HS256']
  	},
  
	(payload, done) => {
	  	console.log('payload',payload.user.username);
	  	Users.findOne({username: payload.user.username}, (err, user) => {
	        if (err) {
	            return done(err, false);
	        }
	        if (user) {
	            return done(null, user);
	        } else {
	            return done(null, false);
	        }
	    });
  	}
);

module.exports = {jwtStrategy};