import bcrypt from 'bcryptjs';
import prisma from "../../../lib/prisma";
import { signToken } from "../../../utils/auth";



const Sign_up = async (req,res) => {

    if(req.method !== "POST"){
        return res.redirect("/notfound",404)
   }
    const { username, email, password } = req.body;
    try {
        const user = await prisma.users.create({data: { username, email, password: bcrypt.hashSync(password), createdAt: (Date.now() + "")}});
        const token = signToken(user);
        return res.status(200).send({
            token,
            id: user.id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
        })    
    } catch (error) {
        res.json({message: error.message},500)
    }
}

export default Sign_up;