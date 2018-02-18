<template>
  <div class="hello">
    <div class="container">
      <div class="row">
       <div class="col-md-12 text-right" style="margin-top: 12px;">
        <input type="text" v-model="nickname" placeholder="@nickname"><br>
        <input type="password" v-model="password" placeholder="Password"><br>
        <span style="color: red; font-size: 10px;">{{ errorMsg }}</span>
        <span style="color: green; font-size: 10px;">{{ successMsg }}</span><br>
        <button @click="login">Login</button>
       </div>
      </div>
    </div>
  </div>
</template>

<script>
import db from '../firebaseInit'

export default {
  name: 'Login',
  computed: {
    loggedIn: function () {
      return this.$store.getters.loggedIn
    },
  },
  created () {
    // Fetch and set users
    let self = this

    // Fetch and set users to local val
    db.firestore().collection('users').get().then(function(querySnapshot){
      let returnArr = [];

      querySnapshot.forEach(doc => {
        returnArr.push(doc.data());
      });

      self.users = returnArr;
    })
  },
  data: function () {
    return {
      nickname: '',
      password: '',
      users: [],
      errorMsg: '',
      successMsg: ''
    }
  },
  methods: {
    login: function () {
      let self = this

      if (this.nickname !== '' && this.password !== '') {
        // Find user
        let user = self.users.find(function(user){
          return user.user === self.nickname
        })

        if (user) {
          // User found
          db.auth().signInWithEmailAndPassword(user.email, this.password)
          .then(function() {
            // Update status message
            self.successMsg = 'Logged in.'
            
            setTimeout(function () {
              self.successMsg = ''
            }, 4000)

            // Update application state
            self.$store.commit('logIn', { nickname: self.nickname })

            // Reroute page
            self.$router.push('/')
          })
          .catch(function(error) {
            self.errorMsg = error.message;
          });
        } else {
          // User not found
          self.errorMsg = 'User not found.'

          setTimeout(function () {
            self.errorMsg = ''
          }, 4000)
        }
      } else {
        self.errorMsg = 'Error. Try again...'

        setTimeout(function () {
            self.errorMsg = ''
          }, 4000)
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
