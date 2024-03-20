import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminCheckMiddleware {

  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    console.log(ctx)

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
  async adminCheck({auth, response}: HttpContext, next: NextFn){
    
    const user = auth.user;

    if(user?.is_admin){
      response.unauthorized({ message: 'You are not authorized to perform this action' });
    }

    await next();
  }
}