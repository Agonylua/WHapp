<template>
    <view class="main">
        <button type="info" style="margin-top: 10px; height: 38px; width: 328px;" size="mini" @click="renderJS.createFileInputDom">
			<text>选择文件</text>
		</button>
    </view>
</template>
<script>
import * as XLSX from 'xlsx';

export default {
    methods: {
        parseJSONData(base64Str) {
            if (base64Str.includes('application/json')) {
                let jsonStr = this.convertBase64ToUTF8(base64Str)
                let jsonData = JSON.parse(jsonStr)
                this.$emit('readJSONFinish', { jsonData })
            } else if (base64Str.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
                this.parseXLSXData(base64Str)
            } else {
                this.$emit('readJSONFinish', { jsonStr: base64Str })
            }
        },

        async parseXLSXData(base64Str) {
            try {
                const base64Data = base64Str.split(',')[1]
                const binaryString = atob(base64Data)
                const buffer = new Uint8Array(binaryString.length)
                for (let i = 0; i < binaryString.length; i++) {
                    buffer[i] = binaryString.charCodeAt(i)
                }

                const workbook = XLSX.read(buffer, { type: 'array', cellDates: true })
                const firstSheetName = workbook.SheetNames[0]
                const worksheet = workbook.Sheets[firstSheetName]

                const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, cellDates: true })

                const headers = data[0].map(h => h.trim())
                const equipmentList = []

                const columnMapping = {
                    '编号': 'id',
                    '设备名称': 'name',
                    '类型': 'category',
                    '维护间隔': 'time',
                    '上次维护时间': 'lasttime'
                }

                for (let i = 1; i < data.length; i++) {
                    const row = data[i]
                    const equipment = {
                        id: '',
                        name: '',
                        category: '',
                        time: '',
                        lasttime: ''
                    }

                    headers.forEach((header, index) => {
                        const mappedKey = columnMapping[header]
                        if (mappedKey) {
                            const value = row[index]
                            if (value !== undefined && value !== null) {
                                if (mappedKey === 'lasttime') {
                                    let date
                                    if (value instanceof Date) {
                                        date = value
                                    } else if (typeof value === 'number') {
                                        // 处理Excel日期序列号
                                        const utcDays = Math.floor(value - 25569)
                                        date = new Date(utcDays * 86400 * 1000)
                                    } else {
                                        date = new Date(value)
                                    }
                                    if (!isNaN(date)) {
                                        const year = date.getFullYear()
                                        const month = String(date.getMonth() + 1).padStart(2, '0')
                                        const day = String(date.getDate()).padStart(2, '0')
                                        equipment[mappedKey] = `${year}-${month}-${day}`
                                    } else {
                                        equipment[mappedKey] = value
                                    }
                                } else {
                                    equipment[mappedKey] = value === 0 ? '0' : value // 确保0被转换为字符串
                                }
                            }
                        }
                    })

                    equipmentList.push(equipment)
                }

                this.$emit('processXLSXFinish', { equipmentList })
            } catch (error) {
                console.error('解析XLSX失败:', error)
                this.$emit('processXLSXError', { error })
            }
        }
    }
}
</script>
<script module="renderJS" lang="renderjs">
export default {
	data() {
		return {}
	},
	mounted() {

	},
	methods: {
		createFileInputDom(e, ownerVm) {
			let fileInput = document.createElement('input')
			fileInput.setAttribute('type', 'file')
			fileInput.setAttribute('accept', '*')
			fileInput.click()
			fileInput.addEventListener('change', e => {
				let file = e.target.files[0]
				// #ifdef APP-PLUS
				let reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = function(event) {
					const base64Str = event.target.result; // 文件的base64
					ownerVm.callMethod('parseJSONData', base64Str)

                    // 如果需要得到文件的本地路径，可以通过下面方法
                    // ownerVm.callMethod('receiveRenderFile', {
                    // 	name: file.name,
                    // 	filePath: base64Str
                    // })
				}
				// #endif

				// #ifdef H5
                // 如果需要得到文件的本地路径，可以通过下面方法
				// const filePath = URL.createObjectURL(file)
                // ownerVm.callMethod('receiveRenderFile', {
                // 	name: file.name,
                // 	filePath: filePath
                // })
				// #endif
			})
		}
	}
}
</script>
<style>
.main {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow-y: scroll;
}

/* .selectBtn {
    border-radius: 10rpx;
    font-size: 32rpx;
} */
</style>
