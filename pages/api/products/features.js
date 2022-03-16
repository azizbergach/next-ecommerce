import prisma from "../../../lib/prisma"



export default async function Categories(req,res) {

    const { feature } = req.body ;
     
    try {
        const products = await prisma.products.findMany({
            select: {
                [feature]: true
            },
            distinct: feature
        });
        const features = products.map(product => product[feature]);
        return res.status(200).send(features);
    } catch (err) {
       return res.status(401).json({message: err.message})
    }
    

}