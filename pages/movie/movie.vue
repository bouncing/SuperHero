<template>
	<view class="page">
		<!-- 视频播放 star -->
		<view class="player">
			<video
			id="myTrailer"
			:src="trailerInfo.trailer" 
			:poster="trailerInfo.poster" 
			class="movie" 
			controls></video>
		</view>
		<!-- 视频播放 end -->
		
		<!-- 影片信息 star -->
		<view class="movie-info">
			
			<navigator :url="`../cover/cover?cover=` + trailerInfo.cover">
				<image 
				:src="trailerInfo.cover" 
				class="cover"></image>
			</navigator>
			
			<view class="movie-desc">
				<view class="title">{{trailerInfo.name}}</view>
				<view class="basic-info">{{trailerInfo.basicInfo}}</view>
				<view class="basic-info">{{trailerInfo.originalName}}</view>
				<view class="basic-info">{{trailerInfo.totalTime}}</view>
				<view class="basic-info">{{trailerInfo.releaseDate}}</view>
				
				<view class="score-block">
					<view class="big-score">
						<view class="score-words">综合评分</view>
						<view class="movie-score">{{trailerInfo.score}}</view>
					</view>
					<view class="score-stars">
						
						<!-- 拿到分数才执行分数显示星星自定义组件 -->
						<block v-if="trailerInfo.score >= 0">
							<trailerStars :innerScore="trailerInfo.score" showNum="0"></trailerStars>
						</block>
						
						<view class="prise-counts">{{trailerInfo.prisedCounts}} 人点赞</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 影片信息 end -->
		
		<view class="line-wapper">
			<view class="line"></view>
		</view>
		
		<!-- 剧情介绍 start -->
		<view class="plots-block">
			<view class="plots-title">剧情介绍</view>
			<view class="plots-desc">{{trailerInfo.plotDesc}}</view>
		</view>
		<!-- 剧情介绍 end -->
		
		<!-- 演职人员 start -->
		<view class="scroll-block">
			<view class="plots-title">演职人员</view>
			
			<scroll-view scroll-x class="scroll-list">
				
				<view class="actor-wapper" v-for="(director,staffIndex) in directorArray">
					<image 
					:src="director.photo" 
					class="single-actor"
					mode="aspectFill"
					@click="lookStaffs"
					:data-staffIndex="staffIndex"></image>
					<view class="actor-name over-hide">{{director.name}}</view>
					<view class="actor-role">{{director.actName}}</view>
				</view>
				
				<view class="actor-wapper" v-for="(actor,actorIndex) in actorArray">
					<image 
					:src="actor.photo" 
					class="single-actor"
					mode="aspectFill"
					@click="lookStaffs"
					:data-staffIndex="actorIndex + directorArray.length"></image>
					<view class="actor-name over-hide">{{actor.name}}</view>
					<view class="actor-role">{{actor.actName}}</view>
				</view>

			</scroll-view>
			
		</view>
		<!-- 演职人员 end -->
		
		<!-- 剧照 start -->
		<view class="scroll-block">
			<view class="plots-title">剧照</view>
			<scroll-view scroll-x class="scroll-list">
				<image 
				v-for="(img,indexImg) in plotPicsArray"
				:src="img" 
				class="plot-image"
				mode="aspectFill"
				@click="lookMe"
				:data-imgIndex="indexImg"
				></image>
			</scroll-view>
		</view>
		<!-- 剧照 end -->
		
	</view>
</template>

<script>
	import trailerStars from "../../components/trailerStars.vue"
	
	export default {
		data() {
			return {
				trailerInfo: {},
				plotPicsArray: [],	// 剧照
				directorArray: [],	// 导演列表
				actorArray: []		// 演员列表
			}
		},
		
		// 页面初次渲染完成，获得视频上下文对象
		onReady() {
			this.videoContext = uni.createVideoContext('myTrailer')
		},
		
		onHide() {
			this.videoContext.pause()
		},
		
		onShow() {
			if (this.videoContext) {
				this.videoContext.play()
			}
		},
		
		onLoad(parms) {
			let me = this;
			let serverUrl = me.serverUrl;
			let qq = me.qq;
			
			// 获取上一个页面传入的参数
			let trailerId = parms.trailerId;
			
			// 通过api修改导航栏的属性
			uni.setNavigationBarColor({
				frontColor: "#ffffff",
				backgroundColor: "#000000"
			});
			
			// 获取预告片的详细信息
			uni.request({
				url: serverUrl + '/search/trailer/' + trailerId,
				
				// 以Form-Data方式请求
				header:{'content-type':'application/x-www-form-urlencoded'},
				data:{
					qq:qq
					},
				method: "POST",
				success: (res) => {
					// 获取真实数据之前，务必判断状态是否为200
					if (res.data.status == 200) {
						var trailerInfo = res.data.data;
						me.trailerInfo = trailerInfo;
						
						// 把剧照的字符串转换为json array
						var plotPicsArray = JSON.parse(trailerInfo.plotPics);
						me.plotPicsArray = plotPicsArray;
						
					}
				}
			});
			
			// 获取获取导演信息
			uni.request({
				url: serverUrl + '/search/staff/' + trailerId + '/1',
				
				// 以Form-Data方式请求
				header:{'content-type':'application/x-www-form-urlencoded'},
				data:{
					qq:qq
					},
				method: "POST",
				success: (res) => {
					// 获取真实数据之前，务必判断状态是否为200
					if (res.data.status == 200) {
						me.directorArray = res.data.data;						
					}
				}
			});
			
			// 获取获取演员信息
			uni.request({
				url: serverUrl + '/search/staff/' + trailerId + '/2',
				
				// 以Form-Data方式请求
				header:{'content-type':'application/x-www-form-urlencoded'},
				data:{
					qq:qq
					},
				method: "POST",
				success: (res) => {
					// 获取真实数据之前，务必判断状态是否为200
					if (res.data.status == 200) {
						me.actorArray = res.data.data;						
					}
				}
			});
		},
		
		// 小程序分享
		onShareAppMessage(res){
			var me = this;
			return {
			  title: me.trailerInfo.name,
			  path: '/pages/movie/movie?trailerId=' + me.trailerInfo.id
			}
		},
		
		// 监听导航栏按钮
		onNavigationBarButtonTap(e) {
			let index = e.index;
			let me = this
			let trailerInfo = me.trailerInfo
			let trailerId = trailerInfo.id
			let trailerName = trailerInfo.name
			let cover = trailerInfo.cover
			let poster = trailerInfo.poster
			
			console.log(cover);
			if (index == 0) {
				uni.share({
						provider: "weixin",
						scene: "WXSenceTimeline",
						type: 0,
						href: "http://www.imovietrailer.com/#/pages/movie/movie?trailerId=" + trailerId,
						title: "老神经的超英预告:《" + trailerName + "》",
						summary: "老神经的超英预告:《" + trailerName + "》",
						imageUrl: cover,
						
						success: function (res) {
								// console.log("success:" + JSON.stringify(res));
						}
				});
			}
		},
		
		methods: {
			
			lookMe(e){
				let me = this;
				let imgIndex = e.currentTarget.dataset.imgindex;
				
				uni.previewImage({
					current:me.plotPicsArray[imgIndex],
					urls:me.plotPicsArray
				})
				
			},
			
			lookStaffs(e){
				let me = this
				let staffIndex = e.currentTarget.dataset.staffindex
				
				let directorArray = me.directorArray;
				let actorArray = me.actorArray;
				let newStaffArray = []
				newStaffArray = newStaffArray.concat(directorArray).concat(actorArray)
				
				let urls = []
				for (let i = 0; i < newStaffArray.length; i++) {
					let tempPhoto = newStaffArray[i].photo
					urls.push(tempPhoto)
				}

				uni.previewImage({
					current:urls[staffIndex],
					urls:urls
				})
				
			}
		},
		components:{
			trailerStars
		}
	}
</script>

<style>
@import url("movie.css");
</style>
