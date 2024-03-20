import User from '#models/user'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import fs from 'fs'
export default class UsersController {
  async profile({ auth, response }: HttpContext) {
    const user = await auth.authenticate()
    const { password, enabled, isAdmin, ...userInfo } = user.$attributes
    return response.ok(userInfo)
  }

  async getUsers({ response }: HttpContext) {
    try {
      const users = await User.findManyBy({ is_admin: 0, enabled: 1 })
      return response.ok(users)
    } catch (error) {
      console.log(error)
      return response.internalServerError('Error with the users')
    }
  }

  async patchProfile({ auth, request, response }: HttpContext) {
    try {
      const authUser = auth.user
      const email = request.input('email')

      const fullname = request.input('fullname')
      const area = request.input('area')
      const tel = request.input('tel')
      const job = request.input('job')
      const user = await User.findBy('email', authUser?.email)
      if (!user) {
        return response.badRequest({ message: 'Error with the User' })
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

      return response.ok({ message: 'profile updated' })
    } catch (error) {
      console.log(error)
      return response.internalServerError('Error with the update')
    }
  }

  async patchImg({ auth, request, response }: HttpContext) {
    const authUser = auth.user
    const img = request.file('img', {
      extnames: ['jpg', 'png', 'jpeg'],
      size: '4mb',
    })

    if (!img || !img.isValid) {
      return response.badRequest({ message: 'You need a image!' })
    }
    const user = await User.findBy('email', authUser?.email)

    if (!user) {
      return response.badRequest({ message: 'Error with the User' })
    }

    const filename = `${cuid()}.${img.extname}`
    const oldFile = user.img
    try {
      if (fs.existsSync(`public/uploads/${oldFile}`)) {
        fs.unlinkSync(`public/uploads/${oldFile}`)
      }
      user.img = filename

      await user.save()
      await img.move('public/uploads', { name: filename })

      return response.ok({ message: 'User image updated' })
    } catch (error) {
      console.log(error)
      return response.badRequest({ message: 'Error' })
    }
  }
  async patchPassword({ auth, request, response }: HttpContext) {
    try {
      const authUser = auth.user
      const password = request.input('password')
      if (!password) {
        return response.badRequest({ message: 'You need a new password!' })
      }
      const user = await User.findBy('email', authUser?.email)
      if (!user) {
        return response.badRequest({ message: 'Error with the User' })
      }

      user.password = password
      user.save()
      return response.ok({ message: 'Password updated!' })
    } catch (error) {
      console.log(error)
      return response.internalServerError({ message: 'Error with the update' })
    }
  }
}
