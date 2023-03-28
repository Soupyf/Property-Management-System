<template>
  <div class="employeeManage">
    <div class="table">
      <el-table :data="tableData" border style="width: 100%"
        :header-cell-style="{ background: '#00abbe', color: '#fff', 'text-align': 'center' }" highlight-current-row>
        <el-table-column fixed align="center" prop="id" label="员工ID">
        </el-table-column>

        <el-table-column key="1" align="center" prop="employeeName" label="名字" v-if="!editOrNot">
        </el-table-column>
        <el-table-column key="1" align="center" label="名字" v-if="editOrNot">
          <template v-slot="scope">
            <el-input size="mini" v-model="scope.row.employeeName"></el-input>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="identityCardType" label="ID卡类型" v-if="!editOrNot">
        </el-table-column>
        <el-table-column align="center" label="ID卡类型" v-if="editOrNot">
          <template v-slot="scope">
            <el-input size="mini" v-model="scope.row.identityCardType"></el-input>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="identityCardId" label="身份证号" v-if="!editOrNot">
        </el-table-column>
        <el-table-column align="center" label="身份证号" v-if="editOrNot">
          <template v-slot="scope">
            <el-input size="mini" v-model="scope.row.identityCardId"></el-input>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="character" label="身份" v-if="!editOrNot">
        </el-table-column>
        <el-table-column align="center" label="身份" v-if="editOrNot">
          <template v-slot="scope">
            <el-input size="mini" v-model="scope.row.character[0]"></el-input>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="phoneNumber" label="联系电话" v-if="!editOrNot">
        </el-table-column>
        <el-table-column align="center" label="联系电话" v-if="editOrNot">
          <template v-slot="scope">
            <el-input size="mini" v-model="scope.row.phoneNumber"></el-input>
          </template>
        </el-table-column>

        <el-table-column align="center" fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="handleEdit()" v-show="!editOrNot" type="primary" size="small">编辑</el-button>
            <el-button @click="handleDelete(scope.row)" v-show="!editOrNot" type="warning" size="small">删除</el-button>
            <el-button @click="handleSave(scope.row)" v-show="editOrNot" type="success" plain
              size="small">保存</el-button>
            <el-button @click="handleCancel()" v-show="editOrNot" type="info" plain size="small">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination v-model:page-size="pageSize" background @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[2, 4, 6, 8]"
        layout="prev, pager, next, sizes, total, jumper" :total="total" />

      <el-button type="primary" @click="openForm()">增加新员工</el-button>
    </div>


    <!-- 添加的时候出来的表格 -->
    <div class="form">
      <el-dialog title="添加新员工" :visible.sync="addOrNot">
        <el-form :model="form" ref="form" :rules="employeeRules">
          <el-form-item prop="EmployeeName" label="员工名字">
            <el-input v-model="form.EmployeeName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="IdentityCardType" label="ID卡类型(0-身份证，1-护照)">
            <el-input v-model="form.IdentityCardType"></el-input>
          </el-form-item>
          <el-form-item prop="IdentityCardId" label="身份证号/护照号">
            <el-input v-model="form.IdentityCardId"></el-input>
          </el-form-item>
          <el-form-item prop="Character" label="员工身份(1-普通员工)">
            <el-input v-model="form.Character"></el-input>
          </el-form-item>
          <el-form-item prop="PhoneNumber" label="联系电话">
            <el-input v-model="form.PhoneNumber" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeForm()">取 消</el-button>
          <el-button type="primary" @click="handleAdd()">确 定</el-button>

        </div>
      </el-dialog>
    </div>
  </div>
</template>
    
<script>
export default {
  methods: {
    openForm() {
      this.addOrNot = true
    },
    closeForm() {
      this.addOrNot = false
    },
    handleAdd() {
      var array = new Array()
      array.push(parseInt(this.form.Character))
      console.log(this.form.EmployeeName, this.form.IdentityCardType, this.form.IdentityCardId, array, this.form.PhoneNumber)
      this.$api.adminApi.addEmployee(this.form.EmployeeName, this.form.IdentityCardType, this.form.IdentityCardId, array, this.form.PhoneNumber)
        .then(res => {
          console.log(res)
          if (res.data.code == "777" || res.data.code == "888" || res.data.code == "999") {
            this.$message({
              type: 'error',
              message: res.data.message
            });
          } else {
            this.$message({
              type: 'success',
              message: "成功增加一名新员工"
            });
            this.editOrNot = false
            this.addOrNot = false
            this.currentPage = 1
            this.pageSize = 2
            this.form = {
              EmployeeName: "",
              IdentityCardType: 0,
              IdentityCardId: "",
              Character: 1,
              PhoneNumber: ""
            }
            this.getAllEmployee(2, 1)
          }
        }).catch(err => {
          console.log(err)
        })
    },
    handleEdit() {
      this.editOrNot = true
      this.tableDataCopy = JSON.parse(JSON.stringify(this.tableData))
    },
    handleCancel() {
      this.tableData = JSON.parse(JSON.stringify(this.tableDataCopy))
      this.editOrNot = false;
    },
    handleSave(row) {
      var array = new Array()
      array.push(parseInt(row.character))
      this.$api.adminApi.modifyEmployee(parseInt(row.id), row.employeeName,
        parseInt(row.identityCardType), row.identityCardId, array, row.phoneNumber)
        .then(res => {
          console.log(res)
          this.editOrNot = false
        }).catch(err => {
          console.log(err)
        })
    },
    handleDelete(row) {
      console.log(parseInt(row.id))
      this.$api.adminApi.deleteEmployee(parseInt(row.id))
        .then(res => {
          console.log(res)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.currentPage = 1
          this.pageSize = 2
          this.getAllEmployee(2, 1)
        }).catch(err => {
          console.log(err)
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getAllEmployee(this.pageSize, 1)
    },
    handleCurrentChange() {
      const _this = this
      this.getAllEmployee(_this.pageSize, this.currentPage)
    },
    getAllEmployee(size, current) {
      const _this = this
      this.$api.adminApi.getAllEmployeeCount()
        .then(res => {
          _this.total = res.data
        }).catch(err => {
          console.log(err)
        });
      this.$api.adminApi.getAllEmployee(size, current)
        .then(res => {
          _this.tableData = res.data
          _this.tableDataCopy = res.data
        }).catch(err => {
          console.log(err)
        });
    }
  },
  data() {
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入收货电话"));
      } else {
        var reg = /^1[3456789]\d{9}$/;
        if (!reg.test(value)) {
          callback(new Error("请输入正确的电话号"));
        } else { callback(); }
      }
    };
    return {
      editOrNot: false,
      addOrNot: false,
      tableData: [],
      tableDataCopy: [],
      pageSize: 2,
      currentPage: 1,
      total: 10,
      form: {
        EmployeeName: "",
        IdentityCardType: 0,
        IdentityCardId: "",
        Character: 1,
        PhoneNumber: ""
      },
      employeeRules: {
        EmployeeName: [{ required: true, message: '请输入员工姓名', trigger: "blur" }],
        IdentityCardType: [{ required: true, message: '请输入ID卡类型', trigger: "blur" }],
        IdentityCardId: [{ required: true, message: '请输入身份证号/护照号', trigger: "blur" }],
        Character: [{ required: true, message: '请输入员工身份', trigger: "blur" }],
        PhoneNumber: [{ required: true, validator: validatePhone, trigger: "blur" }],
      },
    }
  },
  mounted() {
    this.getAllEmployee(2, 1)
  }
}
</script>
    
<style scoped>
.table {
  margin: auto;
  margin-top: 30px;
  width: 80%;
}
</style>