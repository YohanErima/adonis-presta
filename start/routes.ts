/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/register', '#controllers/auth_controller.register')
router.post('/login', '#controllers/auth_controller.login')

router
  .group(() => {
    router.post('/logout', '#controllers/auth_controller.logout')
    router.get('/profile', '#controllers/users_controller.profile')
    router.patch('/profile', '#controllers/users_controller.patchProfile')
    router.patch('/profile/img', '#controllers/users_controller.patchImg')
    router.patch('/profile/password', '#controllers/users_controller.patchPassword')
  })
  .use(middleware.auth({ guards: ['api'] }))

router.get('/users', '#controllers/users_controller.getUsers')

router
  .group(() => {
    router.get('/users', '#controllers/admins_controller.getUsers')
    router.get('/user/:id', '#controllers/admins_controller.getUserById')
    router.patch('/user/:id', '#controllers/admins_controller.patchUserById')
    router.patch('/user/:id/img', '#controllers/admins_controller.patchImgById')
    router.patch('/user/:id/password', '#controllers/admins_controller.patchPasswordById')
    router.delete('/user/:id', '#controllers/admins_controller.deleteUserById')
    router.post('/user/:id/enabled', '#controllers/admins_controller.enableUserById')
  })
  .prefix('/admin')
  .use(middleware.adminCheck())
