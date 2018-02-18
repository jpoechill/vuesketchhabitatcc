<template>
  <div>
    <video width="320" height="320" v-bind:muted="isMuted" @click="toggleSound()" controls loop autoplay>
      <source src="/static/movie_clip01.mov" type="video/mp4">
      <source src="movie.ogg" type="video/ogg"> Your browser does not support the video tag.
    </video>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Main',
  data: function () {
    return {
      isMuted: true
    }
  },
  methods: {
    toggleSound: function () {
      let self = this

      self.isMuted = !self.isMuted

      console.log('Toggled!')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.active {
  display: block;
}

.add-to-cart-hover-card {
  display: block;
  position: absolute;
  z-index: 100;
  background-color: rgba(0, 0, 0, .5);
  text-align: center;
  margin: auto;
  width: 28%;
  font-size: 12px;
  font-weight: 600;
  color: #FFF;
  margin-top: 40%;
  border-radius: 18px;
  left: 0;
  right: 0;
}

.add-to-cart-hover-card:hover {
  background-color: rgba(199, 199, 199, 0.54);
  cursor: pointer;
}

.fade-in {
	opacity: 1;
	animation-name: fadeInOpacity;
	animation-iteration-count: 1;
	animation-timing-function: ease-in;
	animation-duration: .06s;
}

.light-hover:hover {
  background-color: rgba(255, 255, 255, .0);
}

.light-hover:hover {
  background-color: rgba(255, 255, 255, .4);
}

@keyframes fadeInOpacity {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}

.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.btn {
  background-color: transparent;
  color: #FFF;
  border: 0px;
  padding: 0px;
  padding-top: 6px;
  font-size: 12px;
  font-weight: 600;
}

.btn:hover {
  cursor: pointer;
}

.upload-btn-wrapper input[type=file]:hover {
  cursor: pointer;
}

.upload-btn-wrapper input[type=file] {
  left: 0;
  top: 0;
  opacity: 1;
  cursor: pointer;
  width: 24px;
  height: 24px;
  font-size: 0;
  position: absolute;
}

input:hover {
  cursor: pointer;
}

.fade-enter-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.list-enter-active, .list-leave-active {
  transition: all 1.2s;
}
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

</style>
