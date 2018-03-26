<template>
  <div class="hello">
    <div class="container">
      <div class="row">
        <div class="col-md-12 text-center" style="margin-top: 12px;">
          Sign Up <br><br>
          <input type="text" v-model="nickname" placeholder="Nickname"><br>
          <input type="text" v-model="email" placeholder="Email"><br>
          <input type="password" v-model="password" placeholder="Password"><br>
          <input type="password" v-model="confirm" placeholder="Confirm"><br>
          <span style="color: red; font-size: 10px;">{{ errorMsg }}</span><br>
          <!-- Sign up with Google <br>
          Sign up with Facebook <br><br> -->
          <button @click="signUp">Sign Up </button> <br><br>
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
    }
  },
  data: function () {
    return {
      nickname: '',
      password: '',
      email:'',
      confirm: '',
      errorMsg: ''
    }
  },
  methods: {
    signUp: function () {
      let self = this

      if (this.nickname !== '' && this.password === this.confirm && this.password !== '') {
        // Success
        db.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then(function(result){ 
          // Add user to Firebase DB
          db.firestore().collection("users").doc(result.uid).set(
            { email: self.email, user: self.nickname }
          )
        })
        .then(function() {
          // Login and redirect
          self.$store.commit('logIn', { nickname: self.nickname})
          self.$router.push('/')
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(error)
          // ...
        });
      } else {
        // Error
        let self = this
        self.errorMsg = 'Error. Try again...'

        setTimeout(function () {
          self.errorMsg = ''
        }, 4000)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
