<template>
<!-- 	<uv-loading-page :loading="true" image="/static/WH.ico" icon-size="80px" v-if="isShow"></uv-loading-page> -->
	<view class="content">
		<view class="nav-bar" :style="{marginTop: systemBarHeight + 'px'}"></view>
		<uni-fab horizontal="right" :content="content" @trigger="trigger" ref="fat"></uni-fab>
		<view class="icon">
			<uv-icon name="list"  size="42px" @click="set_up"></uv-icon>
		</view>
		<view class="text">
			<uv-text text="维护系统" align="center" size="55"></uv-text>
		</view>
			<view style="width: 360px;margin: 0px 60px 0px 60px;">
			<uv-line></uv-line>
				<uv-row justify="space-between" gutter="6" style="height: 50px; ">
					<uv-col justify="center" align="center" text-align="center" span="2">编号</uv-col>
					<uv-col justify="center" align="center" text-align="center" span="3">设备名称</uv-col>
					<uv-col justify="center" align="center" text-align="center" span="5">上次保养时间</uv-col>
					<uv-col justify="center" align="center" text-align="center" span="2">剩余</uv-col>
				</uv-row>
			<uv-line></uv-line></view>
			<view class="list">
			<uv-list v-for="(item,index) in equipment_list" :key="index" style=" max-height: 80px;" :border="true" >
				<uv-list-item :border="true" style="height: 40px;">	
					<uv-row justify="space-between" gutter="6" >
					<uv-col span="2">
							<view style="display: flex;justify-content: center;">{{item.id}}</view>
					</uv-col>
						<uv-col span="3">
							<view style="display: flex;justify-content: center;">{{item.name}}</view>
					</uv-col>
					<uv-col span="5">
							<view style="margin-left: 30px;">{{item.lasttime}}</view>
					</uv-col>
					<uv-col span="2">
							<view style="display: flex;justify-content: center;">{{item.remainingDays}}</view>
					</uv-col>
					</uv-row>
				</uv-list-item>
			</uv-list>
		</view>
		<uv-popup ref="set" mode="left" :safeAreaInsetTop="true">
			<view class="set ">
				<view style="display: flex;flex-direction: column; align-items: center;justify-content: center;height: 220px;">
				<uv-image src="/static/WH.ico" mode="widthFix" width="100px" height="100px" ></uv-image>
				</view>
				<view style="min-height: 100px;">
				<uv-cell-group v-for="item in set_list" :key="item.id"  customStyle="min-height: 10px">
					<uv-cell :title="item.name" size="large" @click="setclick(item.id)"></uv-cell>
				</uv-cell-group></view>
				<view style="position: fixed;bottom: 0; padding: 10px;">
				<uv-image src="/static/tuichu.png" width="30px" height="30px" ></uv-image>
				</view>
			</view>
		</uv-popup>
	</view>
</template>

<script setup>
import { ref, onMounted, computed} from 'vue';
import { onPullDownRefresh,onHide, onShow} from "@dcloudio/uni-app"

const isShow = ref(true);
const fat = ref();
const set = ref(null);
const edit = ref(null);
const equipment_list = ref([]);
const equipment = ref([]);
const device = ref([]);
const daysDifference = ref();
const timedifference = ref(); //设备筛选（默认剩余7天以内）

const set_list = [
	{id: 0,name:'参数调整'},
	{id: 1,name:'清空数据'},
	{id: 2,name:'通知设置'}
]
const content = ref(
[	{
	iconPath: '/static/category-add.png',
	text: '设备录入',
	active: false
	},{
	iconPath: '/static/product.png',
	text: '设备管理',
	active: false
	},{
	iconPath: '/static/change.png',
	text: '同步数据',
	active: false
	}
]);
const set_up = ()=>{
	set.value.open();
};

const edit_open = () => {
  edit.value.open();
};

const trigger = (e)=>{
	switch(e.index){
		case 0:uni.navigateTo({url:"/pages/equipment/equipment_Input"});break;
		case 1:uni.navigateTo({url:'/pages/equipment/equipment_manage'});;break;
	}
	
};

const goto = ref((URL)=>{
	uni.navigateTo({
		url:URL
	})
});

const setclick = (e) =>{
	if(e==0){
	}
	if(e==1){
		if(equipment.value.length!=0){
		const value = uni.removeStorageSync("deviceList");
		uni.showToast({
			title: '删除成功',
			icon: 'success'
		});
		}
		else{
			uni.showToast({
				title: '删除失败',
				icon: 'fail'
			});
		}
	}
	storage();
};

const storage = () => {
  equipment.value = uni.getStorageSync('deviceList') || [];
  const currentDate = new Date();
  
  equipment_list.value = equipment.value
    .map(item => {
      const presetDate = new Date(item.lasttime);
      const daysDiff = Math.floor((currentDate - presetDate) / (1000 * 3600 * 24));
      return { 
        ...item, 
        remainingDays: item.time - daysDiff 
      };
    })
    .filter(item => 
      item.remainingDays >= 0 && 
      item.remainingDays <= 7
    );
};

// 系统状态栏的高度
const systemBarHeight = ref(0);

// 获取系统栏高度
const getSysteminfo = () => {
    uni.getSystemInfo({
        success: (res) => {
            systemBarHeight.value = res.statusBarHeight;
        }
    });
};


// 初始化时加载数据
onMounted(() => {
  getSysteminfo();
  storage();
});
onPullDownRefresh(()=>{
    storage();
	fat.value.close();
    setTimeout(() => {
        uni.stopPullDownRefresh();
    }, 1000);
});
onHide(()=>{
	if(fat.value.isShow)
	{fat.value.close();}
});
onShow(()=>{
	setTimeout(()=>{
		isShow.value = false;
	},1000);
});
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.icon{
		width: 100%;
		height: 40px;
		display: flex;
		justify-content: flex-start;
		padding-left: 16px;
	}
	.text{
		width: 320px;
		height: 180px;
		margin: 20px 50px 20px 50px;
		display: flex;
		flex: auto;
		align-items: center;
	}
	.list{
		width: 360px;
		max-height: 450px;
		margin: 0px 60px 0px 60px;
	}
	.set{
		width: 200px;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.edit{
		width: 400px;
		min-height: 400px;
		padding: 20px;
		display: flex;
		align-items: center;
	}
</style>
