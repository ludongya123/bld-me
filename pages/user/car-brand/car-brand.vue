<template>
	<view class="wrapper">

		<view class="keys flex-between">
			<block v-for="(item,index) in keys">
				<text @click="jumpIndex(item)" :key="index">{{item}}</text>
			</block>
		</view>
		<scroll-view class="brand-list" scroll-y :scroll-into-view="curView" scroll-with-animation>
			<view class="car-brand">
				<view class="title">热门品牌</view>
				<view class="flex-start">
					<block v-for="(item,index) in hotBrandList">
						<view class="h-b-list" :key="index" @click="openBrandStyle(item.id,item.name)">
							<image :src="carIcon+item.id+'.png'" mode="aspectFill" lazy-load></image>
							<view class="car-brand-name">{{item.name}}</view>
						</view>
					</block>
				</view>
			</view>

			<block v-for="(item,key) in brandList">
				<view :key="key">
					<view class="title" :id="'car'+item.key">{{item.key}}</view>
					<block v-for="(itm,index) in item.brandList">
						<view :key="index">
							<view class="flex-start" @click="openBrandStyle(itm.id,itm.name)">
								<image :src="carIcon+itm.id+'.png'" mode="aspectFill"></image>
								<text>{{itm.name}}</text>
							</view>
							<view class="xiline"></view>
						</view>
					</block>
				</view>
			</block>
		</scroll-view>
		<car-style :brandId="brandId" :show="showBrandStyle" @hide="hideCarStyle"></car-style>
	</view>
</template>

<script>
	import {
		hotCar,
		carType,
		carIcon
	} from "../../../api/user.js"
	import carStyle from "../../../components/car-style/car-style.vue"
	import {
		mapMutations
	} from "vuex"
	export default {
		data() {
			return {
				hotBrandList: [],
				brandList: [],
				keys: [],
				carIcon: carIcon,
				curView: 'carA',
				brandId: '',
				showBrandStyle: false //显示车系款式
			}
		},
		components: {
			carStyle
		},
		onLoad() {
			uni.hideShareMenu()

			this.getCarType()
			this.getHotCat()
		},
		onReady() {

		},
		methods: {
			...mapMutations(['setCarInfo']),
			hideCarStyle() {
				this.showBrandStyle = false;
				this.brandId = ''
			},
			// 获取热门车
			getHotCat() {
				hotCar().then(r => {
					if (r.data.code == 0) {
						this.hotBrandList = r.data.result.brands
					}
				})
			},
			// 获取所有车系
			getCarType() {
				uni.showLoading({
					title: '加载中...'
				})
				carType().then(r => {
					uni.hideLoading()
					if (r.data.code == 0) {
						this.fitData(r.data.result.brands)
					}
				})
			},
			// //适配品牌数据
			fitData(data) {
				let keys = data.map((item) => {
					return item.first_letter
				})
				this.keys = Array.from(new Set(keys)).sort()
				let arr = [];
				for (let key of this.keys) {
					let obj = {}
					obj.key = key
					obj.brandList = []
					for (let i in data) {
						if (key == data[i].first_letter) {
							obj.brandList.push(data[i])
						}
					}
					arr.push(obj)
				}
				this.brandList = arr
			},
			// 滚动到指定的位置
			jumpIndex(key) {
				this.curView = 'car' + key
			},
			// 打开车系
			openBrandStyle(id, name) {
				this.setCarInfo({
					brand_name: name
				})
				this.brandId = id;
				this.showBrandStyle = true
			}
		}
	}
</script>

<style lang="scss">
	@import "./car-brand.scss"
</style>
