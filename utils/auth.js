import JWT from 'jsonwebtoken'


const signToken = (user) => {
    return JWT.sign(
        {
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
    },
    process.env.AUTH_TOKEN,
    {
        expiresIn: "30d",
    }
    )
}

const isAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization) {
      const token = authorization.slice(17);
      JWT.verify(token, process.env.AUTH_TOKEN, (err, decode) => {
        if (err) {
          res.status(401).send({ message: 'Token is not valid' });
        } else {
          req.user = decode;
          next();
        }
      });
    } else {
      res.status(401).send({ message: 'Token is not suppiled' });
    }
  };

  const isAdmin = async (req, res, next) => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(401).send({ message: 'User is not admin' });
    }
  };

export { signToken, isAdmin, isAuth }