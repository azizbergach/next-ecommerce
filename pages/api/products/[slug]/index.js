import prisma from "../../../../lib/prisma";




export default async function product(req,res) {
    
    const slug = req.query.slug;
    try {
        const product = await prisma.products.findUnique({
            where: {
                slug
            }
        })
        return res.status(200).send(product)
    } catch (err) {
        return res.status(401).json({message: err.message})
    }
}