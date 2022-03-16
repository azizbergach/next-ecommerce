import prisma from "../../../../lib/prisma";
import jwt from 'jsonwebtoken';
import nc from 'next-connect';
import { onError } from '../../../../utils/error';


const handler = nc({
  onError
});

const findMoyen = (lastMoy, cofficient, number) => {
  return  (Math.ceil((lastMoy * cofficient + number)*10/(cofficient + 1))/10);
}

handler.post( async (req,res) => {
  
    const { authorization } = req.headers;
    const { rating, comment, numReviews, moyRating } = req.body;
    if (authorization) {
      const token = authorization.slice(9);
      jwt.verify(token, process.env.AUTH_TOKEN, async (err, decode) => {
        if (err) {
          return res.status(401).json({ message: 'Token is not valid' });
        } else {
         const username = decode.username;
         const { slug } = req.query;
    try {
      await prisma.products.update({
        where: {
          slug
        },
        data: {
          numReviews: numReviews + 1,
          rating: findMoyen(moyRating, numReviews, Number(rating)),
        }
      });

        const review = await prisma.reviews.create({
          data: {
            createdAt: (Date.now() + ""),
            createdBy: username,
            slug,
            rating: Number(rating),
            comment,
          }
        });

        return res.status(200).send(review);
    } catch (err) {
       return res.status(401).json({message: err.message})
    }
    }
    })}});

handler.get( async (req,res) => {
  try {

  const reviews = await prisma.reviews.findMany({
    where: {
      slug : req.query.slug
    }
  });
  return res.status(200).send(reviews);
} catch (err) {
 return res.status(401).json({message: err.message});
}})


export default handler;