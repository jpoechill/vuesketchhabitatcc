import Vue from 'vue'
import Vuex from 'vuex'
import userData from '../data/users'
import firebase from '../firebaseInit'

Vue.use(Vuex)

export default new Vuex.Store({
    getters: {
        loggedIn: state => state.loggedIn,
        currentUser: state => state.currentUser,
        users: state => state.users,
    },
    mutations: {
        logOut(state) {
            state.loggedIn = false
            state.currentUser = ''

            firebase.auth().signOut()
        },
        addUser(userData) {
            alert('Adding user to store')
        },
        logIn(state, payload) {
            // console.log(payload.nickname)
            state.currentUser = payload.nickname
            state.loggedIn = true
        },
    },
    state: {
        loggedIn: false,
        currentUser: '',
        users: userData
    }
})
