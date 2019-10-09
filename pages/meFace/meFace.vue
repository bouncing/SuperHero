<template>
	<view class="page page-fill">
		
		<view class="pending-wapper">
			<image id="face" :src="tempFace" class="pending-face" mode="scaleToFill"></image>
		</view>
		
		<view class="notice">
			<view class="notice-words">
				* 请从相册中选择等比宽高的图片噢~
			</view>
		</view>
		
		<view class="footer-opertor">
			<view class="opertor-words" @click="changePendingFace">
				重新选择
			</view>
			<view class="opertor-words" @click="upload">
				确认上传
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tempFace:""
			}
		},
		onLoad(params) {
			let tempFilePath = params.tempFilePath
			this.tempFace = tempFilePath
		},
		methods: {
			changePendingFace(){
				let me = this
				// 上传头像
				uni.chooseImage({
					count:1,
					sizeType:["compressed"],
					sourceType:["album"],
					success(res) {
						// console.log(res);
						// 获得临时路径
						let tempFilePath = res.tempFilePaths[0]
						me.tempFace = tempFilePath
					}
				})
			},
			
			upload(){
				let me = this
				let globalUser = me.getGlobalUser("globalUser")
				
				uni.showLoading({
					mask:true,
					title:"图片上传中..."
				})
				
				uni.uploadFile({
					url:me.serverUrl + "/user/uploadFace?userId=" + globalUser.id + '&qq=' + me.qq,
					filePath:me.tempFace,
					name:"file",
					header:{
						"headerUserId":globalUser.id,
						"headerUserToken":globalUser.userUniqueToken
						// "headerUserToken":123
					},
					success(res) {
						let resDataStr = res.data
						console.log(typeof(resDataStr))
						let resData = JSON.parse(resDataStr)
						console.log(typeof(resData))

						if(resData.status == 200){
							// 获得最新用户数据
							let userInfo = resData.data
							uni.setStorageSync("globalUser",userInfo)
							uni.navigateBack({
								delta:1
							})
						} else if (resData.status == 502 || resData.status == 500){
							uni.showToast({
								title:resData.msg,
								image:"/static/icos/error.png",
								duration:2000
							})
						}
					},
					complete() {
						uni.hideLoading()
					}
				})
			}
		}
	}
</script>

<style>
@import url("meFace.css");
</style>
