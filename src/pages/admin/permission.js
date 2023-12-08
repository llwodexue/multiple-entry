import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@admin/utils/get-page-title'

NProgress.configure({ showSpinner: false })

let isFirstAccess = true

// eslint-disable-next-line space-before-function-paren
router.beforeEach(async (to, from, next) => {
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  if (isFirstAccess) {
    isFirstAccess = false
    const accessRoutes = await store.dispatch('permission/generateRoutes', { roles: [] })
    router.addRoutes(accessRoutes)
    next({ ...to, replace: true })
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})
