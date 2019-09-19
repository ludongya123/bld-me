<template>
	<view class="login_box login_box_ph">
		<!-- 11111111111111111111微信授权登录 -->
		<block v-if="loginFlag == 0">
			<image src="../../static/login/logo_bld.png" class="img_logo"></image>
			<view class="login_title">BLD-me</view>
			<view class="btn_wx_login" :class="{not_click: !checkDesFlag}">
				<image src="../../static/login/icon_wx.png" class="icon_wx"></image>
				<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" @tap='showLoading' class="btn_title" :disabled="!checkDesFlag">微信用户快速登录</button>
			</view>
			<view class="btn_ph_login" @click="this.loginFlag = 1">手机号码登录/注册</view>
		</block>
		<!-- 222222222222222222手机号登录 -->
		<block v-if="loginFlag == 1">
			<view class="line_one">
				<view class="left_title">手机号</view>
				<input type="number" maxlength="11" :value="phone.phoneNumber" class="input_com" placeholder="请输入手机号" placeholder-class="plac_st"
				 @input="changePhone">
				<image src="../../static/login/icon_clear_phone.png" class="clear_phone" @click="phone.phoneNumber=''"></image>
			</view>
			<view class="line_two">
				<view class="left_title">验证码</view>
				<input type="number" maxlength="4" :value="phone.code" class="input_com" placeholder="请输入验证码" placeholder-class="plac_st" @input="changeCode">

				<!-- 显示获取验证码且手机号合法 -->
				<view class="btn_code get_btn_code" v-if="show && !!(/^1[3456789]\d{9}$/.test(phone.phoneNumber))" @click="getCode">
					获取验证码
				</view>

				<!-- 显示获取验证码且手机号不合法 -->
				<view class="btn_code get_btn_code no_btn_code" v-if="show && !(/^1[3456789]\d{9}$/.test(phone.phoneNumber))">获取验证码</view>

				<!-- 显示倒计时 -->
				<view class="btn_code" v-if="!show">{{count}}s 重新获取</view>
			</view>
			<view class="btn_login active"  v-if="(/^1[3456789]\d{9}$/.test(phone.phoneNumber)) && phone.code.length==4 && checkDesFlag"
			 @click="phoneLogin">登录</view>
			<view class="btn_login" 
			 v-else>登录</view>
		</block>

		<view class="login_des flex-center">
			<image :src="checkDesFlag ? '../../static/login/icon_check_y.png': '../../static/login/icon_check_n.png'" class="icon_check"
			 @click="checkDes"></image>
			<view class="login_des_1">我已阅读并同意</view>
			<view class="login_des_2" @click="openWeb">《BLD-ME用户协议》</view>
		</view>

	</view>
</template>

<script>
	import {
		getCode,
		getPhoneNumber,
		Login
	} from '../../api/login/index.js'
	import {
		goPage
	} from '../../util/util.js'
	export default {
		data() {
			return {
				params: {},
				checkDesFlag: true, // 是否选中协议
				loginFlag: 0, // 0:微信授权登录，1：手机号登录
				jumpSource:0,//1切換账号来源跳转到个人中心
				phone: {
					phoneNumber: '',
					code: '',
				},
				timer: null,
				show: true,
				count: 0,
				sssId: ''
			}
		},
		onLoad(opts) {
			uni.hideShareMenu()
			this.params = opts.params ? JSON.parse(opts.params) : {}
			this.sssId = opts.sss_id || ''
			this.loginFlag = opts.loginFlag || 0
			this.jumpSource = opts.jumpSource || 0
		},
		watch:{
			loginFlag(v){
				if(v == 1){
					uni.setNavigationBarTitle({
						title:'手机验证码登录'
					})
				}
			}
		},
		methods: {
			showLoading(){
				uni.showLoading({
					title:'处理中...',
					mask:true
				})
			},
			// 获取手机号
			getPhoneNumber(e) {
				
				if (e.detail.errMsg == 'getPhoneNumber:ok') {
					uni.showToast({
						title: '获取手机号成功',
						mask: true,
						duration: 2000,
						icon: 'none'
					});
					// 调用获取手机号接口
					getPhoneNumber({
						data: {
							encrypted_data: e.detail.encryptedData,
							iv: e.detail.iv
						}
					}).then((res) => { 
						if (res.data.code == 0 && res.data.result.flag == 1) {
							uni.setStorageSync('isMobile', 1)
							if (!this.sssId) {
								uni.navigateBack()
							} else {
								goPage(Object.assign(this.params, {
									sss_id: this.sssId
								}), 'login')
							}
						} 
					})


				} else if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
					uni.showToast({
						title: '你拒绝了授权',
						mask: true,
						duration: 2000,
						icon: 'none'
					});
				} else {
					uni.showToast({
						title: '授权失败',
						mask: true,
						duration: 2000,
						icon: 'none'
					})
				}
			},
			// 切换同意协议
			checkDes() { 
				this.checkDesFlag = !this.checkDesFlag;
			},
			changePhone(e) {
				this.phone.phoneNumber = e.detail.value;
			},
			changeCode(e) {
				this.phone.code = e.detail.value;
			},
			phoneLogin() {
				let that = this;
				uni.login({
					provider: 'weixin',
					success: function (e) {
						Login({
							data: {
								login_name: that.phone.phoneNumber,
								captch_code: that.phone.code,
								weixin_code:e.code
							}
						}).then((res) => {
							if (res.data.code == 0) {
								uni.hideLoading()
								uni.setStorageSync('isMobile', 1)
								uni.setStorageSync('token',res.data.result.token)
								if (!that.sssId && that.jumpSource ==0) {
									uni.navigateBack()
								}else if(that.jumpSource == 1){
									uni.switchTab({
										url:'/pages/user/user'
									})
								}else {
									goPage(Object.assign(that.params, {
										sss_id: that.sssId
									}), 'login')
								}
							}
						})
					}
				});
				
				
			},
			getCode() {
				getCode({
					data: {
						login_name: this.phone.phoneNumber,
						type: '8'
					} 
				}).then((res) => { 
					if (res.data.code == 0) {
						uni.showToast({
							mask:true,
							icon:'none',
							title:'获取成功，请注意查收'
						})
						const TIME_COUNT = 60;
						if (!this.timer) {
							this.count = TIME_COUNT;
							this.show = false;
							this.timer = setInterval(() => {
								if (this.count > 0 && this.count <= TIME_COUNT) {
									this.count--;
								} else {
									this.show = true;
									clearInterval(this.timer);
									this.timer = null;
								}
							}, 1000)
						}
					}
				}) 
			},
			// 跳转协议页面
			openWeb(){
				let src = 'https://static.car-me.com/cms/content/bldmexieyi.html';
				uni.navigateTo({
					url:`/pages/home/web-view/web-view?url=${src}&title=用户协议`
				})
			}
		}
	}
</script>

<style lang="scss">
	@import './login.scss'
</style>
