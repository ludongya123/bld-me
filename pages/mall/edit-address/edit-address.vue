<template>
	<view class="container">
		<view class="form-item flex-start"> 
			<text class="label">收货人</text>
			<input type="text" v-model="name" placeholder="姓名" maxlength="10" placeholder-style="color:#ccc;font-size:28upx;"/> 
		</view>
		<view class="xiline"></view>
		<view class="form-item flex-start"> 
			<text class="label">联系方式</text>
			<input type="number" v-model="tel" placeholder="手机号码" maxlength="11" placeholder-style="color:#ccc;font-size:28upx;"/> 
		</view>
		<view class="xiline"></view>
		<view class="form-item flex-start"> 
			<text class="label">收货地址</text>
			<view class="input" :class="regionStr==''?'empty':''" @click="chooseRegion">
				{{regionStr=='' ? '请选择收货地址' : regionStr}}
			</view> 
			<image src="/static/user/a-l-d.png" mode=""></image>
		</view>
		<view class="xiline"></view>
		<view class="form-item flex-start"> 
			<text class="label">详细地址</text>
			<input type="text" v-model="address" placeholder="详细地址"  placeholder-style="color:#ccc;font-size:28upx;"/> 
		</view>
		<view class="xiline"></view>
		<view class="form-item flex-between"> 
			<text class="label">默认地址</text>
			<switch class="switch" :checked="isDafault" @change="changeSwitch"  color="#D6BFA9"/> 
		</view>
		<view class="btn" v-if="id===''" :class="{active:(name!=''&&(/^1[3456789]\d{9}$/.test(tel)) && regionStr!=''&&address!='') }" @click="addAdressHandel()">
			确定
		</view>
		<view class="btns flex-between" v-else>
			<view class="left" @click="deleteArresssHandel()">
				删除
			</view>
			<view class="right" :class="{empty:(name=='' || !(/^1[3456789]\d{9}$/.test(tel)) || regionStr=='' || address=='')}" @click="editAddressHandel()">
				保存
			</view>
		</view>
		<region :show="showRegion" @confirm="confirmRegion"></region>
	</view>
</template>

<script>
	import region from "../../../components/region/region.vue"
	import {addAddress , editAddress,deleteAddress,addressDetail} from "../../../api/mall.js"
	export default {
		data() {
			return {
				showRegion:false, // 是否显示区域选择面板
				id:'',// 修改地址的id 没有则是添加地址
				name:'',
				tel:'',
				regionStr:'',
				code:'', // 区域编码
				address:'' ,// 详细地址
				isDafault:false,
				fromPage:'' // 从何而来
			}
		},
		components:{
			region
		},
		onLoad(opts) {
			this.id = opts.id || ''
			this.fromPage = opts.fromPage || ''
			if(this.id === '') {
				uni.setNavigationBarTitle({
					title:'新增地址'
				})
			} else {
				uni.setNavigationBarTitle({
					title:'编辑地址'
				})
				this.getAddressDetail()
			}
		},
		methods: {
			// 获取地址的详情
			getAddressDetail(){
				addressDetail({
					data:{
						id:this.id
					}
				}).then(res=>{
					if(res.data.code == 0) {
						let {name , mobile, address,region_name,region_code,is_default} = res.data.result
						this.name = name
						this.tel = mobile
						this.address = address
						this.regionStr = region_name
						this.code = region_code
						this.isDafault = is_default == 1 ? true : false
					}
				})
			},
			// 显示区域选择面板
			chooseRegion(){
				this.showRegion = true
			},
			// 确认省市县
			confirmRegion(data=null){
				this.showRegion = false
				if(data) {
					this.regionStr = data.region.join(' ')
					this.code = data.code
				}
			},
			// 切换默认
			changeSwitch(e){ 
				this.isDafault = e.detail.value
			},
			// 添加地址
			addAdressHandel(){
				if(this.name==''|| (!(/^1[3456789]\d{9}$/.test(this.tel))) || this.regionStr=='' || this.address==''){
					return
				}
				uni.showLoading({
					title:'处理中...',
					mask:true
				}) 
				addAddress({
					data:{
						name:this.name,
						mobile:this.tel,
						address:this.address,
						region_code:this.code,
						is_default:this.isDafault ? 1 : 0
					}
				}).then(res=>{
					uni.hideLoading()
					if(res.data.code == 0 ) {
						uni.showToast({
							title:res.data.result.notice,
							icon:'none'
						})
						if( res.data.result.flag == 1){
							if(this.fromPage == 'submitOrder'){
								let pages = getCurrentPages()
								let obj = {};
								obj.id = this.id
								obj.detail_address = this.regionStr+this.address
								obj.receiver = this.name
								obj.mobile = this.tel
								pages[pages.length-2].$vm.userAddresss = obj
							} 
							uni.navigateBack({ })
						}
					}
				})
			},
			// 编辑地址
			editAddressHandel(){
				if(this.name==''|| (!(/^1[3456789]\d{9}$/.test(this.tel))) || this.regionStr=='' || this.address==''){
					return
				}
				uni.showLoading({
					title:'处理中...',
					mask:true
				})
				editAddress({
					data:{
						id:this.id,
						name:this.name,
						mobile:this.tel,
						address:this.address,
						region_code:this.code,
						is_default:this.isDafault ? 1 : 0
					}
				}).then(res=>{
					uni.hideLoading()
					if(res.data.code == 0) {
						uni.showToast({
							title:res.data.result.notice,
							icon:'none'
						})
						if( res.data.result.flag == 1){
							uni.navigateBack({ })
						}
					}
				})
			},
			// 删除地址
			deleteArresssHandel(){
				let that = this
				uni.showModal({
					title:"",
					content:'您确定删除该地址？删除后不可恢复',
					showCancel:true,
					cancelColor:"#999999",
					cancelText:'取消',
					confirmColor:'#C9AD94',
					confirmText:'删除',
					success:function(r){
						if(r.confirm) {
							uni.showLoading({
								title:'处理中...',
								mask:true
							})
							deleteAddress({
								data:{
									id:this.id
								}
							}).then(res=>{
								uni.hideLoading()
								if(res.data.code == 0) {
									uni.showToast({
										title:res.data.result.notice,
										icon:'none'
									})
									if( res.data.result.flag == 1){
										uni.navigateBack({ })
									}
								}
							})
						}
					}
				}) 
			}
		}
	}
</script>

<style lang="scss">
@import "./edit-address.scss"
</style>
