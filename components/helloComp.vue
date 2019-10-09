<template name="helloComp">
	<view>
		{{msg}}
		<view class="">
			<input type="text" :value="myval" class="txt" />
		</view>
	</view>
</template>

<script>
	export default {
		name:"helloComp",
		
		data() {
			return {
				msg:"你好，自定义组件..."
			};
		},
		
		props:{
			myval:{
				type:String
			}
		}
	}
</script>

<style>
.txt{
	color: red;
}
</style>
