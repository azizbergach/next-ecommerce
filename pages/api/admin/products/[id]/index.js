import nc from "next-connect";
import prisma from "../../../../../lib/prisma";
import { isAdmin, isAuth } from "../../../../../utils/auth";
import { onError } from "../../../../../utils/error";

const handler = nc({
    onError,
});

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
        try {
            const product = await prisma.products.findUnique({
                where: {
                    id: Number(req.query.id)
                }
            });

            return res.status(200).send(product);
        } catch (err) {
            return res.status(401).json({message: err.message})
        }
});

handler.delete(async (req, res) => {
    try {
        await prisma.products.delete({
            where: {
                id: Number(req.query.id)
            }
        });

        return res.status(200).send({message: "product deleted succefully"});
    } catch (err) {
        return res.status(401).json({message: err.message})
    }
});

handler.put(async (req,res) => {
    try {
        const {
            name,
            slug,
            price,
            category,
            image,
            isFeatured,
            featuredImage,
            brand,
            countInStock,
            description,
          } = req.body;

        await prisma.products.update({
            where: {
                id: Number(req.query.id)
            },
            data: {
                name,
                slug,
                price,
                category,
                image,
                isFeatured,
                featuredImage,
                brand,
                countInStock,
                description,
            }
        });

        return res.status(200).send({message: "product updated succefully"});
    } catch (err) {
        return res.status(401).json({message: err.message})
    }
})

export default handler;