<template name="trailerStars">
	<view class="movie-score-wapper">
		<image v-for="(yellow,indea) in yelloScore" :key="indea" src="/static/icos/star-yellow.png" class="star-ico"></image>
		<image v-for="(gray,indeb) in grayScore" :key="`info-`+indeb" src="/static/icos/star-gray.png" class="star-ico"></image>
		<view class="movie-score" v-if="showNum == 1">{{innerScore}}</view>
	</view>
</template>

<script>
	export default {
		name:"trailerStars",
		
		data() {
			return {
				yelloScore:0,
				grayScore:5
			};
		},
		
		props:{
			innerScore:0,	//	定义外部传入的分数
			showNum:0			//	是否显示分数
		},
		
		created(){
			let tempScore = 0;
			if(this.innerScore != null && this.innerScore != undefined && this.innerScore != ''){
				tempScore = this.innerScore;
			}
			
			let yelloScore = parseInt(tempScore / 2);
			let grayScore = 5 - yelloScore;
			
			this.yelloScore = yelloScore;
			this.grayScore = grayScore;
		}
	}
</script>

<style>
.movie-score-wapper{
	display: flex;
	flex-direction: row;
}
.star-ico{
	width: 20upx;
	height: 20upx;
	margin-top: 6upx;
}
.movie-score{
	font-size: 12px;
	color: #808080;
	margin-left: 8upx;
}
</style>
