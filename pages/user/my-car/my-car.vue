<template>
	<view class="wrapper">
		<view class="header">
			<view class="bg"> </view>
			<view class="bg bg1"> </view>
			<view class="swiper-container">
				<swiper previous-margin="14px" next-margin="14px" class="swiper" @change="changeSwiper" :current="currIndex"
				 :indicator-dots="false" :interval="3000" :duration="1000" indicator-active-color="#2A3440">
					<swiper-item v-for="(item,index) in carList" :key="index">
						<view class="swiper-item" :key="index">
							<view class="car-info flex-start" @click="openEditCar(item.id,item.is_ico,item.car_no,item.brand_id)">
								<image class="img" :src="carIcon+item.brand_id+'.png'" mode=""></image>
								<view class="car-detail">
									<view class="flex-between car-name">
										<view class="car-code flex-start">
											<text>{{item.car_no || '暂无车牌'}}</text>
											<image v-show="item.is_ico==1" src="/static/user/v.png" mode=""></image>
										</view>
										<view class="edit flex-end">
											<image class="icon" src="/static/user/edit.png" mode=""></image>
											<text>编辑</text>
										</view>
									</view>
									<view class="car-subname">
										{{item.series_name}} {{item.vehicle_type_name}}
									</view>
									<view class="car-mileage">
										行驶里程：{{item.mileage ?item.mileage+'km':'--'}}
									</view>
								</view>
							</view>
							<view class="xiline"> </view>
							<view class="flex-between handel-area">
								<view v-if="item.car_no" class="set-default flex-start" @click="setDefaultCarHandel(item.id,index)">
									<image class="icon" v-if="item.is_default==1" src="/static/user/secd.png" mode=""></image>
									<image class="icon" v-if="item.is_default!=1" src="/static/user/circle.png" mode=""></image>
									<text>{{item.is_default==1?'默认车辆':'设为默认车辆'}}</text>
								</view>
								<view class="tip" v-if="!item.car_no && item.is_obd!=1 && item.is_ico==1"> 请完善车辆信息</view>
								<view v-else></view>
								<view class="del-car flex-start" @click="delCarHandel(item.id,index)" :data-id="item.id">
									<block v-if="item.is_obd==1 ">
										<image class="icon" src="/static/user/gj.png" mode=""></image>
										<text class="del-text">爱车管家</text>
									</block>
									<block v-if="item.is_obd!=1 && item.is_ico!=1">
										<image class="icon" src="/static/user/del.png" mode=""></image>
										<text class="del-text">删除车辆</text>
									</block>
								</view>
							</view>
						</view>
					</swiper-item>
					<swiper-item v-if="carId==''">
						<view class="swiper-item add" @click="openEditMore()">
							<image class="add-icon" v-if="totalCar<5" src="/static/user/add-car.png" mode=""></image>
							<image class="add-icon" v-if="totalCar>=5" src="/static/user/more-car.png" mode=""></image>
							<view class="add-tip" v-if="totalCar<5"> 点击添加车辆 </view>
							<view class="add-tip" v-if="totalCar>=5"> 点击查看更多车辆 </view>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<view class="remind">
			<view class="title">
				信息提醒
			</view>
			<view class="xiline"></view>
			<view class="menu-list">
				<view class="flex-start">
					<image class="icon" src="/static/user/lc.png" mode=""></image>
					<text class="menu-title">下次保养里程（km）</text>
					<text class="menu-value">{{afterSaleINfo.car_info.next_maintain_mileage? afterSaleINfo.car_info.next_maintain_mileage/ 1000 : '--'}}</text>
				</view>
				<view class="flex-start">
					<image class="icon" src="/static/user/cx.png" mode=""></image>
					<text class="menu-title">保险到期时间</text>
					<text class="menu-value">{{afterSaleINfo.car_info.insurance_expiration_time || '--'}}</text>
				</view>
				<view class="flex-start">
					<image class="icon" src="/static/user/nj.png" mode=""></image>
					<text class="menu-title">年检到期时间</text>
					<text class="menu-value">{{afterSaleINfo.car_info.inspection_expiration_time || '--'}}</text>
				</view>
			</view>
		</view>
		<view class="gap"></view>
		<view class="service-recode">
			<view class="title">售后服务记录</view>
			<view class="xiline"></view>
			<view class="s-group">
				<view class="nodata" v-if="afterSaleINfo.records.length==0">没有服务记录~</view>
				<block v-for="(item,index) in afterSaleINfo.records" :key="index">
					<view class="s-item flex-between" :key="index" @click="openPage('sell-detail' ,item.id)">
						<view class="s-item-l">
							<view class="flex-start"> <text>工单编号：</text><text class="content">{{item.work_order}}</text></view>
							<view class="flex-start"> <text>服务时间：</text><text class="content">{{item.time}}</text></view>
							<view class="flex-start"> <text>服务门店：</text><text class="content">{{item.store_name}}</text></view>
							<view class="flex-start"> <text>服务顾问：</text><text class="content">{{item.adviser}}</text></view>
						</view>
						<view class="s-item-r">
							<image class="icon" src="/static/user/a-l-d.png" mode=""></image>
						</view>
					</view>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		userCar,
		carIcon,
		afterSale,
		delCar,
		setDefaultCar,
		singleCar
	} from "../../../api/user.js"
	export default {
		data() {
			return {
				carId: '', //从我的
				carIcon: carIcon,
				totalCar: 0,
				carList: [],
				afterSaleINfo: {
					car_info: {},
					records: []
				},
				currIndex: 0, // 当前的索引
				currCarId: '' // 当前的id
			}
		},
		onLoad(opts) {
			uni.hideShareMenu()
			this.carId = opts.id || ''
		},
		onShow() {
			this.carList = []
			this.totalCar = 0
			this.currIndex = 0
			this.afterSaleINfo.records = []
			this.afterSaleINfo.car_info = {}
			if (this.carId == '') {
				this.getUserCar()
			} else {
				this.getSigleCar(this.carId)
			}
		},
		methods: {
			// 获取车辆
			getUserCar() {
				uni.showLoading({
					title: '加载中...'
				})
				userCar({
					data: {
						page_no: '1',
						page_size: '5'
					}
				}).then(res => {
					uni.hideLoading()
					if (res.data.code == 0) {
						let { record_count, user_cars } = res.data.result
						this.totalCar = record_count;
						this.carList = user_cars;
						if (user_cars.length != 0) {
							this.getAfterSale(this.carList[this.currIndex].id)
						}
					}
				})
			},
			// 获取单个车辆 
			getSigleCar() {
				uni.showLoading({
					title: '加载中...'
				})
				singleCar({
					data: {
						id: this.carId
					}
				}).then(res => {
					uni.hideLoading()
					if (res.data.code == 0) {
						this.carList = [res.data.result.user_car]
						this.getAfterSale(res.data.result.user_car.id)
					}
				})
			},
			// 改变swiper
			changeSwiper(e) {
				let currIndex = e.detail.current
				if (currIndex == this.carList.length) {
					this.afterSaleINfo.records = []
					this.afterSaleINfo.car_info = {}
					return
				}
				this.currIndex = currIndex
				this.getAfterSale(this.carList[this.currIndex].id)
			},
			// 获取售后服务记录
			getAfterSale(id) {
				uni.showLoading({
					title: '处理中...'
				})
				afterSale({
					data: {
						id: id
					}
				}).then(res => {
					uni.hideLoading()
					if (res.data.code == 0) {
						this.afterSaleINfo = res.data.result
					}
				})
			},
			// 设置默认车辆
			setDefaultCarHandel(id, index) {
				if (this.carList[index].is_default == 1) {
					return
				}
				let that = this;
				setDefaultCar({
					data: {
						id: id
					}
				}).then(res => {
					if (res.data.code == 0) {
						uni.showToast({
							title: "设置成功",
							icon: "none"
						})
						that.currIndex = 0
						that.getUserCar()
					}
				})
			},
			// 删除车辆
			delCarHandel(id, index) {
				if (this.carList[index].is_obd == 1) {
					this.$isNotionObd().then(()=>{
						uni.navigateTo({
							url: "/pages/user/car-butler/car-butler?carId=" + id
						})
					}) 
				}
				if (this.carList[index].is_obd != 1 && this.carList[index].is_ico != 1) {
					let that = this;
					uni.showModal({
						title: '删除提醒',
						content: "确定要删除此此辆车吗？",
						confirmColor: '#B87252',
						success(r) {
							if (r.confirm) {
								delCar({
									data: {
										id: id
									}
								}).then(res => {
									if (res.data.code == 0) {
										uni.showToast({
											title: "删除成功",
											icon: "none"
										})
										that.currIndex = 0
										that.getUserCar()
									}
								})
							}
						}
					})
				}
			},
			openEditCar(id, isIco,carId,BrandId) {
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
			// 打开添加车辆或者所有车辆
			openEditMore() {
				uni.navigateTo({
					url: `/pages/user/${this.totalCar >= 5 ? 'all-car' : 'add-car'}/${this.totalCar >= 5 ? 'all-car' : 'add-car'}`
				})
			},
			// 打开服务记录详情
			openPage(p, id) {
				uni.navigateTo({
					url: `/pages/user/${p}/${p}?id=${id}`
				})
			}
		}
	}
</script>

<style lang="scss">
	@import './my-car.scss';
</style>
