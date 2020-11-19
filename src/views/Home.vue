<template>
    <div class="home">
        <el-button type="primary" size="small">添加账目<i class="el-icon-document-add el-icon--right"></i></el-button>
        <el-button type="primary" size="small">导入账本<i class="el-icon-folder-add el-icon--right"></i></el-button>
        <el-button type="danger" size="small">清空当前工作区<i class="el-icon-delete el-icon--right"></i></el-button>
        <el-button type="success" style='float:right;' size="small">导出账本<i
                class="el-icon-folder-opened el-icon--right"></i></el-button>
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
                            <el-checkbox style='display:block;padding:4px 0;' v-for='item in dateList' :key='item' :label="item"></el-checkbox>
                        </el-checkbox-group>
                        <el-input :value="dateCheckList.join(',')" style='width:100%;' placeholder="请输入内容" slot="reference"></el-input>
                    </el-popover>
                </td>
                <td style='width:120px;'>
                    <el-popover width="120" trigger="focus">
                        <el-input v-model="input" style='width:100%;' placeholder="请输入内容" slot="reference"></el-input>
                    </el-popover>
                </td>
                <td style='width:200px;'>
                    <el-popover width="200" trigger="focus">
                        <el-input v-model="input" style='width:100%;' placeholder="请输入内容" slot="reference"></el-input>
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
                <template slot-scope="scope">{{ scope.row.date }}</template>
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

    export default {
        name: 'Home',
        data: () => ({
            filterList: [{
                    name: '日期',
                    type: 'success'
                },
                {
                    name: '类目',
                    type: 'success'
                }
            ],
            tableData: [{
                date: '2016-05-03',
                content: '上海市普陀区金沙江路 1518 弄',
                variation: '采购-教材',
                paymentType: '微信',
                money: 500
            }, {
                date: '2016-05-03',
                content: '上海市普陀区金沙江路 1518 弄',
                variation: '采购-教材',
                paymentType: '微信',
                money: 400
            }],
            multipleSelection: [],
            input: '',
            account: 0,
            dateCheckList: [],
            dateList: ['2020-11-19','2020-11-29']
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
            handleSelectionChange(val) {
                console.log(val)
                this.multipleSelection = val;
            },
            getSummaries(param) {
                const {
                    columns,
                    data
                } = param;
                const sums = [];
                console.log(param)
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '总价';
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);
                        sums[index] += ' 元';
                    } else {
                        sums[index] = '';
                    }
                });

                return sums;
            },
            delData(scope) {
                this.tableData.splice(scope.$index, 1)
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
</style>