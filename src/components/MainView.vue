<template>
  <div class="hello">
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <div class="row">
            <div v-for="(img, index) in heroes" class="col-md-12" :key="index" style="margin-bottom: 14px;" v-if="index < 2">
            <div style="background-color: #EEE; margin-bottom: 10px;">
              <transition name="list" v-on:before-enter="beforeEnter" v-on:enter="enter($event, index)" v-bind:data-index="index" mode="out-in" appear>
                <div>
                    <div @click="expandCoverImg(img.imgSrc, filterDate(img.lastUpdated), img.credit); img.isActive = false;" style="cursor: zoom-in;" v-on:mouseover="img.isActive = true" v-on:mouseout="img.isActive = false">
                      <div style="position: relative; width: 100%; padding-bottom: 69%; overflow: hidden;">
                        <div style="position: absolute; top: -40px; width: 100%; height: 100px;">
                          <div v-if="img.imgSrc.split('.').pop().split('?').shift() === 'mov'">
                            <video style="width: 100%; height: auto;" muted loop autoplay>
                              <source v-if="returnMovUrl(img.imgSrc)" :src="img.imgSrc" type="video/mp4">
                            </video>
                          </div>
                          <div v-else>
                            <img id="myimg" :src="img.imgSrc" style="width:100%; max-height:100%;" alt="">
                          </div>
                        </div>
                        <!-- <div class="img-sound" v-on:mouseover="detailIsActive = true" v-on:mouseout="detailIsActive = false">
                          <span style="font-weight: 600;">
                            toggle sound
                          </span>
                        </div> -->
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
            <input type="file" name="Update" @change="onFileChange($event, index)"/>
          </div>
          </div>
        </div>
        <div class="col-md-8 text-right" v-if="sortedArticles.length >= 1">
          <b-tabs v-model="indexObject[0]">
            <b-tab v-for="(article, index) in sortedArticles" :active="article.isActive" :title="article.articleName">
              <div class="dropdown" style="margin-top: 8px;">
                <a class="btn btn-secondary dropdown-toggle text-left" style="width: 100%;" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {{ article.category }}
                </a>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                  <a v-for="subject in subjectCategories" class="dropdown-item" @click="handleDropdownClick(subject, index)" style="width: 100%;">
                    {{ subject }}
                  </a>
                  <div class="dropdown-divider"></div>
                  <a @click="handleDropdownClick('Everything else', index)" class="dropdown-item">Everything else</a>
                </div>
              </div>
              <input class="form-control" type="text" @change="editSubjectTitle($event, index)" style="width: 100%; margin-top: 8px;" v-model="article.subject" placeholder="Subject Interesting">
              <textarea class="form-control" placeholder="Tell me about..."  @change="saveCurrentArticle" v-on:keyup="editArticleBody($event, index)"  v-model="article.articleText" name="" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" style="width: 100%; margin-top: 8px;" id="" rows="17"
              ></textarea>
              <div style="margin-top: 8px;"> 
                <div class="text-left" style="display: inline-block; float: left">
                  <div class="form-check" style="display: inline;">
                    <label class="form-check-label">
                      <input class="form-check-input" type="checkbox" v-model="article.locked"> Locked 
                    </label>
                  </div>
                  <div class="form-check" style="padding-left: 4px; display: inline;">
                    <label class="form-check-label">
                      <input class="form-check-input" type="checkbox" checked> Auto-save 
                    </label>
                  </div>
                </div>
                <div style="float: right;">
                  <button type="button" class="btn btn-light">Cut</button>
                  <button type="button" class="btn btn-light">Copy</button>
                  <button type="button" class="btn btn-light">Clear</button>
                  <!-- <button type="button" class="btn btn-light">Clear All</button> -->
                  <button type="button" class="btn btn-light" @click="saveCurrentArticle(index)">Save</button>
                  <button type="button" class="btn btn-dark" @click="deleteArticle(article.articleName, index)" :disabled="article.locked">Delete Story</button>
                </div>
              </div>
            </b-tab>
            <b-nav-item slot="tabs" @click.prevent="createNewArticle(articles.length)" v-if="articles.length < 7" href="#">
              +
            </b-nav-item>
          </b-tabs>
        </div>
      </div>
      <!-- <div class="row">
        <div class="col-md-4 text-left">
          <input type="text" @keyup.enter="submit" v-model="commentMessage" style="width: 100%; margin-bottom: 8px;" placeholder="Leave a comment"><br>
          <textarea name="" @change="updateCommentsContent" style="width: 100%;" v-model="commentContent" id="" cols="60" rows="3"></textarea>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import db from '../firebaseInit'
import Dropdown from 'vue-js-dropdown'
import Vue from 'vue'

import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue);
Vue.use(Dropdown)

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
      commentMessage: '',
      commentContent: '',
      isMuted: true,
      tabIndex: 2,
      indexObject: [1],
      blueShoe: 10,
      articles: [],
      category: 'Select a Category',
      subjectCategories: [
        'Art and Design',
        'General Living',
        'Web Development'
      ]
    }
  },
  computed: {
    currentUser: function () {
      return this.$store.getters.currentUser
    },
    sortedArticles: function () {
      let self = this

      return self.articles.sort(function(a, b){
        if(a.articleName < b.articleName) return -1;
        if(a.articleName > b.articleName) return 1;
        return 0;
      })
    }
  },
  created: function () {
    let self = this
    let storageRef = db.storage()

    // Fetch and set local comments data
    db.firestore().collection('articles').get()
      .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
          let freshData = doc.data()

          self.articles.push(freshData)
        })
      })

    // Fetch and set local comments data
    db.firestore().collection('comments').get()
      .then(function(querySnapshot){
        let commentsData = querySnapshot.docs[0].data().main
        self.commentContent = commentsData
      })

    // Fetch images by stored name
    db.firestore().collection('heroes').orderBy("order").get()
      .then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
          let freshData = doc.data()

          storageRef.ref('main/'+ freshData.imgSrc)
            .getDownloadURL()
            .then(function(url) {
              freshData.imgSrc = url
            })

          self.heroes.push(freshData)
      })
    })
  },
  mounted() {
    $(".dropdown-menu li a").click(function(){

      $(".btn:first-child").text($(this).text());
      $(".btn:first-child").val($(this).text());

   });

  },
  methods: {
    createNewArticle: function (index) {
      let self = this
      let storageRef = db.storage()

      if (this.articles.length < 7) {
        let newArticle = {
          articleName: 'Article ' + (this.articles.length + 1),
          category: 'Select a Subject',
          subject: '',
          isActive: false,
          locked: true,
          articleText: '',
        }

        // Push to app
        this.articles.push(newArticle)

        // Push to firestorage (DB)
        db.firestore().collection('articles').add(newArticle)
      }
    },
    deleteArticle: function (articleName, index) {
      let self = this
      let localArticles = self.articles


      if (localArticles.length > 1) {
        localArticles.splice(index, 1)

        // Find item for delete, and update cloud
        db.firestore().collection('articles').get().then(function(querySnapshot){
          let index = 0

          querySnapshot.forEach(function(doc){
            let currentData = doc.data()

            console.log("Searching line: " + currentData.articleName)
            // console.log(currentData)
            // console.log(currentData)
           
            if (currentData.articleName === articleName) {
              db.firestore().collection("articles").doc(doc.id).delete().then(function() {
                console.log('Data deleted.')
              })
            } else {
              currentData.articleName = 'Article ' + (index + 1)
              
              db.firestore().collection("articles").doc(doc.id).set(
                currentData
              )

              index++
            }
          })
        })

        // Update article names on local
        localArticles.forEach(function (article, index) {
          article.articleName = 'Article ' + (index + 1)
        })
      }
    },
    handleDropdownClick: function (category, index) {
      this.articles[index].category = category

      // Update DB
      db.firestore().collection('articles').get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
          let freshData = doc.data()
          
          if (freshData.articleName === 'Article ' + (index + 1)) {
            freshData.category = category
          }

          db.firestore().collection("articles").doc(doc.id).set(
            freshData
          )
        })
      })
    },
    editSubjectTitle: function (event, index) {
      let self = this

      console.log('Change subject')
      // Update DB
      db.firestore().collection('articles').get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
          let freshData = doc.data()

          console.log(freshData.articleName)
          // console.log('Article ' + (index + 1))
          if (freshData.articleName === 'Article ' + (index + 1)) {
            freshData.subject = self.articles[index].subject
          }

          db.firestore().collection("articles").doc(doc.id).set(
            freshData
          )
        })
      })
    },
    editArticleBody: function (event, index) {
      let self = this

      // Update DB
      db.firestore().collection('articles').get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
          let freshData = doc.data()
          
          if (freshData.articleName === 'Article ' + (index + 1)) {
            freshData.articleText = self.articles[index].articleText
          }

          db.firestore().collection("articles").doc(doc.id).set(
            freshData
          )
        })
      })
    },
    saveEverything: function () {
      alert('Hello 123')
    },
    saveCurrentArticle: function (index) {
      let self = this
      
      // Update DB
      db.firestore().collection('articles').get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
          let freshData = doc.data()
          
          if (freshData.articleName === 'Article ' + (index + 1)) {
            freshData.articleText = self.articles[index].articleText
          }

          db.firestore().collection("articles").doc(doc.id).set(
            freshData
          )

          console.log('Data saved.')
        })
      })
    },
    returnMovUrl: function (movUrl) {
      if (movUrl.startsWith('https')) {
        return movUrl
      }
    },
    toggleSound: function () {
      let self = this
      self.isMuted = !self.isMuted
    },
    submit: function () {
      let self = this
      
      // Append data to content
      self.commentContent = self.commentMessage + '\n' + self.commentContent

      // Update firebase data
      self.updateCommentsContent()

      // Clear input
      self.commentMessage = ''
    },
    updateCommentsContent: function () {
      let self = this

      db.firestore().collection('comments').get().then(function(querySnapshot){
          querySnapshot.forEach(function(doc){
            db.firestore().collection("comments").doc(doc.id).set(
              { main: self.commentContent }
            )
          })
        })
    },
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
      let self = this
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;

      this.createImage(files[0], imgIndex);

      // Get file type (extension)
      let patt1 = /\.([0-9a-z]+)(?:[\?#]|$)/i;
      let imgFileType = (files[0].name).match(patt1);

      let imgName = 'main/heroImg_0' + imgIndex + imgFileType[0]

      var storageRef = db.storage().ref(imgName);

      // Update DB
      db.firestore().collection('heroes').orderBy("order").get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
          let freshData = doc.data()
          
          if (freshData.order === imgIndex) {
            freshData.imgSrc = 'heroImg_0' + imgIndex + imgFileType[0]
            freshData.lastUpdated = moment().format();  
            freshData.credit = self.currentUser ? self.currentUser : self.randomName()

            // Update DOM attributes
            self.heroes[imgIndex].lastUpdated = freshData.lastUpdated
            self.heroes[imgIndex].credit = freshData.credit
          }

          db.firestore().collection("heroes").doc(doc.id).set(
            freshData
          )
        })
      })

      // Update DOM
      storageRef.put(files[0]).then(function(snapshot) {
        console.log('Uploaded a blob or file!');
      });
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

.show>.dropdown-menu {
  width: 100%;
}

.dropdown {
  /* background: #fff url(data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' v…'0 0 4 5'%3E%3Cpath fill='%23333' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E) no-repeat right .75rem center; */
  background: #fff url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' v…'0 0 4 5'%3E%3Cpath fill='%23333' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/sg%3E1") no-repeat right .75rem center;
  background-size: 8px 10px;
  -webkit-appearance: none;
  -webkit-background-size: 8px 10px;

}

.dropdown-toggle::after {
  /* display: none; */
  float: right;
  margin-top: 8px;
}

.btn-light {
    color: #212529;
    background-color: #f8f9fa;
    border-color: #f8f9fa;
}

.btn-light:hover {
  background-color: #E2E6EA;
  border-color: #E2E6EA;
}

.btn-dark {
  color: #fff;
  background-color: #343a40;
  border-color: #343a40;
  transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}

.btn-dark:hover {
  /* color: #fff; */
  background-color: #333;
  border-color: #343a40;
}

.hello {
  margin-top: 0px;
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
