<template>
  <div class="hello">
    <div class="container">
      <div class="row">
          <div v-for="(img, index) in sortedHeroes" class="col-md-4" :key="index" style="margin-bottom: 6px;">
            <div style="background-color: #EEE; margin-bottom: 0px;">
              <transition name="list" v-on:before-enter="beforeEnter" v-on:enter="enter($event, index)" v-bind:data-index="index" mode="out-in" appear>
                <div>
                    <div @click="expandCoverImg(img.imgSrc, filterDate(img.lastUpdated), img.credit); img.isActive = false;" style="cursor: zoom-in;" v-on:mouseover="img.isActive = true" v-on:mouseout="img.isActive = false">
                      <div style="position: relative; width: 100%; padding-bottom: 100%; overflow: hidden;">
                        <div class="light-hover" style="position: absolute; width: 100%; padding-bottom: 100%; z-index: 99;"></div>
                        <div style="position: absolute;">
                          <img id="myimg" :src="img.imgSrc" style="max-width:100%; max-height:100%;" alt="">
                        </div>
                        <div class="img-detail" v-on:mouseover="detailIsActive = true" v-on:mouseout="detailIsActive = false">
                          <span style="font-weight: 600;">timeup</span> {{ filterDate(img.lastUpdated) }} <br>
                          <span style="font-weight: 600;">credit</span> 
                          <span v-if="img.credit.split('').shift() === '@'">
                            <a :href="'http://instagram.com/' + img.credit.split('').slice(1).join('')" style="color: #FFF;">
                              {{ img.credit }}
                            </a>
                          </span>
                          <span v-else>
                            {{ img.credit }}
                            </span>
                        </div>
                      </div>
                    </div>
                </div>
              </transition>
            </div>   
            <span v-if="currentUser === requestedUser">
              <input type="file" name="Update" @change="onFileChange($event, index)"/>
            </span>           
          </div>
      </div>
      <div class="row">
        <div class="col-md-12" style="height: 30px;">
          <div data-v-000ab9d8="" style="width: 100%; height: 14px; border-bottom: .3px solid #ccc; text-align: left;">
            <span data-v-000ab9d8="" style="font-size: 14px; font-weight: 300; background-color: #FFF;padding: 0px 10px 0px 6px;">
              jpoechill 
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import db from '../firebaseInit'

export default {
  name: 'Main',
  data: function () {
    return {
      image: '',
      heroes: [],
      users: [],
      uploadIsActive: false,
      detailIsActive: false,
      imgIsActive: false,
      currentUser: this.$store.getters.currentUser,
      requestedUser: this.$route.params.username
    }
  },
  computed: {
    sortedHeroes: function () {
      let self = this
      return self.heroes.sort(function(a, b) {
        return a.order - b.order;
      });
    }
  },
  created: function () {
    let self = this

    let storageRef = db.storage()

    console.log('ABC 123')
    // console.log(self.requestedUser)

    // Fetch images by stored name
    db.firestore().collection('users').get()
      .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
          let freshData = doc.data()


          // console.log(freshData)

          if (self.requestedUser === freshData.user) {
            console.log('Match found: ' + freshData.user)
            console.log(freshData)

            console.log('----')
            console.log('Image names...')
            freshData.images.forEach(function(imgName, index) {
              console.log(imgName, index)
              let newImageObject = {
                credit: self.requestedUser,
                isActive: false,
                lastUpdated: "2018-02-15T22:26:32+01:00",
                order: index
              }

              storageRef.ref('users/'+ freshData.user + '/' + imgName)
                .getDownloadURL()
                .then(function(url) {
                  newImageObject.imgSrc = url

                  self.heroes.push(newImageObject)
                })
            })

          }

      })
      })
  },
  methods: {
    uploadImg: function () {
      let self = this
      this.uploadIsActive = true

      setTimeout(function() { self.uploadIsActive = false }, 1000)
    },
    expandCoverImg: function (imgSrc, coverTimeUp, coverCredit) {
      if (this.uploadIsActive !== true && this.detailIsActive !== true ) {
        this.$emit('updateCoverImg', imgSrc, coverTimeUp, coverCredit)
        this.imgIsActive = !this.imgIsActive
      }
    },
    filterDate: function (unfilteredDate) {
      let timeup = moment(unfilteredDate).fromNow().slice(0, -4);

      if (timeup === "a day") { timeup = "1 day" }

      return timeup
    },
    onFileChange(e, imgIndex) {
      // let self = this
      // let files = e.target.files || e.dataTransfer.files;
      // if (!files.length)
      //   return;

      // this.createImage(files[0], imgIndex);

      // // Get file type (extension)
      // let patt1 = /\.([0-9a-z]+)(?:[\?#]|$)/i;
      // let imgFileType = (files[0].name).match(patt1);

      // let imgName = 'main/heroImg_0' + imgIndex + imgFileType[0]

      // var storageRef = db.storage().ref(imgName);

      // Update DB
      // db.firestore().collection('heroes').orderBy("order").get().then(function(querySnapshot){
      //   querySnapshot.forEach(function(doc){
      //     let freshData = doc.data()
          
      //     if (freshData.order === imgIndex) {
      //       freshData.imgSrc = 'heroImg_0' + imgIndex + imgFileType[0]
      //       freshData.lastUpdated = moment().format();  
      //       freshData.credit = self.currentUser ? self.currentUser : self.randomName()

      //       // Update DOM attributes
      //       self.heroes[imgIndex].lastUpdated = freshData.lastUpdated
      //       self.heroes[imgIndex].credit = freshData.credit
      //     }

      //     db.firestore().collection("heroes").doc(doc.id).set(
      //       freshData
      //     )
      //   })
      // })

      // Update DOM
      // storageRef.put(files[0]).then(function(snapshot) {
      //   console.log('Uploaded a blob or file!');
      // });
    },
    createImage(file, imgIndex) {
      var image = new Image();
      var reader = new FileReader();
      var self = this;

      reader.onload = (e) => {
        self.heroes[imgIndex].imgSrc = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeImage: function (e) {
      this.image = '';
    },
    beforeEnter: function (el) {
      el.style.opacity = 0
    },
    enter: function (el, itemIndex) {
      var delay = (itemIndex) * 900

      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1, position: 'absolute' },
        )
      }, delay)
    },
    randomName: function () {
      let names = [
        'a mysterious marauder',
        'an angel-faced baby',
        'lightning in a bottle',
        'I\'m up to no good',
        'cello the cherubim',
        'the pancake pirates',
      ]

      return names[Math.floor((Math.random() * 6) + 0)]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  margin-top: 12px;
}

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
