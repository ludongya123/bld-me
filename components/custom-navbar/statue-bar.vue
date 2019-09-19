<template>
	<view   class="uni-status-bar" :style="{height:statusBarHeight}"> 
		<slot />
	</view>
</template>

<script>
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px'
	export default {
		name: 'UniStatusBar',
		data() {
			return {
				statusBarHeight: statusBarHeight
			}
		}
	}
</script>

<style>
	.uni-status-bar {
		display: block;
		width: 100%;
		/* height: 20px; */
		/* height: var(--status-bar-height); */
	}
</style>