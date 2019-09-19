<template>
	<view class="flex-start">

		<view class="year-type flex-start">
			<block v-for="(item ,index) in yearList" >
				<view class="y-list" :key="index"  @click="activeHigh(index)" :class="item.active?'active':''">
					{{item.year}}
					<text></text>
				</view>
			</block>
		</view>

		<view class="series-detail  flex-start">
			<view class="s-list flex-between" v-for="(item ,index) in seriesDetail" :key="index" @click="chooseCarInfo(item)">
				<text>{{item.name}}</text> <text>{{item.guide_price}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		carVehicleType
	} from "../../../api/user.js"
	import {
		mapMutations,
		mapGetters
	} from "vuex"
	export default {
		data() {
			return {
				yearList: [],
				seriesDetail: []
			}
		},
		onLoad(opt) {
			uni.hideShareMenu() 
			
			this.getCarTypeDetail(opt.id)
		},
		computed: {
			...mapGetters(['getCarInfo'])
		},
		methods: {
			...mapMutations(['setCarInfo']),
			// 获取车型详情
			getCarTypeDetail(id) {
				carVehicleType({ 
					data: {
						series_id: id
					}
				}).then(r => {
					if (r.data.code == 0) {
						let list = r.data.result.years;
						for (let i in list) {
							if (i == 0) {
								list[i].active = true
							} else {
								list[i].active = false
							}
						}
						this.yearList = list
						this.getData(0)
					}
				})

			},
			getData(i) {
				this.seriesDetail = this.yearList[i].types
			},
			activeHigh(i) {
				let y = this.yearList;
				for (let k in y) {
					if (i == k) {
						y[k].active = true
					} else {
						y[k].active = false
					}
				}
				this.year = y
				this.getData(i)
			},
			// 选择车型
			chooseCarInfo(obj) {
				let carInfo = {
					 vehicle_type_id:obj.id,
					 vehicle_type_name:obj.name
				}
				this.setCarInfo(carInfo)

				uni.navigateBack({
					delta: 2
				}) 
			}
		}
	}
</script>

<style lang="scss">
	@import "./car-series-price.scss"
</style>
