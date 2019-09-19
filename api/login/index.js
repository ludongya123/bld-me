import {
	http
} from '../index.js'

// 获取验证码 rest/user/captchCode.json
export const getCode = params => {
	return http('rest/user/captchCode.json', params)
}
// 登录 rest/user/appSimpleLogin.json
export const Login = params => {
	return http('rest/user/appSimpleLogin.json', params)
}
// 获取手机号
export const getPhoneNumber = params => {
	return http('rest/user/bindMobile.json', params)
}
