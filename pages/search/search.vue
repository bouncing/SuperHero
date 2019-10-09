<template>
	<view class="page">
		<view class="search-block">
			<view class="search-ico-wapper">
				<image src="/static/icos/search.png" class="search-ico"></image>
			</view>
			<input confirm-type="search" value="" placeholder="搜索预告" maxlength="10" class="search-text"  @confirm="searchMe" />
		</view>
		
		<view class="movie-list page-block">
			
			<view class="movie-wapper" v-for="(trailer,index) in trailerList" :key="index">				
			<image :src="trailer.cover"
							:data-trailerId="trailer.id"
							@click="showTrailer"
							class="poster"></image>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				trailerList:[],
				keywords:"",		// 搜索关键字
				page:1,					// 当前页
				totalPages:1		// 总页数
			}
		},
		onLoad() {
			var me = this;
			let serverUrl = me.serverUrl;
			let qq = me.qq;
			
			//显示loading...
			uni.showLoading({
				mask:true,
				title:"正在读取超英列表，请稍等..."
			})
			
			uni.showNavigationBarLoading()
			
			// guess
			uni.request({
				url: serverUrl + '/search/list?qq=' + qq + '&keywords=&page=6&pageSize=9', //hot接口地址
				method:"POST",
			
				success: (res) => {
					
					if(res.data.status == 200){
						let trailerList = res.data.data.rows;
						me.trailerList = trailerList;
					}
			
				},
				// 完成后,success后，停止下拉刷新
				complete:()=>{
					uni.hideLoading();
					uni.hideNavigationBarLoading();
				}
			});
		},
		onReachBottom() {
			var me = this;
			let serverUrl = me.serverUrl;
			let qq = me.qq;
			
			let page = me.page + 1;	// 查询下一页
			let keywords = me.keywords;
			let totalPages = me.totalPages;
			
			// 当前页 === 总页数 ，不分页
			if(page > totalPages){
				return
			}
			
			me.pagedTrailerList(keywords,page,15);
		},
		methods: {
			pagedTrailerList(keywords,page,pageSize){
				var me = this;
				let serverUrl = me.serverUrl;
				let qq = me.qq;
				
				//显示loading...
				uni.showLoading({
					mask:true,
					title:"正在读取超英列表，请稍等..."
				})
				
				uni.showNavigationBarLoading()
				
				// guess
				uni.request({
					url: serverUrl
					+ '/search/list?qq=' + qq 
					+ '&keywords='+ keywords
					+ '&page='+ page
					+ '&pageSize=' + pageSize, //hot接口地址
					
					method:"POST",
				
					success: (res) => {
						
						if(res.data.status == 200){
							let tempList = res.data.data.rows;
							me.trailerList = me.trailerList.concat(tempList);
							me.totalPages = res.data.data.total;
							me.page = page;
						}
				
					},
					// 完成后,success后，停止下拉刷新
					complete:()=>{
						uni.hideLoading();
						uni.hideNavigationBarLoading();
					}
				});
			},
			
			searchMe(e){

				let me = this;
				// 取搜索值
				let value = e.detail.value;
				me.keywords = value;
				me.trailerList = [];
				
				me.pagedTrailerList(value,1,15);
			},
		
			showTrailer(e){
				let trailerId = e.currentTarget.dataset.trailerid;
				// 页面跳转API
				uni.navigateTo({
					url:"../movie/movie?trailerId="+trailerId
				})
				
			}
			
		}
	}
</script>

<style>
@import url("search.css");
</style>
