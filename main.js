import Vue from 'vue'
import App from './App'

Vue.prototype.serverUrl = 'https://www.imovietrailer.com/superhero'
Vue.prototype.qq='lee30829680'

Vue.prototype.getGlobalUser = function (key) {
	let userInfo = uni.getStorageSync("globalUser")
	if (userInfo != null && userInfo != undefined && userInfo != ""){
		return userInfo
	} else {
		return null
	}
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
