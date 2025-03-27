<template>
    <view class="content">
        <view style="height: 120px;padding-left: 20px; display: flex;align-items: center;">
            <uv-text text="设备录入" size="36"></uv-text>
        </view>
        <view class="from">
            <uv-form label-width="70px" :model="model1" ref="formRef">
                <uv-form-item label="编号" borderBottom>
                    <uv-input border="none" placeholder="请输入编号" v-model="model1.equipment.id"></uv-input>
                </uv-form-item>
                <uv-form-item label="设备名" borderBottom>
                    <uv-input border="none" placeholder="请输入设备名" v-model="model1.equipment.name"></uv-input>
                </uv-form-item>
                <uv-form-item label="类别" borderBottom>
                    <uv-radio-group v-model="radiovalue">
                        <uv-radio 
                            :customStyle="{margin: '8px'}" 
                            v-for="(item, index) in radiolist" 
                            :key="index" 
                            :label="item.name" 
                            :name="item.name">
                        </uv-radio>
                    </uv-radio-group>
                </uv-form-item>
                <uv-form-item label="维护间隔" borderBottom>
                    <uv-input border="none" placeholder="请输入维护间隔(天)" v-model="model1.equipment.time"></uv-input>
                </uv-form-item>
                <uv-form-item label="上次维护日期" borderBottom>
                    <uv-input placeholder="请选择日期" disabled @click="calendar_open" v-model="model1.equipment.lasttime">
                        <template v-slot:prefix>
                            <uv-icon name="calendar"></uv-icon>
                        </template>
                    </uv-input>
                </uv-form-item>
                <uv-button type="primary" text="提交" customStyle="margin-top: 20px" @click="submit"></uv-button>
                <uv-button type="error" text="重置" customStyle="margin-top: 10px" @click="reset"></uv-button>
				<heyuan-chooseFile @processXLSXFinish="readFile" ></heyuan-chooseFile>
            </uv-form>

            <uni-calendar ref="calendar" :insert="false" @confirm="onCalendarConfirm" ></uni-calendar>
			<uv-popup ref="list" :closeable="true" round="20">
				<view style="width: 280px;min-height: 220px;padding: 20px;">
				<uv-text text="仅展示部分内容供参考"  type="info"></uv-text>
				<uv-row v-for="(item,index) in deviceList.slice(0,5)" :key="index"  gutter="6">
					<uv-col span="2">{{item.id}}</uv-col>
					<uv-col span="3">{{item.name}}</uv-col>
					<uv-col span="6">{{item.lasttime}}</uv-col>
					<uv-col span="1">....</uv-col>
				</uv-row>
				<uv-button type="primary" @click="saveDevice" style="margin-top: 35px;">保存</uv-button>
				</view>
			</uv-popup>
        </view>
    </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import HeyuanChooseFile from '@/uni_modules/heyuan-chooseFile/components/heyuan-chooseFile/heyuan-chooseFile.vue'


const deviceList = ref([]);
const calendar = ref(null);
const formRef = ref(null);
const list = ref(null);

const readFile = (equipmentList)=>{
	deviceList.value=equipmentList;
	deviceList.value=deviceList.value.equipmentList;
	list.value.open();
};
const saveDevice = async () =>{
		uni.setStorageSync('deviceList', deviceList.value);
		list.value.clear();
		uni.showToast({
		    title: '保存成功',
		    icon: 'success'
		});
};

// 响应式数据
const model1 = ref({
    equipment: {
        id: '',
        name: '',
        category: '',
        time: '',
        lasttime: ''
    },
});

const radiovalue = ref("小型设备");
const radiolist = reactive([
    { name: '小型设备', disabled: false },
    { name: '中型设备', disabled: false },
    { name: '大型设备', disabled: false },
    { name: '其他', disabled: false }
]);

// 日期选择器打开
const calendar_open = () => {
    calendar.value.open();
};

// 提交方法
const submit = async () => {
    // 手动检查所有字段是否填写
    const requiredFields = [
        model1.value.equipment.id,
        model1.value.equipment.name,
        model1.value.equipment.time,
        model1.value.equipment.lasttime
    ];

    if (requiredFields.some(field => !field || field.trim() === '')) {
        uni.showToast({
            title: '请填写所有字段',
            icon: 'error'
        });
        return;
    }

    // 同步radio值到model
    model1.value.equipment.category = radiovalue.value;

    // 创建新设备对象
    const newDevice = { ...model1.value.equipment };

    // 保存到本地
    deviceList.value.push(newDevice);
    uni.setStorageSync('deviceList', deviceList.value);

    uni.showToast({
        title: '保存成功',
        icon: 'success'
    });
    
    reset();
};

// 重置方法
const reset = () => {
    model1.value.equipment = {
        id: '',
        name: '',
        category: '',
        time: '',
        lasttime: ''
    };
    radiovalue.value = "小型设备";
};

// 日期选择处理
const onCalendarConfirm = (e) => {
    model1.value.equipment.lasttime = e.fulldate;
};

// 初始化加载数据
onMounted(() => {
    const storedDevices = uni.getStorageSync('deviceList');
    if (storedDevices) {
        deviceList.value = storedDevices;
    }
});
</script>

<style lang="scss" scoped>
.content {
    width: 100%;
}
.from {
    padding: 30px;
    min-height: 10px;
}
.device_popup{
}
</style>