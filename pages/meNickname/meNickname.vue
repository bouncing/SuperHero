<template>
	<view class="page page-fill">
		
		<form @submit="formSubmitNickname">
			
			<view class="page-block" style="margin-top: 20upx;">
				<input type="text" name="nickname" :value="globalUser.nickname" class="input" 
				placeholder="请输入昵称" placeholder-class="graywords" maxlength="10" />
			</view>

				<button type="primary" formType="submit" class="submitBtn">提交</button>

		</form>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				globalUser:{}
			}
		},
		onLoad() {
			let me = this
			let globalUser = me.getGlobalUser("globalUser")
			me.globalUser = globalUser
		},
		methods: {
			formSubmitNickname(e){
				let me = this
				let nickname = e.detail.value.nickname
				
				uni.request({
					url:me.serverUrl + "/user/modifyUserinfo?qq=" + me.qq,
					data:{
						"userId":me.globalUser.id,
						"nickname":nickname
					},
					header:{
						"headerUserId": me.globalUser.id,
						"headerUserToken": me.globalUser.userUniqueToken
					},
					method:"POST",
					success(res) {
						let resDataStr = res.data
						
						if(resDataStr.status == 200){
							// 获得最新用户数据
							let userInfo = resDataStr.data
							uni.setStorageSync("globalUser",userInfo)
							uni.navigateBack({
								delta:1
							})
						} else if (resDataStr.status == 502 || resDataStr.status == 500){
							uni.showToast({
								title:resDataStr.msg,
								image:"/static/icos/error.png",
								duration:2000
							})
						}
					}
				})
			}
		}
	}
</script>

<style>
/* 页面铺满屏幕 */
.page-fill {
	width:100%;
	height: 100%;
	position: absolute;
}

.graywords {
	color: #EAEAEA;
}

.input {
	height: 80upx;
	line-height: 80upx;
	width: 500upx;
	margin-left: 40upx;
}

.submitBtn {
	width: 95%;
	margin-top: 40upx;
}
</style>
