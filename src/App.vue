<template>
  <div id="app">
    <div class="img-container" v-bind:class="{ active: isActive }" @click="closeCoverImg" style="width: 100vw; 
  cursor: zoom-out; height: 100vh;
    background-color: rgba(0,0,0,.6);">
      <div class="img-detail-main">
        <span style="font-weight: 600;">timeup</span> {{ coverTimeUp }} <br>
        <span style="font-weight: 600;">credit</span> 
        <span v-if="coverCredit.split()[0] === '@'">
          <a :href="'http://instagram.com/' + removeFirstLetter(coverCredit)" style="color: #FFF;">
            {{ removeFirstLetter(coverCredit) }}
          </a>
        </span>
        <span v-else>{{ coverCredit }}</span>
      </div>
      <img :src="coverImg" style="width: 99%; position: absolute; left: 0;" alt="">
    </div>
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div style="float: left; color: #111; vertical-align: baseline;">
            <router-link :to="{ path: '/' }">
            <!-- <span @click="$router.push('/')"> -->
              <span style="font-size: 28px; font-weight: 600;">
                Sketchhabitat.</span><span style="font-size: 28px; font-weight: 300;">cc
              </span>
            <!-- </span> -->
            </router-link> 
          </div>
          <div style="font-family: 'Montserrat'; float: right; margin-top: 14px; width: 500px; font-weight: 300; vertical-align: baseline;">
            <div :key="1" style="position: absolute; right: 0; display: inline-block; padding-right: 15px;">
              <router-link class="sign-up" to="/discover">Discover</router-link> | 
              <span v-if="!loggedIn" >
                <router-link class="sign-up" to="/signup">Sign up</router-link>, 
                or <router-link class="log-in" to="/login">Log in</router-link>
              </span>
            </div>
            <transition name="fade">
                <div v-if="loggedIn" style="position: absolute; right: 0; display: inline-block; padding-right: 15px;">
                <router-link :to="{ path: '/' + currentUser} ">
                  {{ currentUser }}
                </router-link> |
                <router-link class="log-out" v-on:click.native="logOut" to="/">Log out</router-link>
                </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <div class="container" style="padding: 0px; margin-top: 4px">
      <div class="row">
        <div class="col-md-12" v-bind:class="{ active: !isActive }" >
          <router-view v-on:updateCoverImg="updateCoverImg"></router-view>
        </div>
      </div>
    </div>
    <div class="container" v-if="this.$route.path !== '/signup' || this.$route.path !== '/login'">
      <div class="row">
        <div class="col-md-12" style="text-align: center; font-size: 14px; margin-top: 10px;">
          <a href="http://rithfolio.com">
            <img src="/static/Po_logo.png" style="margin-right: 22px; width: 28px; height: 28px; margin-top: -20px;" alt="">
          </a>
          <a href="https://vuejs.org">
            <img src="https://vuejs.org/images/logo.png" style="margin-right: 22px; width: 28px; height: 28px; margin-top: -20px;" alt="">
          </a>
          <a href="https://unsplash.com">
            <svg class="_2m4hn" version="1.1" viewBox="0 0 32 32" width="28" height="28" aria-labelledby="unsplash-home" style="margin-right: 14px; margin-top: 0px;" aria-hidden="false">
              <title id="unsplash-home">Unsplash Home</title>
              <path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z">
              </path>
            </svg>
          </a>
          <br>
          <div style="margin-top: 6px; font-weight: 300; font-size: 14px; font-family: Helvetica; margin-bottom: 4px;">
            An app by Po, via. <i>Rithfolio.com</i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import db from './firebaseInit'

export default {
  name: 'App',
  computed: {
    loggedIn: function () {
      return this.$store.getters.loggedIn
    },
    currentUser: function () {
      return this.$store.getters.currentUser
    },
  },
  created () {
    console.log(this.$route.path)
  },
  data () {
    return {
      total: 0,
      isActive: false,
      coverImg: '',
      coverCredit: '',
      coverTimeUp: '',
      show: true,
    }
  },
  methods: {
    removeFirstLetter: function (nickname) {
      return nickname.split().shift()
    },
    updateCoverImg: function (imgSrc, coverTimeUp, coverCredit) {
      this.coverImg = imgSrc

      this.coverCredit = coverCredit.split().shift()
      this.coverTimeUp = coverTimeUp
      this.isActive = !this.isActive
    },
    closeCoverImg: function () {
      this.isActive = false;
    },
    logOut: function () {
      let self = this

      // Logout Firebase DB, then out of application state
      db.auth().signOut().then(function() {
        self.$store.commit('logOut')
      }, function(error) {
        console.error('Sign Out Error', error);
      });
    },
  }
}
</script>

<style>
#app {
  font-family:  'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #111;
  margin-top: 10px;
}

.sign-up:hover {
  text-decoration: underline;
}

.log-in:hover {
  text-decoration: underline;
}

.log-out:hover {
  text-decoration: underline;
}

a:link, a:visited, a:active, a:hover {
  color: #111;
  text-decoration: none;
}

.cover-img {
  background: url('/static/img-square-2.png');
  background-repeat: no-repeat;
  background-size: 100% auto;
  position: absolute; 
  top: 0; 
  background-color: green; 
  height: 100vh;
  width: 100vw;
  z-index: 10000; 
  display: block;
}

/* .cover-img {
  display: none;
} */

.img-container {
  position: absolute; 
  display: none; 
  top: 0; 
  z-index: 100;
}

/* #app:hover .img-container {
  display: block;
} */

.active {
  display: block;
}

body {
  overflow-y: scroll; overflow-x: hidden;
}

.col-md-4 > div:hover .img-detail {
  display: block;
}

.col-md-4 > div:hover .img-sound {
  display: block;
}

.img-sound {
  z-index: 100;
  display: none;
  font-size: 10px; 
  color: #FFF; 
  background-color: rgba(0, 0, 0, .5); 
  position: absolute; 
  bottom: 0; 
  right: 0;
  padding: 4px 5px 4px 5px; 
  letter-spacing: .5px; 
  margin: 10px 10px; 
  line-height: 12px; 
  text-align: left;
  border: .8px solid rgba(0,0,0,.09);
}

.img-sound:hover {
  cursor: text;
}

.img-detail {
  z-index: 100;
  display: none;
  font-size: 10px; 
  color: #FFF; 
  background-color: rgba(0, 0, 0, .5); 
  position: absolute; 
  bottom: 0; 
  padding: 4px 5px 4px 5px; 
  letter-spacing: .5px; 
  margin: 10px 10px; 
  line-height: 12px; 
  text-align: left;
  border: .8px solid rgba(0,0,0,.09);
}

.img-detail:hover {
  cursor: text;
}

.img-detail-main {
  z-index: 1000;
  font-size: 10px; 
  color: #FFF; 
  background-color: rgba(0, 0, 0, .5); 
  position: fixed; 
  bottom: 0; 
  padding: 4px 5px 4px 5px; 
  letter-spacing: .5px; 
  margin: 10px 10px; 
  line-height: 12px; 
  text-align: left;
  border: .8px solid rgba(0,0,0,.09);
}

.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity 1.4s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
