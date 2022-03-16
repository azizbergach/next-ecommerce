import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../utils/auth';
 

const login = async (req,res) => {

    if(req.method !== "POST"){
         return res.redirect("/notfound",404)
    }
    const {email,password} = req.body;
        const user = await prisma.users.findUnique({
            where: {
                email
            }
        });
        if(user){
            if(bcrypt.compareSync(password , user.password)){
                const token = signToken(user);
            return res.status(200).send({
                    token,
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    isAdmin: user.isAdmin
                })
            } else {
                return res.status(401).json({message: "invalid password"})
            } 
        }
        return res.status(401).json({message: "invalid email"})
}

export default login;