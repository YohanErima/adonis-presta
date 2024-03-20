import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class AdminsController {
  async getUsers({ response }: HttpContext) {
    const users = await User.findManyBy({ is_admin: 0 })
    return response.ok(users)
  }

  async getUserByEmail({ request, response }: HttpContext) {
    const user = await User.findBy('email', request.all().email)
    return response.ok(user)
  }
  async patchUserById({ request, response }: HttpContext) {
    const { id } = request.params()
    const { email, fullname, area, job, tel } = request.all()

    const user = await User.find(id)
    if (!user) {
      return response.badRequest({ message: 'Id not found' })
    }

    if (email) {
      user.email = email
    }
    if (fullname) {
      user.fullname = fullname
    }
    if (job) {
      user.job = job
    }
    if (area) {
      user.area = area
    }
    if (tel) {
      user.tel = tel
    }

    await user.save()

    return response.ok({ message: 'User updated' })
  }

  async patchImg({ auth, request, response }: HttpContext) {
    const authUser = auth.user
    const { img } = request.all()

    if (!img) {
      return response.badRequest({ message: 'You need a image!' })
    }
    const user = await User.findBy('email', authUser?.email)

    if (!user) {
      return response.badRequest({ message: 'Error with the User' })
    }
  }
  async patchPassword({ auth, request, response }: HttpContext) {
    const authUser = auth.user
    const { password } = request.all()
    if (!password) {
      return response.badRequest({ message: 'You need a new password!' })
    }
    const user = await User.findBy('email', authUser?.email)
    if (!user) {
      return response.badRequest({ message: 'Error with the User' })
    }
  }
}
