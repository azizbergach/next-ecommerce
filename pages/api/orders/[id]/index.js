import nc from "next-connect";
import prisma from "../../../../lib/prisma";
import { isAuth } from "../../../../utils/auth";
import { onError } from "../../../../utils/error"; 

const handler = nc({
  onError
});

handler.use(isAuth);

handler.get(async (req, res) => {
  try {
  const order = await prisma.orders.findUnique({ 
    where: {
       id: Number(req.query.id)
       }
      });
  
    res.send(order);
  } catch(err) {
    res.status(404).send({ message: err.message });
  }
});


export default handler;