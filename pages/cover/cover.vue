<template>
	
	<view class="black">
		<image 
		:src="cover"
		class="cover"
		mode="widthFix"
		@longpress="operator"></image>
	</view>
	
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	
	export default {
		data() {
			return {
				cover:""
			}
		},
		onLoad(params) {
			let cover = params.cover
			this.cover = cover
			
			// 通过api修改导航栏的属性
			uni.setNavigationBarColor({
				frontColor: "#ffffff",
				backgroundColor: "#000000"
			});
		},
		methods: {
			operator(){
				let me = this
				
				uni.showActionSheet({
					itemList:["保存图片"],
					success:function (res) {
						// 下标为 0 则下载
						if (res.tapIndex === 0) {
							// console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
							uni.showLoading({
								title:"图片保存中..."
							})
							uni.downloadFile({
								url:me.cover,
								success:function(result){
									let tempFilePath = result.tempFilePath;

									uni.saveImageToPhotosAlbum({
										filePath:tempFilePath,
										success:function(){
											uni.showToast({
												title:"保存成功",
												duration:2000
											})
										},
										complete:function(){
											uni.hideLoading()
										}
									})
								}
							})
						}
					}
				})
			},
			openPopup(){
            this.$refs.popup.open()
        },
      closePopup(){
            this.$refs.popup.close()
        }
		},
		components:{uniPopup}
	}
</script>

<style>
.black{
	background-color: #000000;
	width: 100%;
	height: 100%;
	
	display: flex;
	flex-direction: column;
	justify-content: center;
	position: fixed;
}
.cover{
	align-self: center;
}
</style>
