<template>
	<view>
		<map class="map" id="myMap1" :latitude="markers[0].latitude" :longitude="markers[0].longitude" :polyline="polyline"
		 :markers="markers" @markertap="markTap" scale="15" show-location>
			<cover-view class="toast" :class="show?'show':''">最新更新：{{time}}</cover-view>

		</map>
	</view>
</template>


<script>
	import {
		getLocationName
	} from '../../../util/util.js'
	import {
		obdLocation
	} from "../../../api/user.js"
	import {bd09togcj02,format}  from "../../../util/util.js"
	export default {
		data() {
			return {
				time:'', // 更新的时间
				timer:null, // 定时器
				carId: '', // 车 id
				markers: [{
					iconPath: "../../../static/location.png",
					id: 1,
					latitude: 30.26968,
					longitude: 120.170073,
					width: 30, 
					height: 30,
					callout: {
						content: '',
						display: 'CLICK',
						padding: 10,
						borderRadius: 4,
						fontSize: 14
					}
				}],
				upDate:'',
				show: false,
				polyline: [{
					points:[ ],
					color:"#2164CD",
					width: 8, 
					arrowLine:true 
				}]
			}
		},
		onLoad(opts) {
			this.carId = opts.id
			this.getobdLocation()
			this.timer = setInterval(()=>{  
				this.getobdLocation()
			},30000)

		},
		onReady() {
			uni.hideShareMenu()  
		},
		onUnload() {
			clearInterval(this.timer)
			this.timer = null
		},
		methods: {
			getobdLocation() {
				obdLocation({
					data: {
						car_id: this.carId,
						coordinate_type: "gcj02"
					}
				}).then(res => {
					if (res.data.code == 0) {
						this.show = true;
						setTimeout(() => {
							this.show = false
						}, 2400)
						let {
							last_track_lon,
							last_track_lat,
							last_track_date,
							last_track_speed
						} = res.data.result.device_gps
						last_track_lon = last_track_lon || ''
						last_track_lat = last_track_lat || ''
						if(last_track_lon !='' && last_track_lat != ''){
							let coords = bd09togcj02(last_track_lon,last_track_lat) 
							let obj = {latitude: coords[1], longitude: coords[0]};
							let H = new Date(last_track_date).getHours()<10 ? "0" + new Date(last_track_date).getHours():new Date(last_track_date).getHours();
							let M = new Date(last_track_date).getMinutes()<10 ? "0" + new Date(last_track_date).getMinutes():new Date(last_track_date).getMinutes();
							console.log( last_track_date.substring(5,10))
							if(last_track_date.substring(0,10)  == format(new Date().getTime(),'day')) {
								this.time = `今天 ${H}:${M}`
							} else {
								this.time = `${ Number(new Date(last_track_date).getMonth())  + 1}月${new Date(last_track_date).getDate()}日 ${H}:${M}`
							}
							
							this.markers[0].latitude = coords[1]
							this.markers[0].longitude = coords[0] 
							this.polyline[0].points.push(obj)
							getLocationName(obj).then(addr=>{
								if(addr.status === 0){
									this.markers[0].callout.content = `车速：${last_track_speed}km/h \n\n地址：${addr.result.address}`
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
	@import "./car-location.scss"
</style>
