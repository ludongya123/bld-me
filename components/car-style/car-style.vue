<template>
	<view >
		<view v-show="show" class="shade" @click="hideShade"></view>
		<view class="list-content"   :class="show?'show':''">
			<block  v-for="(item ,index) in list">
				<view class="list-item" :key="index">
					<view class="title">{{item.item_name}}</view>
					<view class="type-name" v-for="(itm,i) in item.series" :key="i" @click="openVehicleType(itm.id,itm.name)">{{itm.name}}</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	import {brandStyle} from "../../api/user.js"
	import {mapMutations} from "vuex"
	export default {
		props:{
			brandId:{
				type:String,
				default:''
			},
			show:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return{
				list:[]
			}
		},
		watch:{
			brandId(){
				this.getBrandStyle()
			}
		},
		methods:{
			...mapMutations(['setCarInfo']),
			hideShade(){
				this.$emit('hide')
			},
			getBrandStyle(){
				if(this.brandId == '') { return } 
				brandStyle({ 
					data:{
						brand_id:this.brandId
					}
				}).then(r=>{
					if(r.data.code == 0){ 
						this.list = r.data.result.items
						if(this.list.length == 0) {
							uni.showToast({
								title:"没有相关车辆信息",
								icon:'none'
							})
						}
					}
				})
			},
			// 打开车型的价格
			openVehicleType(id,name){
				this.setCarInfo({series_name:name})
				uni.navigateTo({
					url:'/pages/user/car-series-price/car-series-price?id='+id
				})
			}
		}
	}
</script>

<style lang="scss">
	.shade{
		width:750upx;
		height: 100vh;
		background: rgba(0,0,0,0.5);
		position: fixed;
		top:0;
		left:0; 
		z-index:8;
	}
	.list-content{
		width:550upx;
		height: 100vh;
		position: fixed;
		right: -550upx;
		z-index: 10;
		background: #fff;
		top:0;
		overflow-y: scroll;
		transition: right 0.3s ease;
		&.show{
			right: 0; 
		}
		.type-name{
			padding: 30upx 40upx;
		}
	}
</style>
