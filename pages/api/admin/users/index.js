import nc from "next-connect";
import { isAuth, isAdmin } from "../../../../utils/auth";
import { onError } from "../../../../utils/error"; 
import prisma from "../../../../lib/prisma";

const handler = nc({
    onError,
});

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
        try {
            const users = await prisma.users.findMany();

            return res.status(200).send(users);
        } catch (err) {
            return res.status(401).json({message: err.message})
        }
})

export default handler;