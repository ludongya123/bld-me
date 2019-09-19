<template>
	<view>
		<cover-view class="shade" v-show="show" @click="hideShade"></cover-view>
		<cover-view class="pro-g flex-start" v-show="show"  >
			<block v-for="(item,index) in code" :key="index">
				<cover-view class="pro-l" @click="choosePro(item)">{{item}}</cover-view>
			</block>
		</cover-view>
	</view>
</template>

<script>
	export default {
		props:{
			show:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return{
				code:['京','津','沪','渝','冀','豫','云','辽','黑','湘','皖','鲁','新','苏','浙','赣','鄂','桂','甘','晋','蒙','陕','吉','闽','贵','粤','青','藏','川','宁','琼'],
			}
		},
		methods:{
			hideShade(){
				this.$emit('hideProCode')
			},
			choosePro(code){
				this.$emit('getPro',code)
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
	.pro-g{
		position: fixed;
		max-height: 460upx;
		background: #EFEFEF;
		width:750upx;
		z-index:10;
		bottom: 0;
		padding:20upx 20upx 0 0;
		flex-wrap:wrap;
		transition: all 1s ease-in;
		&.show{
			bottom:0;
		}
		.pro-l{
			padding:24upx 14upx;
			font-size: 32upx;
			border-radius: 12upx;
			color:#444;
			margin-bottom: 30upx;
			background: #fefefe; 
			margin-left:32upx;
		}
	}
	
</style>
