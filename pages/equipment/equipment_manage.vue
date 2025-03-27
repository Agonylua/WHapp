<template>
	<view class="content">
		<view style="height: 200px;display: flex;align-items: center;">
			<uv-text text="设备管理" size="40" align="center"></uv-text>
		</view>
		<uv-line></uv-line>
		<view style="height: 50px;width: 100%; display: flex; align-items: center;justify-content: center;">
			<uv-sticky offset-top="10px">
				<uv-search v-model="searchKeyword" @search="handleSearch"></uv-search>
			</uv-sticky>
		</view>
		<view style="margin-top: 10px;">
			<uv-row gutter="10">
				<uv-col justify="center" align="center" text-align="center" span="3">编号</uv-col>
				<uv-col justify="center" align="center" text-align="center" span="3">设备名称</uv-col>
				<uv-col justify="center" align="center" text-align="center" span="6">上次保养时间</uv-col>
			</uv-row>
			<uv-row gutter="10" v-for="(item,index) in filteredDevices" :key="index" 
				style="height: 50px;" @click="showEditPopup(item)">
				<uv-col justify="center" align="center" text-align="center" span="3">{{item.id}}</uv-col>
				<uv-col justify="center" align="center" text-align="center" span="3">{{item.name}}</uv-col>
				<uv-col justify="center" align="center" span="6">{{item.lasttime}}</uv-col>
			</uv-row>
		</view>
		
		<uv-popup ref="edit" :closeable="true" round="25" custom-style="min-height: 180px;width: 360px; ">
			<view class="edit">
				<uv-form label-width="70px" :rules="rules" ref="formRef" :model="equipment">
				    <uv-form-item label="编号" prop="id" borderBottom>
				        <uv-input v-model="equipment.id" :disabled="true"></uv-input>
				    </uv-form-item>
				    <uv-form-item label="设备名" prop="name" borderBottom>
						<uv-input v-model="equipment.name"></uv-input>
				    </uv-form-item>
					<uv-form-item label="类别" prop="category" borderBottom>
						<uv-input v-model="equipment.category"></uv-input>
					</uv-form-item>
					<uv-form-item label="维护间隔" prop="time" borderBottom>
					    <uv-input v-model="equipment.time"></uv-input>
					</uv-form-item>
					<uv-form-item label="上次维护日期" prop="lasttime" borderBottom>
						<uv-input v-model="equipment.lasttime">
							<template v-slot:prefix>
							    <uv-icon name="calendar"></uv-icon>
							</template>
						</uv-input>
					</uv-form-item>
				</uv-form>
				<view style="display: flex; justify-content: space-around; margin: 20px 0;">
					<uv-button type="primary" @click="saveDevice" style="width: 120px;">保存</uv-button>
					<uv-button type="error" @click="deleteDevice" style="width: 120px;">删除</uv-button>
				</view>
			</view>
		</uv-popup>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const device = ref([]);
const searchKeyword = ref('');
const edit = ref(null);
const formRef = ref(null);
const originalDeviceList = ref([]);

const equipment = ref({
    id: '',
    name: '',
    category: '',
    time: '',
    lasttime: ''
});

const rules = {
    name: [{ required: true, message: '设备名不能为空', trigger: 'blur' }],
    category: [{ required: true, message: '类别不能为空', trigger: 'blur' }],
    time: [{ 
        required: true, 
        message: '维护间隔不能为空',
        validator: (rule, value) => /^\d+$/.test(value),
        trigger: 'blur'
    }]
};


const filteredDevices = computed(() => {
    if (!searchKeyword.value) return device.value;
    return device.value.filter(item => 
        item.id.includes(searchKeyword.value) ||
        item.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    );
});

const showEditPopup = (item) => {
    equipment.value = { ...item };
    edit.value.open();
};

const saveDevice = async () => {
    try {
        await formRef.value.validate();
        const index = device.value.findIndex(d => d.id === equipment.value.id);
        if (index > -1) {
            device.value.splice(index, 1, equipment.value);
            uni.setStorageSync('deviceList', device.value);
            edit.value.close();
            uni.showToast({ title: '保存成功', icon: 'success' });
        }
    } catch (error) {
        console.log('验证失败:', error);
    }
};

const deleteDevice = () => {
    uni.showModal({
        title: '确认删除',
        content: '确定要删除该设备吗？',
        success: (res) => {
            if (res.confirm) {
                const index = device.value.findIndex(d => d.id === equipment.value.id);
                if (index > -1) {
                    device.value.splice(index, 1);
                    uni.setStorageSync('deviceList', device.value);
                    edit.value.close();
                    uni.showToast({ title: '删除成功', icon: 'success' });
                }
            }
        }
    });
};

onMounted(() => {
    const data = uni.getStorageSync('deviceList') || [];
    device.value = data;
    originalDeviceList.value = [...data]; // 保存原始数据副本
});

const handleSearch = () => {
    if (!searchKeyword.value) {
        device.value = [...originalDeviceList.value];
    }
};
</script>

<style lang="scss" scoped>
.content {
    width: 100%;
    min-height: 240px;
}
.edit {
    padding: 20px;
	margin-top: 20px;
}
</style>