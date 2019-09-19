<template>
	<view>
		<uni-nav-bar @backPage="backPage" :leftIconType="share==1?'home-l':'back-d'" title="意见反馈" backgroundColor="#283540" color="#fff"></uni-nav-bar>
		<view class="top" v-show="true">
			<view class="tip flex-start">
				<image src="/static/user/shop.png" mode=""></image>
				<text>反馈门店</text>
			</view>
			<view class="address flex-between" @click="getStoreList">
				<view class="addr-left">
					<view class="addr-title">{{shopDetail.name}}</view>
					<view class="addr-detail flex-start">
						<text class="addr-desc">{{shopDetail.address}}</text>
						<view class="distance" v-if="shopDetail.distance">
							<image src="/static/user/local.png" mode=""></image>
							<text>{{shopDetail.distance>=1?shopDetail.distance+'km':(shopDetail.distance*1000)+'m'}}</text>
						</view>
					</view>
				</view>
				<view class="arrow-icon">
					<image class="icon" src="/static/user/a-l-d.png" mode="" v-if="fid==''"></image>
				</view>
				
			</view>
		</view>
		<view class="gap"></view>
		<view class="botm">
			<view class="tip">意见反馈类型</view>
			<view class="flex-around type-icon">
				<block v-for="(item,index) in  iconArr" :key="index">
					<image :key="index" :src="'/static/user/'+(item.index == typeIcon ?item.activeIcon: item.icon)+'.png'" mode=""
					 @click="chooseIcon(item.index)"></image>
					<!-- <image v-if="item.index==type" :src="'/static/user/'+ item.activeIcon+'.png'" mode="" @click="chooseIcon(item.index)"></image> -->
				</block>
			</view>
			<view class="textarea">
				<textarea :show-confirm-bar="false" confirm-type="完成" v-show="!storeFlag" v-model="textarea" maxlength="400" placeholder="您的意见对我们很重要，我们会不断努力做得更好" placeholder-style="color:#bbb" />
				<view class="count">{{textarea.length}}/400</view>
			</view>
			<view class="add-img-list flex-start">
				<view class="img" v-for="(item,idx) in img" :key="idx">
					<image class="content" :src="imgHost+item" mode="aspectFill"></image>
					<image class="close-icon" src="/static/user/close.png" mode="" @click="delImg(idx)"></image>
				</view>

				<view class="img" v-if="img.length<5" @click="chooseImg">
					<image class="content" src="/static/user/upload-icon.png" mode=""></image>
				</view>
			</view>  
		</view>
		<view class="submit"  @click="submit" :class="typeIcon!='' && textarea!='' ? 'active':''">提交</view>
		<YYPickStore @checkStore="checkStore" tag="反馈" :storeFlag="storeFlag" :storeList="storeList"></YYPickStore>
	</view>
</template>

<script>
	import { suggestDetail, shopDetail ,subSuggest,oss} from "../../../api/user.js"
	import { storeList  } from '../../../api/home/index.js'
	import YYPickStore from '../../../components/home/baoyang/yuyuePickStore.vue'
	import {mapGetters,mapMutations} from "vuex"
	export default {
		data(){
			return {
				sid:'',// 门店id
				fid:'', // 反馈意见的id
				textarea:'', // 反馈内容
				typeIcon:'', // 反馈类型
				iconArr:[
					{icon:'ts',activeIcon:'ts1',index:1},
					{icon:'tcc',activeIcon:'tcc1',index:2},
					{icon:'fk',activeIcon:'fk1',index:3},
					{icon:'qt',activeIcon:'qt1',index:4}
				],
				imgHost:'',
				img:[],
				storeFlag:false,
				storeList:[],
				shopDetail:{},
				share:0
			}
		},
		components:{
			YYPickStore 
		},
		onLoad(opts) {
			console.log(opts)
			this.fid = opts.fid ||''
			this.sid = opts.sss_id ||''
			this.share = opts.share || '0'
			this.getSuggestDetail()
			this.getShopDetail() 
		},
		onShow() {
			this.$hasToken().then(res=>{ 
				this.getShopDetail() 
			})
		},
		onShareAppMessage(res) {
			return {
			  title: '意见反馈',
			  path: '/pages/user/submit-suggest/submit-suggest?sss_id='+this.sid+'&share=1'
			}
		},
		computed:{
			...mapGetters(['getIsLocation'])
		},
		watch:{
			getIsLocation(v){
				if(v) {
					this.$hasToken().then(res=>{ 
						this.getShopDetail() 
					}) 
				}
			}
		},
		methods:{
			...mapMutations(['setIndexStoreId']),
			backPage(){ 
				if(this.share == 1) {
					this.setIndexStoreId(this.sid)
					uni.switchTab({
						url:'/pages/home/home'
					})
				} else {
					uni.navigateBack({
						
					})
				}
			},
			// 获取反馈的详情
			getSuggestDetail(){
				if(this.fid == '') return
				suggestDetail({
					data:{
						feedback_id:this.fid
					}
				}).then(res=>{
					if(res.data.code == 0) {
						let {type,content,images,store_id} = res.data.result
						this.sid = store_id
						this.typeIcon = type
						this.textarea = content
						let imgArr = images!='' && images ? images.split(','):[]
						if(imgArr.length != 0) {
							this.imgHost = imgArr[0].split('/')[0] + '//'+imgArr[0].split('/')[2]
							for(let i in imgArr) {
								this.img.push(`/${imgArr[i].split('/')[3]}/${imgArr[i].split('/')[4]}`)
							}
						} 
						this.getShopDetail(store_id)
					}
				})
			},
			// 获取店面详情
			getShopDetail(id){
				if(this.sid == '') return 
				shopDetail({
					data:{
						id:this.sid
					}
				}).then(res=>{
					if(res.data.code == 0) {
						res.data.result.distance = res.data.result.distance > 0 ? (res.data.result.distance / 1000).toFixed(2) : ''
						this.shopDetail = res.data.result
					}
				})
			},
			// 获取4s点列表
			getStoreList() {
				if(this.fid != '') return
				if (this.storeList.length != 0) {
					this.storeFlag = true;
					return;
				}
				this.storeFlag = true;
				storeList({
					data: {
						page_no: '1',
						page_size: '1000'
					}
				}).then(res => { 
					if (res.data.code == 0) {
						let list = res.data.result.cities
						for(let i in list) {
							for (let j in list[i].stores){
								list[i].stores[j].distance = list[i].stores[j].distance > 0 ? (list[i].stores[j].distance / 1000).toFixed(2) : ''
							}
						}
						this.storeList = list;
					}
				})
			},
			// 选择4s店
			checkStore(data=null){
				this.storeFlag = false
				if(data != 'close') {
					this.shopDetail = data
					this.sid = data.id 
				} 
			},
			chooseImg(){
				let that = this

				uni.chooseImage({
					count:5 - this.img.length, 
					success(data){ 
						let imgs = data.tempFilePaths
						uni.showLoading({
							title:'上传中...',
							mask:true
						})
						oss({
							data:{
								bussiness_type:'suggestion'
							}
						}).then(res=>{
							uni.hideLoading()
							if(res.data.code == 0) { 
								let ossObj = res.data.result
								that.imgHost = ossObj.host
								for(let i in imgs){
									setTimeout(()=>{
										that.uploadImg(imgs[i],ossObj)
									},20) 
								}
							}
						})
					}
				})
			},
			uploadImg(imgsrc,obj){
				const index = imgsrc.lastIndexOf("\.");
				const imgExtension = imgsrc.substring(index + 1, imgsrc.length);
				const imgPath = `${obj.dir}${new Date().getTime()}.${imgExtension}`;
				let that = this;
				uni.showLoading({
					title:"上传中...",
					mask:true
				})
				uni.uploadFile({
					url: obj.host, 
					filePath: imgsrc,
					name: 'file',
					formData: {
						OSSAccessKeyId:obj.access_id, 
						policy:obj.policy,
						signature:obj.signature,
						key:imgPath,
						success_action_status:200 
					}, 
					complete(res) {
						uni.hideLoading()
						if(res.statusCode == 200) {
							 that.img.push('/'+imgPath)
						} 
					}
				});
			},
			// 提交 、、编辑
			submit(){ 
				if(uni.getStorageSync('isMobile') != 1) {
					uni.showModal({
						title:'提醒',
						content:'你还没有登录，请先登录',
						confirmColor:"#B49A83",
						success(res) {
							if(res.confirm) {
								uni.navigateTo({
									url:'/pages/login/login'
								})
							}
						}
					}) 
					return
				}
				if(this.typeIcon == '') {
					uni.showToast({
						title:'请选择反馈类型',
						icon:'none'
					})
					return 
				}
				if(this.textarea == '') {
					uni.showToast({
						title:'请输入反馈内容',
						icon:'none'
					})
					return 
				}
				uni.showLoading({
					title:'提交中...',
					mask:true
				})
				subSuggest({
					data:{
						user_feedback:this.textarea,
						feedback_id:this.fid,
						feedback_type:this.typeIcon,
						store_id:this.sid,
						store_name:this.shopDetail.name,
						images:this.img.join(',')
					}
				}).then(res=>{
					uni.hideLoading()
					if(res.data.code == 0) { 
						setTimeout(()=>{
							if(this.fid == '') {
								uni.redirectTo({
									url:`/pages/user/success-state/success-state?title=意见反馈`
								})
							} else {
								wx.redirectTo({
								  url: '/pages/user/my-suggest/my-suggest'
								})
							} 
						},200)
					}
				})
			},
			chooseIcon(i){
				if(i == this.typeIcon) return 
				this.typeIcon = i
			},
			delImg(i){
				this.img.splice(i,1)
			}
		}
	}
</script>

<style lang="scss">
	@import "./submit-suggest.scss"
</style>
