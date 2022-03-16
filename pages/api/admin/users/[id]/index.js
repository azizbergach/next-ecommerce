import nc from "next-connect";
import { isAuth, isAdmin } from "../../../../../utils/auth";
import { onError } from "../../../../../utils/error"; 
import prisma from "../../../../../lib/prisma";

const handler = nc({
    onError,
});

handler.use(isAuth, isAdmin);

handler.delete(async (req, res) => {
        try {
            await prisma.users.delete({
                where: {
                    id: Number(req.query.id)
                }
            });
            res.send({ message: 'User deleted Successfully' });
        } catch (err) {
             res.status(401).json({message: err.message})
        }
});

handler.get(async (req, res) => {
    try {
        const user = await prisma.users.findUnique({
            where: {
                id: Number(req.query.id)
            }
        });
        
         res.status(200).send(user);
    } catch (err) {
         res.status(401).json({message: err.message})
    }
});

handler.put(async (req, res) => {
    const { username, isAdmin } = req.body;
    try {
        await prisma.users.update({
            where: {
                id: Number(req.query.id)
            },
            data: {
                username,
                isAdmin
            }
        });
        res.send({ message: 'User Updated Successfully' });
    } catch (err) {
         res.status(401).json({message: err.message})
    }
});

export default handler;