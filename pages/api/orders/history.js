import prisma from "../../../lib/prisma";
import jwt from 'jsonwebtoken';




export default async function history(req,res) {
    
    const { authorization } = req.headers;
    if (authorization) {
      const token = authorization.slice(9);
      jwt.verify(token, process.env.AUTH_TOKEN, async (err, decode) => {
        if (err) {
          return res.status(401).json({ message: 'Token is not valid' });
        } else {
         const username = decode.username;
    try {
        const orders = await prisma.orders.findMany({
          where: {
            username
          }
        });
        return res.status(200).send(orders);
    } catch (err) {
       return res.status(401).json({message: err.message})
    }
    }
    });
    } else {
    return res.status(401).send({ message: 'Token is not suppiled' });
    }
}