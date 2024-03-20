import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminCheckMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const user = await auth?.user
    if (!user) {
      return response.internalServerError('Error auth')
    }
    if (!user.is_admin) {
      return response.unauthorized({ message: 'You are not authorized to perform this action' })
    }

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
