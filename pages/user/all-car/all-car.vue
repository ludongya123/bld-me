<template>
	<view class="wrapper">
		<view class="swiper-item" v-for="(item,index) in list" :key="index">
			<view class="car-info flex-start" @click="openMyCar(item.id)" :key="index">
				<image class="img" :src="carIcon+item.brand_id+'.png'" mode=""></image>
				<view class="car-detail">
					<view class="car-name flex-start">
						<text>{{item.car_no || '暂无车牌'}}</text>
						<image v-show="item.is_ico==1" src="/static/user/v.png" mode=""></image>
					</view>
					<view class="car-subname">
						{{item.series_name}} {{item.vehicle_type_name}}
					</view>
					<view class="car-mileage">
						行驶里程：{{item.mileage ? item.mileage+"km": '--'}}
					</view>
				</view>
			</view>
			<view class="xiline"> </view>
			<view class="flex-between handel-area">
				<view v-if="item.car_no" class="set-default flex-start" @click="setDefaultCarHandel(item.id,index)">
					<image class="icon" v-if="item.is_default==1" src="/static/user/secd.png" mode=""></image>
					<image class="icon" v-if="item.is_default!=1" src="/static/user/circle.png" mode=""></image>
					<text>{{item.is_default==1?'默认车辆' :'设置默认车辆'}}</text>
				</view>
				<view v-else></view>
				<view class="edit-del flex-start">
					<view class="edit flex-end" @click="edit(item.id,item.is_ico,item.car_no,item.brand_id)">
						<image class="icon" src="/static/user/edit.png" mode=""></image>
						<text>编辑</text>
					</view>
					<view class="del flex-end" v-if="item.is_obd!=1 && item.is_ico!=1" @click="delCarH(item.id,index)">
						<image class="icon" src="/static/user/del.png" mode=""></image>
						<text class="del-text">删除车辆</text>
					</view>
					<view class="del flex-end" v-if="item.is_obd==1" @click="openObd(item.id)">
						<image class="icon" src="/static/user/gjh.png" mode=""></image>
						<text class="del-text">爱车管家</text>
					</view>
				</view>
			</view>
		</view>
		<load :show="isShowLoading"></load>
		<view class="nodata" v-if="scrollNodata">没有更多数据了~</view>
	</view>
</template>

<script>
	import {
		userCar,
		carIcon,
		setDefaultCar,
		delCar
	} from "../../../api/user.js"
	export default {
		data() {
			return {
				carIcon: carIcon,
				isShowLoading: true,
				isMoreLoad: true,
				scrollNodata: false,
				page: 1,
				list: []
			}
		},
		onLoad() {
			uni.hideShareMenu()
		},
		onReachBottom() {
			this.getCar()
		}, 
		onShow() {
			this.isShowLoading = true,
			this.isMoreLoad = true,
			this.scrollNodata = false,
			this.page = 1,
			this.list = []
			this.getCar()
		},
		methods: {
			// 获取车辆
			getCar() {
				if (!this.isMoreLoad) return
				this.isMoreLoad = false
				userCar({
					data: {
						page_no: this.page,
						page_size: 10
					}
				}).then(res => {

					if (res.data.code == 0) {
						let p_c = res.data.result.page_count
						let p_o = res.data.result.page_no
						let list = res.data.result.user_cars
						if (p_c > p_o) {
							this.isMoreLoad = true
							this.page++
						}
						if (p_c == p_o) {
							this.isShowLoading = false
						}
						if (p_c == p_o && p_o > 1) {
							this.scrollNodata = true
						}
						this.list = [...this.list, ...list]
					}
				})
			},
			// 设置默认车辆
			setDefaultCarHandel(id, index) {
				if (this.list[index].is_default == 1) return
				setDefaultCar({
					data: {
						id: this.list[index].id
					}
				}).then(res => {
					if (res.data.code == 0) {
						if (res.data.result.flag == 1) {
							uni.showToast({
								title: "设置成功",
								icon: 'none'
							})
							for (let i in this.list) {
								if (i == index) {
									this.list[i].is_default = true
								} else {
									this.list[i].is_default = false
								}
							}
						}
					}
				})
			},
			// 跳到编辑
			edit(id, isIco,carId,BrandId) {
				// isIco :1 4s店认证
				if (isIco == 1) {
					if(!carId || !BrandId){
						uni.navigateTo({
							url: '/pages/user/add-car/add-car?id=' + id
						})
					} else {
						uni.navigateTo({
							url: '/pages/user/edit-v-car/edit-v-car?id=' + id
						})
					}
					
				} else {
					uni.navigateTo({
						url: '/pages/user/add-car/add-car?id=' + id
					})
				}
			},
			// 跳到obd爱车管家
			openObd(id) {
				this.$isNotionObd().then(()=>{
					uni.navigateTo({
						url: `/pages/user/car-butler/car-butler?carId=${id}`
					})
				}) 
			},
			// 跳转到我的车辆页面
			openMyCar(id) {
				uni.navigateTo({
					url: "/pages/user/my-car/my-car?id=" + id
				})
			},
			// 删除车辆
			delCarH(id, index) {
				let that = this
				uni.showModal({
					title: '提醒',
					content: '确定要删除此辆车吗？',
					confirmColor: "#B49A83",
					success(r) {
						if (r.confirm) {
							delCar({
								data: {
									id: id
								}
							}).then(res => {
								if (res.data.code == 0) {
									uni.showToast({
										title: '删除成功',
										icon: 'none'
									})
									that.list.splice(index, 1)
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
	@import "./all-car.scss"
</style>
