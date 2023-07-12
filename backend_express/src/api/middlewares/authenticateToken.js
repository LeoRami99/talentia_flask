const jwt = require('jsonwebtoken');




function authenticateToken(req, res, next) {
    const secret = process.env.SECRET_KEY;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if(token == null){
        return res.sendStatus(401);
    }
    jwt.verify(token, secret, (err, user) => {
        if(err){
            console.log(err);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}
module.exports = authenticateToken;
