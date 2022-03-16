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
            const products = await prisma.products.findMany();

            return res.status(200).send(products);
        } catch (err) {
            return res.status(401).json({message: err.message})
        }
})

handler.post(async (req, res) => {
    try {
        const product = await prisma.products.create({
            data: {
                name: 'Product name',
                slug: 'product-slug-' + Math.random(),
                image: '/images/shirt1.jpg',
                price: 0,
                category: 'product category',
                brand: 'product brand',
                countInStock: 0,
                description: 'product description',
                rating: 0,
                numReviews: 0,
                createdAt: (Date.now() + ""),
            }
        });

        res.status(200).send({id: product.id});
    } catch (err) {
        res.status(401).json({message: err.message})
    }
})

export default handler;