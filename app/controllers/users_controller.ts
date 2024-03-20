import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
    async profile({ auth, response }: HttpContext) {
        const user = await auth.authenticate()
        const { password, enabled, isAdmin, ...userInfo } = user.$attributes
        return response.ok(userInfo)
      }

    async getUsers({response} : HttpContext){
        const users = await User.findManyBy({ is_admin: 0, enabled:1 });
        return response.ok(users);

    }

    async patchProfile({auth, request,response }: HttpContext){
        const authUser = auth.user;
        const { email, fullname, job, area,tel } = request.all();

        const user = await User.findBy("email", authUser?.email);
        if(!user){
            return response.badRequest({message: "Error with the User"});
        }

       if(email){
        user.email = email;
       }
       if(fullname){
           user.fullname = fullname;

       }
       if(job){
        user.job = job;
       }
        if(area){
            user.area = area;
        }
        if(tel){
            user.tel = tel;
        }
        
        await user.save();

        return response.ok({message: "profile updated"})
        
    }

    async patchImg({auth, request, response} : HttpContext){
        const authUser = auth.user;
        const {img} = request.all();

        if(!img){
            return response.badRequest({message: "You need a image!"});
        }
        const user = await User.findBy("email", authUser?.email);

        if(!user){
            return response.badRequest({message: "Error with the User"});
        }
    }
    async patchPassword({auth, request, response} : HttpContext){
        const authUser = auth.user;
        const {password} = request.all();
        if(!password){
            return response.badRequest({message: "You need a new password!"});
        }
        const user = await User.findBy("email", authUser?.email);
        if(!user){
            return response.badRequest({message: "Error with the User"});
        }
    }
     
}