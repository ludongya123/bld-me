<template>
	<!-- 111111111111 首页的弹框 -->
	<view>
		<view class="modal_box" v-if="chTimeFlage" @click="closeModal"></view>
		<view class="pick_box" :class="{show: chTimeFlage}">
			<view class="pick_top">
				{{title||'选择到店时间'}}
				<image src="../../../static/home/index/icon_delete.png" class="icon_delete" @click="closeModal"></image>
			</view>
			<view class="discount_des" v-if="timeMsg.tips">{{timeMsg.tips}}</view>
			<view class="pick_content" scroll-y="true" height="688upx;">
				
				<!-- 日期选择 -->
				<view class="choose_date_box">
					<scroll-view scroll-x="true" class='choose_date_box_scroll' scroll-with-animation="true">
						<view class="scroll_item" :class="{active: currentDate == index}" v-for="(item, index) in timeMsg.times" :key="index" @click="chooseDate(index, item.date,item.dateUse,item.desc)">
							<view class="scroll_item_date">{{item.dateUse}}</view>
							<view class="scroll_item_week">{{item.desc}}</view>
						</view>
					
					</scroll-view>
				</view>
				
				<!-- 时间选择 -->
				<!-- <view class="">上午</view> -->
				<view class="choose_time_box flex-start">
					
					<!-- is_busy为0：可选，为1：不可选 -->
					
					<block  v-for="(item, index) in timeMsg.times[currentDate].times">
						<view class="time_item"  @click="chooseTime(index, item.time)" :class="{is_busy: item.is_busy == 1}" :key="index">
							<!-- 已满不可选 -->
							<view class="date-list" :class="(item.can_reserve==0 || item.is_busy==1)?'gray' :''">
								{{item.time}}<text class="no_loca" v-if="item.is_busy == 1">(已满)</text>
							</view>  
						</view>
					</block>
				</view>
			
			</view>
		</view>
	</view>
</template>


<script>
	export default {
		props: ['chTimeFlage', 'timeMsg','title'],
		data() {
			return {
				isCheck: true,
				currentDate: -1,
				currentTime: -1,
				choose: {
					chooseDateString: '',
					chooseTimeString: '',
					chooseDateUse:'',
					chooseDateDesc:''
				}
			}
		},
		watch:{
			timeMsg(v){ 
				console.log(v)
				this.currentDate = 0
				this.currentTime = -1
			}
		},
		methods: {
			closeModal() {
				this.$emit('closeDateModal');
			},
			chooseDate(index, date,dateUse,desc) {
				this.currentDate = index;
				// this.choose.chooseDateString = date;
				// this.choose.chooseDateUse = dateUse
				// this.choose.chooseDateDesc = desc
				this.currentTime = -1;
			},
			chooseTime(index, time) {
				let timesInfo = this.timeMsg.times[this.currentDate].times[index]

				if(timesInfo.can_reserve == 0 || timesInfo.is_busy == 1) return

				
				this.choose.chooseTimeString = time;
				// if(!this.choose.chooseDateString){
					this.choose.chooseDateString = this.timeMsg.times[this.currentDate].date
					this.choose.chooseDateUse = this.timeMsg.times[this.currentDate].dateUse
					this.choose.chooseDateDesc = this.timeMsg.times[this.currentDate].desc
				// }
				this.$emit('closeDateModal', this.choose);
			}
		}
	}
</script>

<style lang="scss">
	.modal_box {
		position: fixed;
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, 1);
		opacity: 0.7;
		top: 0;
		z-index: 99;
	}

	.pick_box {
		position: fixed;
		width: 100%;
		height: 900upx;
		background-color: #fff;
		bottom: -900upx;
		left: 0;
		z-index: 999;
		transition: bottom 0.3s ease;

		&.show {
			bottom: 0;
			z-index: 9999;
		}

		.pick_top {
			position: relative;
			width: 100%;
			height: 112upx;
			padding-left: 32upx;
			line-height: 112upx;
			font-size: 36upx;
			color: #283540;
			font-weight: bold;

			.icon_delete {
				position: absolute;
				width: 34upx;
				height: 34upx;
				top: 39upx;
				right: 26upx;
			}
		}

		.discount_des {
			font-size: 28upx;
			color: #B49A83;
			padding-left: 32upx;
			padding-bottom: 32upx;
		}

		.pick_content {
			height: 788upx;
			
			overflow-y: auto;
			
			
			.choose_date_box {
				
				width: 728upx;
				height: 120upx;
				background: #fff;
				overflow: hidden;
				padding-left: 32upx;
			
				.choose_date_box_scroll {
			
					width: 100%;
					height: 100%;
					display: flex;
					flex-direction: row;
					box-sizing: border-box;
					white-space: nowrap;
			
					.scroll_item {
						display: flex;
						display: inline-block;
						width: 160upx;
						height: 100upx;
						margin-right: 8upx;
						background-color: #fff;
						border: 1px solid #999;
						padding: 16upx 0;
						flex-direction: column;
						justify-content: space-around;
						text-align: center;
						font-size: 32upx;
						color: #999;
						&.active{
							background-color: #C9AD94;
							color: #fff;
							border: 1px solid #C9AD94;
						}
						.scroll_item_week{
							margin-top: 10upx;
						}
					}
				}
			}
			.choose_time_box{
				flex-wrap:wrap;
				padding: 20upx 0;
				.time_item{
					.date-list{
						color:#333;
						font-weight: bold; 
						font-size: 32upx;
						text-align: center;
					}
					
					width: 156upx;
					height: 56upx;
					text-align: center;
					line-height: 56upx; 
					margin:32upx 0 0 26upx;
					padding-top:16upx;
					&.is_busy{
						color: #ccc;
					}
					.gray{
						color:#999;
						font-weight: blod;
					}
					.no_loca{  
						font-size: 24upx;
						color: #ccc; 
					}
				}
			}
			

		}
	}
</style>
