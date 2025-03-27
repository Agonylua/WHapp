async function saveEquipment(newEquipment) {
    var storageData = uni.getStorageSync('deviceList');
    var existingList = [];

    if (storageData == undefined || storageData == '') {
        existingList = [];
    } else {
        try {
            existingList = JSON.parse(storageData);
        } catch (e) {
            existingList = [];
        }
    }

    var index = existingList.findIndex(function(element) {
        return element.id == newEquipment.id;
    });

    if (index == -1) {
        existingList.push(newEquipment);
        deviceList.value = existingList; // 更新响应式引用
        uni.setStorageSync('deviceList', JSON.stringify(existingList));
        return { success: true };
    } else {
        var existingData = existingList[index];

        var existingStr = `现有设备：
ID: ${existingData.id}
名称: ${existingData.name}
类别: ${existingData.category}
时间: ${existingData.time}
最后时间: ${existingData.lasttime}
`;

        var newStr = `新设备：
ID: ${newEquipment.id}
名称: ${newEquipment.name}
类别: ${newEquipment.category}
时间: ${newEquipment.time}
最后时间: ${newEquipment.lasttime}
`;

        const response = await new Promise((resolve) => {
            uni.showModal({
                title: '发现冲突',
                content: existingStr + "\n\n" + newStr,
                confirmText: '覆盖',
                cancelText: '跳过',
                success: function(res) {
                    resolve(res);
                }
            });
        });

        if (response.confirm) {
            existingList[index] = newEquipment;
            deviceList.value = existingList; // 更新响应式引用
            uni.setStorageSync('deviceList', JSON.stringify(existingList));
            return { success: true };
        } else {
            return { success: false };
        }
    }
}
export default saveEquipment;