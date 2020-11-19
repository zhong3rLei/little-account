<template>
    <div class="home">
        <el-button type="primary" size="small">添加账目<i class="el-icon-document-add el-icon--right"></i></el-button>
        <el-button type="primary" size="small" style='position:relative;'>导入账本<i class="el-icon-folder-add el-icon--right"></i>
            <input type="file" @change="excel_add" class="inputFile" accept=".xlsx">
        </el-button>
        <el-button type="danger" size="small">清空当前工作区<i class="el-icon-delete el-icon--right"></i></el-button>
        <el-button type="success" style='float:right;' size="small">导出账本<i
                class="el-icon-folder-opened el-icon--right"></i>
        </el-button>
        <div style='margin-top: 20px;'>
            已筛选：
            <el-tag :key="tag.name" v-for="(tag,index) in filterList" style='margin: 0 5px;' :type="tag.type" closable
                :disable-transitions="false" @close="handleClose(tag,index)">
                {{tag.name}}
            </el-tag>
        </div>
        <table class="table-head" border="0" cellpadding="0" cellspacing="0" style="margin-top:10px;">
            <tr>
                <td style='width:55px;'></td>
                <td></td>
                <td style='width:120px;'>
                    <el-popover width="120" trigger="focus">
                        <el-checkbox-group v-model="dateCheckList">
                            <el-checkbox style='display:block;padding:4px 0;' v-for='item in dateList' :key='item'
                                :label="item"></el-checkbox>
                        </el-checkbox-group>
                        <el-input :value="dateCheckList.join(',')" style='width:100%;' placeholder="请选择日期"
                            slot="reference"></el-input>
                    </el-popover>
                </td>
                <td style='width:120px;'>
                    <el-popover width="120" trigger="focus">
                        <el-tree :data="variationData" :props="defaultProps" show-checkbox
                            @check-change="handleCheckChange"></el-tree>
                        <el-input v-model="input" style='width:100%;' placeholder="请选择类别" slot="reference"></el-input>
                    </el-popover>
                </td>
                <td style='width:200px;'>
                    <el-popover width="200" trigger="focus">
                        <el-checkbox-group v-model="payCheckList">
                            <el-checkbox style='display:block;padding:4px 0;' v-for='item in payList' :key='item'
                                :label="item"></el-checkbox>
                        </el-checkbox-group>
                        <el-input :value="payCheckList.join(',')" style='width:100%;' placeholder="请选择支付方式"
                            slot="reference"></el-input>
                    </el-popover>
                </td>
                <td style='width:120px;'></td>
                <td style='width:55px;'></td>
            </tr>
        </table>
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="margin-top:10px;" border
            max-height="700" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column label="详细内容" prop='content' show-overflow-tooltip></el-table-column>
            <el-table-column label="日期" width="120">
                <template slot-scope="scope">{{ format(scope.row.date) }}</template>
            </el-table-column>
            <el-table-column label="分类" width="120">
                <template slot-scope="scope">{{ scope.row.variation }}</template>
            </el-table-column>
            <el-table-column label="支付方式" width="200">
                <template slot-scope="scope">{{ scope.row.paymentType }}</template>
            </el-table-column>
            <el-table-column label="金额" prop='money' width="120"></el-table-column>
            <el-table-column label="操作" width="55">
                <template slot-scope="scope">
                    <el-button type="danger" size='small' icon="el-icon-delete" circle @click='delData(scope)'>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <table class="table-foot" border="0" cellpadding="0" cellspacing="0">
            <colgroup>
                <col>
                <col>
                <col>
                <col>
                <col>
                <col width='174'>
            </colgroup>
            <tr>
                <td colspan="5">合计</td>
                <td style="175px">{{account}}</td>
            </tr>
        </table>
    </div>
</template>

<script>
    // @ is an alias to /src
    import zel from '@/assets/global.js'

    export default {
        name: 'Home',
        data: () => ({
            filterList: [
                // {
                //     name: '日期',
                //     type: 'success'
                // },
                // {
                //     name: '类目',
                //     type: 'success'
                // }
            ],
            tableData: [
                // {
                //     date: '2016-05-03',
                //     content: '上海市普陀区金沙江路 1518 弄',
                //     variation: '采购-教材',
                //     paymentType: '微信',
                //     money: 500
                // }, {
                //     date: '2016-05-03',
                //     content: '上海市普陀区金沙江路 1518 弄',
                //     variation: '采购-教材',
                //     paymentType: '微信',
                //     money: 400
                // }
            ],
            multipleSelection: [],
            input: '',
            account: 0,
            dateCheckList: [],
            dateList: [
                // '2020-11-19', '2020-11-29'
            ],
            payCheckList: [],
            payList: [
                // '微信', '支付宝', '银联', '现金'
            ],
            variationData: [
                // {
                //     label: '一级 1',
                //     children: [{
                //         label: '二级 1-1',
                //         children: [{
                //             label: '三级 1-1-1'
                //         }]
                //     }]
                // }, {
                //     label: '一级 2',
                //     children: [{
                //         label: '二级 2-1',
                //         children: [{
                //             label: '三级 2-1-1'
                //         }]
                //     }, {
                //         label: '二级 2-2',
                //         children: [{
                //             label: '三级 2-2-1'
                //         }, {
                //             label: '三级 2-2-2'
                //         }]
                //     }]
                // }, {
                //     label: '一级 3',
                //     children: []
                // }
            ],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        }),
        computed: {

        },
        methods: {
            handleClose(tag, index) {
                this.filterList.splice(index, 1)
            },
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleCheckChange(data) {
                console.log(data)
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delData(scope) {
                this.tableData.splice(scope.$index, 1)
            },
            excel_add(e) { //导入模板的方法
                var _vm = this;
                var fr = new FileReader();
                let _target = e.target;
                var temp = _target.files[0].name.split('.');
                let _type = temp[temp.length - 1];
                if (_type && (_type != 'xlsx' && _type != 'xls')) { //手动判断一下文件的格式，如果不是xlsx/xls则拦截住
                    this.$layer.message({
                        content: '导入失败：文件错误'
                    })
                    _target.value = null;
                    return;
                }
                fr.readAsArrayBuffer(e.target.files[0]);

                fr.onload = function () {
                    zel.excel_load(fr.result, el => {
                        _vm.addTableData(el)
                        _vm.computeCheck(el[0])
                    })
                }
            },
            addTableData (dat) {
                dat[0].splice(0,1)
                var arr = dat[0].map(el=>{
                    return {
                        date: el[1],
                        content: el[0],
                        variation: el[2],
                        paymentType: el[3],
                        money: Number(el[4])
                    }
                })
                this.tableData = [...this.tableData,...arr]
            },
            computeCheck (dat) {
                let dateBottle = {},
                    dateList = [],
                    variateBottle = {},
                    variateList = [],
                    payBottle = {},
                    payList = []

                dat.forEach(v=>{
                    if (dateBottle[v[1]] == undefined) {
                        dateBottle[v[1]] = true
                        dateList.push(v[1])
                    }
                    if (variateBottle[v[2]] == undefined) {
                        variateBottle[v[2]] = true
                        variateList.push(v[2])
                    }
                    if (payBottle[v[3]] == undefined) {
                        payBottle[v[3]] = true
                        payList.push(v[3])
                    }
                })
                this.dateList = dateList
                this.payList = payList
            },
            format (date) {
                var now = new Date(date)
                var localUtc = new Date().getTimezoneOffset() /60;
                return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
            }
        },
        components: {

        }
    }
</script>

<style scoped>
    .table-head td {
        padding: 0 5px;
        box-sizing: border-box;
    }

    .table-head {
        width: 100%;
    }

    .table-foot td {
        padding: 12px 10px;
        box-sizing: border-box;
        font-size: 14px;
        border-right: 1px solid #EBEEF5;
    }

    .table-foot td:last-child {
        border-right: 0;
    }

    .table-foot {
        width: 100%;
        border-bottom: 1px solid #EBEEF5;
        border-left: 1px solid #EBEEF5;
        border-right: 1px solid #EBEEF5;
        background-color: #f8f8f8;
    }
    .inputFile {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
    }
</style>