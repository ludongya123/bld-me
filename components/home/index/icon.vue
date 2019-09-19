<template>
	<view class="icons-list">
		<view class='icon-box icon-box1' v-for="(item, index) in iconData" :key="index" @click="toDetailPre(index)">
			<image class='icon-img' :src="item.image" ></image>
			<view class='icon-text' style='color: #222'>{{item.title}}</view>
		</view>
		<view style='clear: both;'></view>
	</view>
</template>

<script>
	export default {
		props: ['iconData'],
		data() {
			return {

			};
		},
		
		methods: {
			toDetailPre(i) { 
				this.$emit('toDetailPre', this.iconData[i])
			}
		}
	}
</script>

<style lang="scss">
	/* icon */
	.icons-list {
		width: 100vw;
		// height: 250upx; 
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-items: flex-start;
		position: relative;
		flex-wrap: wrap;
		background: #fff;
		// padding: 50upx 24upx;
		padding: 100upx 24upx 60upx;
	}

	.icons-ist-one {
		padding: 6upx 24upx 28upx;
	}

	/* .icon-list  */
	.icons-list .icon-box { 
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 10upx;
		z-index: 1;
		margin-top: 24upx;
		flex:1;
	}

	.icons-list .icon-box1 {
		width: 20%;
		border-radius: 10upx;
	}

	.icon-img {
		width: 136upx;
		height: 80upx;

	}

	.icon-text {
		font-size: 24upx;
		color: $base-color;
		line-height: 28upx;
		margin-top: 16upx;
	}

	.icon-bg {
		width: 100%;
		height: 182upx;
		position: absolute;
		left: 0;
		top: 0;
	}

	.icon-bg1 {
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		height: 364upx;
	}


	.icon-bg-no {
		width: 100%;
		height: 182upx;
		position: absolute;
		left: 0;
		top: 0;
	}

	.icon-bg1-no {
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		height: 364upx;
	}
</style>
