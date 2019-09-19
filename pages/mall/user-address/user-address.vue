<template>
	<view class="container">
		<block v-for="(item,index) in addList">
			<view class="item flex-start" :key="index">
				<view class="left" v-if="item.checked==1">
					<image src="/static/mall/choose.png" mode=""></image> 
				</view>
				<view class="left" @click="setChecked(index)" v-else>
					<text class="circle"></text>
				</view>
				<view class="center" @click="setChecked(index)">
					<view class="user-name">
						{{item.name}} <text>{{item.mobile}}</text>
					</view>
					<view class="detail">
						<text v-if="item.is_default==1">默认</text>{{item.region_name+item.address}}
					</view>
				</view>
				<view class="right" @click="toEdit(item.id)">
					<image src="/static/user/edit.png" mode=""></image>
				</view>
			</view>
			<view class="xiline" :key="index"></view>
		</block>
		<view class="btn" @click="toEdit()">新增地址</view>
	</view>
</template>

<script>
	import {
		addressList
	} from "../../../api/mall.js"
	export default {
		data() {
			return {
				addList: [],
				fromPage:'' //来自哪个页面跳转的
			}
		},
		onLoad(options) {
			this.fromPage = options.fromPage
		},
		onShow() {
			this.getAddress()
		},
		methods: {
			getAddress() {
				addressList({
					data: {
						page_no: 1,
						page_size: 20
					}
				}).then(res => {
					if (res.data.code == 0) {
						let list = res.data.result.addresses
						for (let i in list ) {
							list[i].checked = 0
						}
						this.addList = list
					}
				})
			},
			setChecked(index){
				for(let i in this.addList) {
					if(i == index){
						this.addList[index].checked = 1
					} else {
						this.addList[index].checked = 0
					}
				}
				setTimeout(()=>{
					
					if(this.fromPage == 'submitOrder'){
						let pages = getCurrentPages()
						let obj = {};
						obj.id = this.addList[index].id
						obj.detail_address = this.addList[index].region_name+this.addList[index].address
						obj.receiver = this.addList[index].name
						obj.mobile = this.addList[index].mobile
						pages[pages.length-2].$vm.userAddresss = obj
					} 
					uni.navigateBack({ })
				},500)
			},
			toEdit(id=''){
				uni.navigateTo({
					url:`/pages/mall/edit-address/edit-address?id=${id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	@import './user-address.scss'
</style>
