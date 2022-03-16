import jwt from 'jsonwebtoken';
import prisma from '../../../lib/prisma';


export default function placeorder(req,res) {
    
    const { shippingAddress, paymentMethod, cartItems, itemsPrice, tax, shippingPrice, total } = req.body;
    const { authorization } = req.headers;
    if (authorization) {
      const token = authorization.slice(9);
      jwt.verify(token, process.env.AUTH_TOKEN, async (err, decode) => {
        if (err) {
          res.status(401).send({ message: 'Token is not valid' });
        } else {
          const { username } = decode;
          try {
            const order = await prisma.orders.create({
                data: {
                    username,
                    orderItems: cartItems,
                    shippingAddress,
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    taxPrice: tax,
                    totalPrice: total,
                    createdAt: (Date.now() + ""),
                }
            })
            return res.status(200).send(order.id);
          } catch (err) {
            return res.status(401).json({message: err.message})
          }
        }
      });
    } else {
      res.status(401).send({ message: 'Token is not suppiled' });
    }
}