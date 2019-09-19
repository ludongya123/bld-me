<template>
	<!-- 111111111111 切换账号 -->
	<view class="user-switching-accounts">
		<view class="user-switching-tips" v-if="accountsLength >1">当前登录手机号有两个客户，可点击切换</view>
		
		<view class="user-switching-content">
			<view class="user-switching-top flex-start">
				<view class="user-switching-top-text">当前登录手机号 </view>
				<text>{{mobile}}</text>
			</view>
			<view class="xiline"> </view>

			<view class="user-accounts-select flex-selec-start" >
				<view class="user-accounts-select-left">客户名称</view>
				
				<view class="user-accounts-select-right ">
					<view v-for="(item, index) in customersList" :key="index" @click="selectCustomers(item.id,index)">
						<view class="flex-start item-select flex-start" >
							<text :class="{'sleect-text' : selectIcon == index}">{{item.name}}</text>
							<!-- <image class="a-icon" src="/static/user/a-l-l.png" mode=""></image> -->
							<view class="icon-box">
								<image src="/static/home/baoyang/icon_check_store.png" class="icon" v-if="selectIcon == index"></image>
								<image src="/static/home/baoyang/icon_check_none.png" class="icon" v-if="selectIcon != index"></image>
							</view>
						</view>
						<view class="xiline"></view>
					</view>
				</view>
				
			</view>
		</view>
		<!-- <view v-if="accountsLength >1">当前登录手机号有两个客户，可点击切换</view> -->
		
		<view class="submit active"  @click="defineSubmit" >确定切换</view>
		
		<view class="submit btn-bg-none"  @click="submit" >切换登录手机号</view>
	</view>
	
</template>


<script>
	import {customerList,switchCustomer} from "../../../api/user.js"
	export default {
		data() {
			return {
				isCheck: true,
				mobile:"",
				customersList: [], // 用户账号列表数据
				selectIcon:'-1',
				selectid:'',
				accountsLength:0
			}
		},
		onLoad(opts) {
			this.mobile = opts.mobile;
			this.getCustomerList();
		},
		methods: {
			// 获取账号列表
			getCustomerList() {
				uni.showLoading({
					title:"加载中..."
				})
				customerList().then((res) => { 
					uni.hideLoading()
					if (res.data.code == 0) {
						
						this.customersList = res.data.result.customers
						this.accountsLength = this.customersList.length
						this.customersList.forEach((item, index) => {
							if(item.selected == 1){
								this.selectIcon = index ;
								this.selectid = item.id ;
							}
							
						})
					}
				})

			},
			submit(){ 
				uni.navigateTo({
					url: '/pages/login/login?loginFlag=1&jumpSource=1'
				})
			},
			selectCustomers(id,index){
				if(this.customersList.length <=1){
					return false;
				}
				if (index != undefined) {
					this.selectIcon = index ;
				}
				this.selectid = id;
				
			},
			defineSubmit(){
				uni.showLoading({
					title:"加载中..."
				})
				switchCustomer({
					data:{
						customer_id:this.selectid
					}
				}).then((res) => { 
					uni.hideLoading()
					if (res.data.code == 0) {
						uni.navigateBack();
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import './user-switching-accounts.scss'
</style>
