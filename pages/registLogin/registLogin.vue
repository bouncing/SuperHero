<template>
	<view class="body">
		
		<form @submit="formSubmit">
			<view class="face-wapper">
				<image src="../../static/icos/default-face.png" class="face"></image>
			</view>
			
			<view class="info-wapper">
				<label class="words-lbl">账号</label>
				<input name="username" type="text" value="" class="input" placeholder="请输入用户名" placeholder-class="graywords"/>
			</view>
			
			<view class="info-wapper" style="margin-top: 40upx;">
				<label class="words-lbl">密码</label>
				<input name="password" type="text" value="" password="true" class="input" placeholder="请输入密码" placeholder-class="graywords"/>
			</view>
			
			<button type="primary" form-type="submit" style="margin-top: 60upx;width: 90%;">注册/登录</button>
		</form>
		
		<!-- 第三方登录H5不支持，所以隐藏掉 -->
		<!-- #ifndef H5 -->
			<view class="third-wapper">
				
				<view class="third-line">
					<view class="single-line">
						<view class="line"></view>
					</view>
					
					<view class="third-words">第三方账号登录</view>
					
					<view class="single-line">
						<view class="line"></view>
					</view>
				</view>
				
				<view class="third-icos-wapper">
					<!-- 5+app 用qq/微信/微博 登录 小程序用微信小程序登录 h5不支持 -->
					<!-- #ifdef APP-PLUS -->
						<image src="../../static/icos/weixin.png" data-logintype="weixin" @click="appOAuthLogin" class="third-ico"></image>
						<image src="../../static/icos/QQ.png" data-logintype="qq" @click="appOAuthLogin" class="third-ico" style="margin-left: 80upx;"></image>
						<image src="../../static/icos/weibo.png" data-logintype="sinaweibo" @click="appOAuthLogin" class="third-ico" style="margin-left: 80upx;"></image>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
						<button open-type='getUserInfo' @getuserinfo="wxLogin" class="third-btn-ico">
						</button>
					<!-- #endif -->
				</view>
			</view>
		<!-- #endif -->

	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			appOAuthLogin(e){
				let me = this
				// 获取用户登录类型
				let logintype = e.currentTarget.dataset.logintype
				
				// 授权登录
				uni.login({
					provider:logintype,
					success(loginRes) {
						
						// 授权登录成功，获取用户信息
						uni.getUserInfo({
							provider:logintype,
							success(info) {
								// console.log(JSON.stringify(info));
								let userInfo = info.userInfo
								
								let face = ""
								let nickname = ""
								let openIdOrUid = ""
								
								// 根据登录类型不同，获取具体用户信用
								if (logintype == "weixin"){
									face = userInfo.avatarUrl
									nickname = userInfo.nickName
									openIdOrUid = openId
								} else if (logintype == "qq"){
									face = userInfo.figureurl_qq_2
									nickname = userInfo.nickname
									openIdOrUid = openId
								} else if (logintype == "sinaweibo"){
									face = userInfo.avatar_large
									nickname = userInfo.nickname
									openIdOrUid = id
								}
								
								// 调用开发者后台，执行一键注册或登录
								uni.request({
									url:me.serverUrl + "/appUnionLogin/" + {loginType},
									data:{
										"face":face,
										"nickname":nickname,
										"openIdOrUid":openIdOrUid
									},
									method:"POST",
									success(result) {
										if(result.data.status == 200){
											let userInfo = result.data.data
											
											// 保存用户信息到全局缓存中
											uni.setStorageSync("globalUser",userInfo)
											// 切换页面跳转,使用 tab (页面底部导航)切换的 API
											uni.switchTab({
												url:"/pages/me/me"
											})
										}
									}
								})
								
							}
						})
						
					}
				})
			},
			
			wxLogin(e){
				let me = this
				// console.log(e);
				
				// 通过小程序开放接口 getUserInfo，获得微信用户基本信息
				let userInfo = e.detail.userInfo
				
				// 实现微信登录
				uni.login({
					provider:"weixin",
					success(loginResult) {
						// console.log(loginResult);
						// 获得微信登录的 code 授权码
						let code = loginResult.code
						
						uni.request({
							url:me.serverUrl + "/mpWXlogin/" + code,
							data:{
								"avatarUrl":userInfo.avatarUrl,
								"nickName":userInfo.nickName,
								"qq":me.qq
								// "whichMP":1
							},
							method:"POST",
							success(userResult) {
								// console.log(userResult);
								let userInfo = userResult.data.data
								// 保存用户信息到全局缓存中
								uni.setStorageSync("globalUser",userInfo)
								// 切换页面跳转,使用 tab (页面底部导航)切换的 API
								uni.switchTab({
									url:"/pages/me/me"
								})
							}
						})
					}
				})
			},
			
			formSubmit(e){
				let me = this
				let qq = me.qq
				
				// 拿到form里的数据
				let username = e.detail.value.username
				let password = e.detail.value.password
				// console.log(username,password);
				
				// 发起注册登录请求
				let serverUrl = me.serverUrl
				uni.request({
					url:serverUrl + '/user/registOrLogin?qq='+ qq,

					data:{
						"username":username,
						"password":password,

					},
					method:"POST",
					success: (res) => {
						if (res.data.status == 200) {
							let userInfo = res.data.data
							// console.log(userInfo);
							// 保存用户信息到全局缓存中
							uni.setStorageSync("globalUser",userInfo)
							// 切换页面跳转,使用 tab (页面底部导航)切换的 API
							uni.switchTab({
								url:"/pages/me/me"
							})
						} else if (res.data.status == 500){
							uni.showToast({
								title:res.data.msg,
								duration:2000,
								image:"/static/icos/error.png"
							})
						}
					}
				})
				
			}
		}
	}
</script>

<style>
@import url("registLogin.css");
</style>
