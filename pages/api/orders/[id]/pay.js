import nc from "next-connect";
import { isAuth } from "../../../../utils/auth";
import { onError } from "../../../../utils/error"; 
import prisma from "../../../../lib/prisma";

const handler = nc({
    onError,
});

handler.use(isAuth);

handler.put(async (req, res) => {
  try {
  const paidOrder = await prisma.orders.update({ 
    where: {
       id: Number(req.query.id)
       },
       data: {
        isPaid: true,
        paidAt: Date.now() + "",
       }
      });
  
    res.send({ message: 'order paid', order: paidOrder });
  } catch {
    res.status(404).send({ message: 'order not found' });
  }
});


export default handler;