<template>
	<view class="page page-fill">
		
		<form @submit="formSubmitBirthday">
			
			<view class="page-block" style="margin-top: 20upx;">
				<picker mode="date" @change="dateChange">
					<view class="birthday">{{birthday}}</view>
				</picker>
			</view>
		
				<button type="primary" formType="submit" class="submitBtn">提交</button>
		
		</form>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				birthday:"",
				globalUser:""
			}
		},
		onLoad() {
			let me = this
			let globalUser = me.getGlobalUser("globalUser")
			me.globalUser = globalUser
			me.birthday = globalUser.birthday
		},
		methods: {
			dateChange(e){
				this.birthday = e.detail.value
			},
			formSubmitBirthday(){
					let me = this
					let birthday = me.birthday
					
					uni.request({
						url:me.serverUrl + "/user/modifyUserinfo?qq=" + me.qq,
						data:{
							"userId":me.globalUser.id,
							"birthday":birthday
						},
						header:{
							"headerUserId": me.globalUser.id,
							"headerUserToken": me.globalUser.userUniqueToken
						},
						method:"POST",
						success(res) {
							let resData = res.data
							
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

.birth-input {
	background-color: white;
	height: 80upx;
	line-height: 40upx;
	padding-left: 20upx;
}

.birthday {
	background-color: white;
	height: 80upx;
	padding-left: 20upx;
	padding-top: 30upx;
}

.submitBtn {
	width: 95%;
	margin-top: 40upx;
}
</style>
