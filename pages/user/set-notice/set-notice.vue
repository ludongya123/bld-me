<template>
	<view class="wrapper">
		<block v-for="(item,index) in setList" :key="index">
			<view class="flex-start">
				<text>{{item.name}}</text>
				<switch @change="changeSwitch(item.id,index)" :checked="item.checked" color="#C9AD94" />
			</view>
			<view class="xiline" v-show="index+1!=setList.length"></view>
		</block>
	</view>
</template>

<script>
	import {noticeSetting,changeNoticeSetting} from "../../../api/user.js"
	export default {
		data() {
			return {
				id:'',//车id
				setList: [{
						name: '车辆启动提醒',
						checked: false,
						id: '1'
					},
					{
						name: '车辆拖吊提醒',
						checked: false,
						id: '2'
					},
					{
						name: '车辆侧翻提醒',
						checked: false,
						id: '3'
					},
					{
						name: '车辆超速提醒',
						checked: false,
						id: '4'
					},
					{
						name: '车辆拆除报警',
						checked: false,
						id: '5'
					},
					{
						name: '电瓶低压报警',
						checked: false,
						id: '6'
					},
					{
						name: '水温过高提醒',
						checked: false,
						id: '7'
					}
				]
			}
		},
		onLoad(opts) {
			uni.hideShareMenu() 
			this.id = opts.carId
			this.getCloseObd()
		},
		methods:{
			getCloseObd(){
				uni.showLoading()
				noticeSetting({
					data:{
						car_id:this.id
					}
				}).then(res=>{
					uni.hideLoading()
					if(res.data.code == 0) {
						let list = res.data.result.error_list
						let idArr = list.map(item=>{
							return item.obd_error_id
						})  
						let setList = this.setList
						for(let i in setList) {
							if(idArr.indexOf(setList[i].id) >= 0){
								setList[i].checked = false
							} else {
								setList[i].checked = true
							}
						}
						this.setList = setList
					}
				})
			},
			changeSwitch(oid,index){
				changeNoticeSetting({
					data:{
						car_id:this.id,
						state:this.setList[index].checked?1:0,
						obd_error_id:oid
					}
				}).then(res=>{
					if(res.data.code == 0) {
						uni.showToast({
							title:"修改成功",
							icon:"none"
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "./set-notice.scss"
</style>
