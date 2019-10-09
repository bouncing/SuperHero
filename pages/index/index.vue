<template>
	<view class="page">

		<!-- 轮播图 start -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" class="carousel">
			<swiper-item v-for="(carousel,index) in carouselList" :key="index">

					<navigator open-type="navigate" :url="'../movie/movie?trailerId=' + carousel.movieId">
						<image :src="carousel.image" mode="" class="carousel"></image>
					</navigator>

			</swiper-item>
		</swiper>
		<!-- 轮播图 end -->
		
		<!-- 热门超英 start -->
		<view class="page-block super-hot">
			<view class="hot-title-wapper">
				<image src="/static/icos/hot.png" class="hot-ico"></image>
				<view class="hot-title">
					热门超英
				</view>
			</view>
		</view>
		
		<scroll-view scroll-x="true" class="page-block hot">
			<view class="single-poster" v-for="(superhero,index) in hotSuperheroList" :key="index">
				<view class="poster-wapper">
					<navigator open-type="navigate" :url="'../movie/movie?trailerId=' + superhero.id">
						<image :src="superhero.cover" class="poster"></image>
					</navigator>
					<view class="movie-name">{{superhero.name}}</view>
					<trailerStars :innerScore="superhero.score" showNum="1"></trailerStars>
				</view>
			</view>
		</scroll-view>
		<!-- 热门超英 end -->
		
		<!-- 热门预告 start -->
		<view class="page-block super-hot">
			<view class="hot-title-wapper">
				<image src="/static/icos/interest.png" class="hot-ico"></image>
				<view class="hot-title">
					热门预告
				</view>
			</view>
		</view>
		
		<view class="hot-movies page-block">
			<video v-for="trailer in hotTrailerList" 
			:id="trailer.id"
			:data-playingindex="trailer.id"
			@play="meIsPlaying"
			:src="trailer.trailer" 
			:poster="trailer.poster" class="hot-movie-single" controls></video>
		</view>
		
		<!-- 热门预告 end -->
		
		<!-- 猜你喜欢 start -->
		<view class="page-block super-hot">
			<view class="hot-title-wapper">
				<image src="/static/icos/guess-u-like.png" class="hot-ico"></image>
				<view class="hot-title">
					猜你喜欢
				</view>
			</view>
		</view>
		
		<view class="page-block guess-u-like">
			<view class="single-like-movie" v-for="(guess,indgue) in guessULikeList" :key="indgue">
				
				<navigator open-type="navigate" :url="'../movie/movie?trailerId=' + guess.id">
					<image :src="guess.cover" class="like-movie"></image>
				</navigator>
				
				<view class="movie-desc">
					<view class="movie-title">{{guess.name}}</view>
					<trailerStars :innerScore="9.1" showNum="0"></trailerStars>
					<view class="movie-info">
						{{guess.basicInfo}}
					</view>
					<view class="movie-info">
						{{guess.releaseDate}}
					</view>
				</view>
				<view class="movie-oper" :data-indgue="indgue" @click="praiseMe">
					<image src="/static/icos/praise.png" class="praise-ico"></image>
					<view class="praise-me">点赞</view>
					<view :animation="animationDataArr[indgue]" class="praise-me animation-opacity">+1</view>
				</view>
			</view>
		</view>
		
		<!-- 猜你喜欢 end -->
		
	</view>
</template>

<script>
	// import common from "../../common/common.js";
	import helloComp from "../../components/helloComp.vue"
	import trailerStars from "../../components/trailerStars.vue"
	
	export default {
		data() {
			return {
				carouselList: [],
				hotSuperheroList:[],
				hotTrailerList:[],
				guessULikeList:[],
				
				animationData:{},
				animationDataArr:[{},{},{},{},{}]
			}
		},
		
		onHide() {
			if (this.videoContext) {
				this.videoContext.pause()
			}
		},
		
		onLoad() {
			var me = this;
			let serverUrl = me.serverUrl;
			let qq = me.qq;
			
			// #ifdef APP-PLUS || MP-WEIXIN
			// 如果是H5+或者微信小程序则创建动画
			this.animation = uni.createAnimation();
			// #endif
			
			// 预告 IOS刷新太快video定位错位，需要改为异步等1秒再调用
			// TODO cg
			
				uni.request({
				url: serverUrl + '/index/movie/hot?type=trailer&qq=' + qq, //hot接口地址
				method:"POST",
			
				success: (res) => {
					
					if(res.data.status == 200){
						let hotTrailerList = res.data.data;
						me.hotTrailerList = hotTrailerList;
					}
			
				}
			});

			uni.request({
				url: serverUrl + '/index/carousel/list?qq=' + qq, //接口地址
				method:"POST",

				success: (res) => {
					
					if(res.data.status == 200){
						let carouselList = res.data.data;
						me.carouselList = carouselList;
					}

				}
			});
			
			// hot
			uni.request({
				url: serverUrl + '/index/movie/hot?type=superhero&qq=' + qq, //hot接口地址
				method:"POST",
			
				success: (res) => {
					
					if(res.data.status == 200){
						let hotSuperheroList = res.data.data;
						me.hotSuperheroList = hotSuperheroList;
					}

				}
			});
			
			me.refresh();

		},
		
		onPullDownRefresh() {
			this.refresh();
		},
		
		onUnload() {
			this.animationData = {}
			this.animationDataArr = []
		},
		
		// onShow() {
		// 	var me = this;
		// 	let serverUrl = me.serverUrl;
		// 	let qq = me.qq;
		// },
		
		methods: {
			
			meIsPlaying(e){
				let me = this
				let trailerId = ""
				if (e){
					trailerId = e.currentTarget.dataset.playingindex
					me.videoContext = uni.createVideoContext(trailerId)
				}
				let hotTrailerList = me.hotTrailerList
				for (let i = 0; i < hotTrailerList.length; i++) {
					let tempId = hotTrailerList[i].id
					if (tempId != trailerId) {
						uni.createVideoContext(tempId).pause()
					}
				}
			},
			
			refresh(){
				var me = this;
				let serverUrl = me.serverUrl;
				let qq = me.qq;
				
				//显示loading...
				uni.showLoading({
					mask:true
				})
				
				uni.showNavigationBarLoading()
				
				// guess
				uni.request({
					url: serverUrl + '/index/guessULike?qq=' + qq, //hot接口地址
					method:"POST",
				
					success: (res) => {
						
						if(res.data.status == 200){
							let guessULikeList = res.data.data;
							me.guessULikeList = guessULikeList;
						}
				
					},
					// 完成后,success后，停止下拉刷新
					complete:()=>{
						uni.hideLoading();
						uni.stopPullDownRefresh();
						uni.hideNavigationBarLoading();
					}
				});
			},
			
			praiseMe(e){
				// #ifdef APP-PLUS || MP-WEIXIN
				// 如果是H5+或者微信小程序则动画
				
				let gIndex = e.currentTarget.dataset.indgue;
				// console.log(gIndex);
				
				this.animation.translateY(-60).opacity(1).step({duration:400})

				this.animationData = this.animation;
				this.animationDataArr[gIndex] = this.animationData.export();
				
				setTimeout(function() {
					this.animation.translateY(0).opacity(0).step({duration:0});
					
					this.animationData = this.animation;
					this.animationDataArr[gIndex] = this.animationData.export();
				}.bind(this), 500);
				// #endif
			}
		},
		
		components:{
			helloComp,
			trailerStars
		}
	}
</script>

<style>
	@import url("index.css");
</style>
