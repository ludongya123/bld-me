<script>
	import {
		mapMutations
	} from "vuex"
	import { gcj02tobd09 } from "./util/util.js" 
	export default {
		globalData: {
			longitude: '', // 经度
			latitude: "", // 维度	
		},
		onLaunch: function() {

		},
		onShow: function() {
			this.$login().then(r => {
				if (!r) {
					return
				}
				var that = this;

				uni.getSetting({
					success(res) { 
						if (res.authSetting['scope.userLocation'] === undefined) {
							// 未授权过位置信息 
							that.getLocationInfo()
						}
						// 拒绝授权
						if (res.authSetting['scope.userLocation'] === false) {
							uni.showModal({
								title: '提醒',
								content: '为了更好的享受我们的服务，请授权你的地理位置',
								success(r) {
									if (r.confirm) {
										uni.openSetting({
											success(res) {
												console.log(res)
											}
										})
									}
								}
							})
						}
						if (res.authSetting['scope.userLocation'] === true) {
							that.getLocationInfo()
						}
					}
				})

			}) 
		},
		onHide: function() { 
		},
		methods: {
			...mapMutations(['authLocation']),
			// 获取地理位置
			getLocationInfo() {
				let that = this;
				uni.authorize({
					scope: 'scope.userLocation',
					success() {
						uni.getLocation({
							type: 'gcj02',
							success: function(res) { 
								let coords = gcj02tobd09(res.longitude,res.latitude) 
								getApp().globalData.longitude = coords[0]; //当前位置的经度
								getApp().globalData.latitude = coords[1]; //当前位置的纬度 
								that.authLocation()
							}
						});
					},
					fail(e) {
						console.log(e)
						let that = this;
						if (e.errMsg == "authorize:fail auth deny") {
							// 
							// uni.showModal({
							// 	title: '提醒',
							// 	content:'为了更好的享受我们的服务，请授权你的地理位置',
							// 	showCancel: false,
							// 	success() {
							// 		uni.openSetting({
							// 			success(res) {
							// 				console.log(res)
							// 			}
							// 		})
							// 	}
							// })
						}
					}
				})
			},
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import './common/css/common.css'
</style>
