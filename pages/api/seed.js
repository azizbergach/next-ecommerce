import prisma from '../../lib/prisma';
import data from '../../utils/data';




export default async function Products() {

    await prisma.products.deleteMany()
    await prisma.users.deleteMany()
    await prisma.reviews.deleteMany()
    
    await prisma.products.createMany({
        data: data.products
    })
    await prisma.users.createMany({
        data: data.users
    })
    await prisma.reviews.createMany({
        data: data.reviews
    })
}