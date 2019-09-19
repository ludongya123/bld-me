import Vue from 'vue'
import App from './App'
import store from './store/index.js'
import skeleton from "./components/quick-skeleton/quick-skeleton.vue";
import uniNavBar from "./components/custom-navbar/custom-navbar.vue"
import load from "./components/load-more/load.vue"
import {loginAction} from "./util/login.js"

import {isLogin,isNotionObd} from "./util/util.js" 
// 引入腾讯地图SDK
var QQMapWX = require('./util/qqmap-wx-jssdk.min.js');

Vue.component('skeleton',skeleton) 
Vue.component('load',load)
Vue.component('uniNavBar',uniNavBar)
Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$login = loginAction 
Vue.prototype.$hasToken = isLogin
Vue.prototype.$isNotionObd = isNotionObd
Vue.prototype.$qqmapsdk = new QQMapWX({
	key: 'WBGBZ-UP4C6-GVVSH-MNXJD-ULDSO-XVFH4'
})
// *******
App.mpType = 'app' 

const app = new Vue({
	store,
    ...App
})
app.$mount()
