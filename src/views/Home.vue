<template>
    <div class="home">
        <el-button type="primary" size="small" @click="dialogFormVisible = true">添加账目<i class="el-icon-document-add el-icon--right"></i></el-button>
        <el-button type="primary" size="small" style='position:relative;'>导入账本<i class="el-icon-folder-add el-icon--right"></i>
            <input type="file" @change="excel_add" class="inputFile" accept=".xlsx">
        </el-button>
        <el-button type="danger" size="small" @click="clearWorkSpace">清空当前工作区<i class="el-icon-delete el-icon--right"></i></el-button>
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
                        <el-input :value="dateCheckList.join(',')" readonly style='width:100%;' placeholder="请选择日期"
                            slot="reference"></el-input>
                    </el-popover>
                </td>
                <td style='width:120px;'>
                    <el-popover width="120" trigger="focus">
                        <!--<el-tree ref='tree' :data="variationData" :props="defaultProps" show-checkbox
                            @check-change="handleCheckChange"></el-tree>
                        <el-input :value="variationCheck.join(',')" style='width:100%;' readonly placeholder="请选择类别" slot="reference"></el-input>-->
                        <el-checkbox-group v-model="variationCheck">
                            <el-checkbox style='display:block;padding:4px 0;' v-for='item in variationData' :key='item'
                                :label="item"></el-checkbox>
                        </el-checkbox-group>
                        <el-input :value="variationCheck.join(',')" style='width:100%;' readonly placeholder="请选择类别" slot="reference"></el-input>
                    </el-popover>
                </td>
                <td style='width:200px;'>
                    <el-popover width="200" trigger="focus">
                        <el-checkbox-group v-model="payCheckList">
                            <el-checkbox style='display:block;padding:4px 0;' v-for='item in payList' :key='item'
                                :label="item"></el-checkbox>
                        </el-checkbox-group>
                        <el-input :value="payCheckList.join(',')" readonly style='width:100%;' placeholder="请选择支付方式"
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
        <el-dialog title="添加账目" :visible.sync="dialogFormVisible">
            <el-form>
                <el-form-item label="详情" label-width="100px">
                    <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                    autocomplete="off"
                    v-model="detail">
                    </el-input>
                </el-form-item>
                <el-form-item label="日期" label-width="100px">
                    <el-date-picker
                        v-model="addDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        format='yyyy-MM-dd'
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="分类" label-width="100px">
                    <el-dropdown trigger="click" placement="bottom-start" @command='addVarietyCall'>
                        <el-input v-model="addVariety" placeholder="请输入分类"></el-input>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for='item in variationData' :key='item'>{{item}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>
                <el-form-item label="支付方式" label-width="100px">
                    <el-dropdown trigger="click" placement="bottom-start">
                        <el-input v-model="addPayType" placeholder="请输入支付方式"></el-input>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for='item in payList' :key='item'>{{item}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    // @ is an alias to /src
    import zel from '@/assets/global.js'
    function formatNum(f, digit) { 
        var m = Math.pow(10, digit); 
        return parseInt(f * m, 10) / m; 
    } 
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
            tableSource: [],
            multipleSelection: [],
            variationCheck: [],
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
            },
            dialogFormVisible: false,
            detail: '',
            addDate: '',
            addVariety: '',
            addPayType: ''
        }),
        computed: {

        },
        watch: {
            dateCheckList: {
                handler (val) {
                    this.filter()
                    if (val.length <= 0) {
                        let index = this.filterList.findIndex(v=>v.customType == 'dateCheckList')
                        if (index >= 0) this.filterList.splice(index, 1)
                        return
                    }
                    let obj = this.filterList.find(v=>v.customType == 'dateCheckList')
                    if (obj) {
                        obj.name = '日期：'+ val.join(' , ')
                    } else {
                        this.filterList.push({
                            name: '日期：'+ val.join(' , '),
                            type: 'success',
                            customType: 'dateCheckList'
                        })
                    }
                }
            },
            payCheckList: {
                handler (val) {
                    this.filter()
                    if (val.length <= 0) {
                        let index = this.filterList.findIndex(v=>v.customType == 'payCheckList')
                        if (index >= 0) this.filterList.splice(index, 1)
                        return
                    }
                    let obj = this.filterList.find(v=>v.customType == 'payCheckList')
                    if (obj) {
                        obj.name = '支付方式：'+ val.join(' , ')
                    } else {
                        this.filterList.push({
                            name: '支付方式：'+ val.join(' , '),
                            type: 'success',
                            customType: 'payCheckList'
                        })
                    }
                }
            },
            variationCheck: {
                handler (val) {
                    this.filter()
                    if (val.length <= 0) {
                        let index = this.filterList.findIndex(v=>v.customType == 'variationCheck')
                        if (index >= 0) this.filterList.splice(index, 1)
                        return
                    }
                    let obj = this.filterList.find(v=>v.customType == 'variationCheck')
                    if (obj) {
                        obj.name = '类别：'+ val.join(' , ')
                    } else {
                        this.filterList.push({
                            name: '类别：'+ val.join(' , '),
                            type: 'success',
                            customType: 'variationCheck'
                        })
                    }
                }
            }
        },
        methods: {
            handleClose(tag, index) {
                this.filterList.splice(index, 1)
                if (tag.customType == 'dateCheckList') {
                    this.dateCheckList = []
                }
                if (tag.customType == 'payCheckList') {
                    this.payCheckList = []
                }
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
                console.log(this.$refs.tree.getCheckedNodes(true, false),this.$refs.tree.getNode())
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                this.computeAccount()
            },
            delData(scope) {
                this.$confirm('确认删除吗？')
                .then(_ => {
                    this.tableData.splice(scope.$index, 1)
                    this.computeAccount()
                })
                .catch(_ => {});
                
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
                this.tableSource = [...this.tableSource,...arr]
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
                //分析分类的渲染数据
                // let vArr = []
                // variateList.forEach(v=>{
                //     let itemArr = v.split('-')
                //     let cur = null
                //     function recursion (list, box) {
                //         if (list.length <= 0) return
                //         let obj = box.find(el => el.label == list[0])
                //         if (!obj) {
                //             obj = {
                //                 label: list[0],
                //                 children: []
                //             }
                //             box.push(obj)

                //         }
                //         list.shift()
                //         recursion(list, obj.children)
                //     }
                //     recursion(itemArr, vArr)
                    
                // })
                this.variationData = variateList
            },
            format (date) {
                var now = new Date(date)
                var localUtc = new Date().getTimezoneOffset() /60;
                return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
            },
            computeAccount () {
                let num = 0
                this.multipleSelection.forEach(v=>{
                    num = (parseFloat(num) + parseFloat(v.money)).toFixed(2)
                })
                this.account = num
            },
            filter () {
                this.tableData = this.tableSource.filter(v=>{
                    let b1 = true, b2 = true, b3 = true
                    if (this.dateCheckList.length > 0) {
                        b1 = this.dateCheckList.indexOf(v.date) >= 0
                    }
                    if (this.variationCheck.length > 0) {
                        b2 = this.variationCheck.indexOf(v.variation) >= 0
                    }
                    if (this.payCheckList.length > 0) {
                        b3 = this.payCheckList.indexOf(v.paymentType) >= 0
                    }
                    return b1 && b2 && b3
                })
            },
            clearWorkSpace () {
               this.filterList = [] 
               this.tableData = []
               this.tableSource = []
               this.multipleSelection = []
               this.variationCheck = []
               this.account = 0
               this.dateCheckList = []
               this.dateList = []
               this.payCheckList = []
               this.payList = []
               this.variationData = []
            },
            findNode () {},
            addVarietyCall (commond) {
                console.log(commond)
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