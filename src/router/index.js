import Vue from 'vue'
import Router from 'vue-router'
import MainView from '@/components/MainView'
import LoginView from '@/components/LoginView'
import SignupView from '@/components/SignupView'
import UserpageView from '@/components/UserpageView'
import ExploreView from '@/components/ExploreView'
import TestView from '@/components/TestView'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'MainView',
      component: MainView
    },
    {
      path: '/login',
      name: 'LoginView',
      component: LoginView
    },
    {
      path: '/signup',
      name: 'SignupView',
      component: SignupView
    },
    {
      path: '/discover',
      name: 'ExploreView',
      component: ExploreView
    }, 
    {
      path: '/test',
      name: 'TestView',
      component: TestView
    }, 
    {
      path: '/:username',
      name: 'UserpageView',
      component: UserpageView
    }
  ]
})
