import {
	sign,
	login
} from "../api/user"
import {
	format
} from "./util"
export const loginAction = () => {

	return new Promise((resolve, reject) => {
		let token = uni.getStorageSync('token') || ''
		if (token != '') {
			resolve(token)
			return
		}
		// uni.showLoading({
		// 	title:'正在登录'
		// })
		uni.login({
			success(e) {
				let obj = {
					code: e.code
				};
				login({
					data: obj,
					isLogin: 1 
				}).then(res => {
					// uni.hideLoading()
					if (res.data.code == 0) {
						uni.setStorageSync('token', res.data.result.token) 
						uni.setStorageSync('isMobile', res.data.result.is_bind_mobile)
						resolve({token:res.data.result.token,isMobile:res.data.result.is_bind_mobile})
					} else { 
						uni.showToast({
							title: res.data.message,
							icon:'none'
						})
					}
				})
			}
		})
	})
}

