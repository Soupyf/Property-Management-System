<!-- 去评价 -->
<template>
  <div class="uncommentOrder">
    <div class="orderQuery">
      <el-form :model="queryForm" ref="queryForm" :inline="true">
        <el-form-item prop="uuid">
          <el-input prefix-icon="el-icon-search" placeholder="订单号" v-model="queryForm.uuid" clearable>
          </el-input>
        </el-form-item>
        <el-form-item prop="keyword">
          <el-input prefix-icon="el-icon-search" placeholder="门店/地址" v-model="queryForm.keyword" clearable>
          </el-input>
        </el-form-item>
        <el-button type="primary" @click="conditionQuery">查询</el-button>
      </el-form>
    </div>

    <div class="orderTable">
      <el-table :data="tableData" border style="width: 100%"
        :header-cell-style="{ background: '#00abbe', color: '#fff', 'text-align': 'center' }" highlight-current-row>
        <el-table-column fixed prop="uuid" label="订单号"></el-table-column>
        <el-table-column prop="hotelName" label="门店"></el-table-column>
        <el-table-column prop="hotelAddress" label="门店地址"></el-table-column>
        <el-table-column prop="produceTime" label="下单时间"></el-table-column>
        <el-table-column prop="reserveCheckInTime" label="入住时间"></el-table-column>
        <el-table-column prop="reserveCheckOutTime" label="退房时间"></el-table-column>
        <el-table-column prop="roomType" label="房型"></el-table-column>
        <el-table-column prop="guestRoomID" label="房间号"></el-table-column>
        <el-table-column prop="price" label="实际付款"></el-table-column>
        <el-table-column prop="state" label="订单状态"></el-table-column>
        <el-table-column align="center" prop="operation" label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleClick(scope.$index)">去评价</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination v-model:page-size="pageSize" background @size-change="handleSizeChange"
        @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[2, 4, 6, 8]"
        layout="prev, pager, next, sizes, total, jumper" :total="total" />
    </div>

    <div class="comment">
      <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" width="38%" close-on-press-escape v-dialogDrag>

        <h3>请进行评价</h3>
        <el-timeline :model="dialogForm" ref="dialogForm">

          <el-timeline-item timestamp="评分" placement="top">
            <el-card>
              <el-rate v-model="dialogForm.grade" :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
              </el-rate>
            </el-card>
          </el-timeline-item>
          <el-timeline-item timestamp="请输入评价" placement="top">
            <el-card>
              <el-input v-model="dialogForm.wordComment" prefix-icon="el-icon-search" placeholder="请多多描述入住体验~"
                type="textarea" :rows="2" clearable>
              </el-input>
            </el-card>
          </el-timeline-item>

          <el-timeline-item timestamp="请添加图片" placement="top">

            <!-- :http-request 自定义的上传行为 -->
            <el-upload ref="elupload" name="picture" :file-list="fileList" multiple action="" :limit="6"
              :auto-upload="false" :http-request="handleupload" list-type="picture-card"
              :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-remove="beforeRemove"
              :on-exceed="handleExceed" :on-change="beforeUpload">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="pictureVisible" :append-to-body="true">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-timeline-item>
          <!-- :on-preview="handlePreviewVideo" -->
          <el-timeline-item timestamp="请添加视频" placement="top">
            <el-upload ref="uploadVideo" :file-list="videoList" action="" :limit="1" :auto-upload="false"
              :http-request="handleuploadVideo" :on-preview="handlePreviewVideo" :on-remove="handleRemoveVideo"
              :before-remove="beforeRemoveVideo" :on-exceed="handleExceedVideo" :on-change="beforeUploadVideo">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>

            <el-dialog :visible.sync="videoVisible" :append-to-body="true">
              <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true"
                :options="playerOptions" @play="onPlayerPlay($event)" @pause="onPlayerPause($event)">
              </video-player>
            </el-dialog>
          </el-timeline-item>
        </el-timeline>

        <div style="text-align:right">
          <el-button type="primary" v-on:click="dialogSave()">确定</el-button>
          <el-button @click="dialogCancel()">退出</el-button>
        </div>

      </el-dialog>
    </div>
  </div>
</template>
  
<script>
import { videoPlayer } from 'vue-video-player';
import dayjs from "dayjs";
export default {
  components: {
    videoPlayer
  },
  data() {
    return {
      uuid: "",
      dialogImageUrl: '',//预览图片地址
      pictureVisible: false,//是否显示放大图片的对话框
      videoVisible: false,
      fileList: [],//图片文件列表
      videoList: [],

      account: this.$store.getters.getUser.id,
      //分页
      currentPage: 1,
      total: 10,//数据一共多少
      pageSize: 2,//每页显示的行数,默认为2
      //查询
      queryForm: {
        uuid: "",
        keyword: ""
      },
      queryOrNot: false,
      //对话框
      dialogVisible: false,//订单详细信息窗口
      dialogForm: {
        grade: 0,
        wordComment: "",
      },
      dialogTitle: "",
      //数据
      tableData: [],
      //视频！！！！
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: "video/mp4",
          src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" //你的视频地址（必填）
        }],
        poster: "", //你的封面地址
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true  //全屏按钮
        }
      }
    }
  },
  methods: {
    //////////////////////////////////////////////视频
    //删除前
    beforeRemoveVideo(file, fileList) {
      return this.$confirm(`确定删除 ${file.name}？`);
    },
    //删除完成
    handleRemoveVideo(file, fileList) {
      console.log(file, fileList);
    },
    //判断个数
    handleExceedVideo(files, fileList) {
      this.$message.warning(`最多上传1个视频`);
    },
    //预览视频
    handlePreviewVideo(file) {
      this.playerOptions.sources[0].src = URL.createObjectURL(file.raw);
      this.videoVisible = true;
    },
    handleuploadVideo(param) {
      this.videoList.push(param.file);
    },
    //上传视频前
    beforeUploadVideo(file, fileList) {
      var fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
      const types = ['mp4', 'ogg', 'webm'];//视频格式数组
      if (!types.includes(fileType)) {
        this.$message.error('上传视频只能是mp4/ogg/webm格式!');
        fileList.splice(-1, 1);
        return false;
      }
      if (file.size / 1024 / 1024 > 50) {
        this.$message.error('上传视频大小不能超过 50 MB!');
        fileList.splice(-1, 1);
        return false;
      }
      return true;
    },
    ///////////////////////////////////////////////////////////图片
    beforeRemove(file, fileList) {
      return this.$confirm(`确定删除 ${file.name}？`);
    },
    //删除图片
    handleRemove(file, fileList) {
      // this.fileList = fileList//更新删除图片的列表
      console.log(fileList)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`最多上传4张图片，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    //预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.pictureVisible = true;
    },
    handleupload(param) {
      // console.log(param.file)
      // 一般情况下是在这里创建FormData对象，但我们需要上传多个文件，为避免发送多次请求，因此在这里只进行文件的获取，param可以拿到文件上传的所有信息
      this.fileList.push(param.file);
    },

    //上传之前限制图片格式和大小
    beforeUpload(file, fileList) {
      var fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
      const types = ['jpeg', 'png', 'gif'];//图片格式数组
      if (!types.includes(fileType)) {
        this.$message.error('上传图片只能是jpg/png/gif格式!');
        fileList.splice(-1, 1);
        return false;
      }
      if (file.size / 1024 / 1024 > 2) {
        this.$message.error('上传图片大小不能超过 2 MB!');
        fileList.splice(-1, 1);
        return false;
      }
      return true;
    },
    dialogSave() {
      const _this = this
      if (this.dialogForm.grade === 0) {
        this.$message({
          message: "请选择评分！！",
          type: "error"
        });
      } else {
        // 上传评分和文字评价
        if (this.dialogForm.wordComment === "") {
          this.dialogForm.wordComment = "该用户觉得体验很好，给出了" + this.dialogForm.grade + "星评价"
        }
        this.$api.orderApi.AddEvaluate(this.uuid, this.dialogForm.grade, this.dialogForm.wordComment)
          .then(res => {
            console.log(res)
            _this.dialogForm.grade = 0
            _this.dialogForm.wordComment = ""
            _this.getAllAPI(this.pageSize, 1)
          }).catch(err => {
            console.log(err);
          });

        //上传图片！！！！！
        let formdata = new FormData()
        formdata.append("uuid", this.uuid)
        this.$refs.elupload.submit(); // 这里是执行文件上传的函数，其实也就是获取我们要上传的文件  
        this.fileList.forEach(item => {
          formdata.append("pictures", item)  //将每一个文件图片都加进formdata
        })
        // console.log(formdata)
        // console.log(formdata.getAll("picture"))
        this.$api.orderApi.UploadPictures(formdata)
          .then(res => {
            _this.fileList = []
            console.log(res)
          }).catch(err => {
            console.log(err);
          });

        //上传视频
        let videoform = new FormData()
        videoform.append("uuid", this.uuid)
        this.$refs.uploadVideo.submit(); // 这里是执行文件上传的函数，其实也就是获取我们要上传的文件  
        this.videoList.forEach(item => {
          videoform.append("video", item)  //将每一个文件图片都加进formdata
        })
        this.$api.orderApi.UploadVideo(videoform)
          .then(res => {
            console.log(res)
            _this.videoList = []
          }).catch(err => {
            console.log(err);
          });

        this.dialogVisible = false
      }
    },

    dialogCancel() {
      this.dialogVisible = false;//对话框不显示
    },
    handleClick(row_index) {
      this.uuid = this.tableData[row_index].uuid;
      this.dialogTitle = "订单：" + this.uuid;
      this.dialogVisible = true;
    },
    /////////////////////////////////////////////表格
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleCurrentChange(1);//默认更改每页多少条后重新加载第一页
    },

    handleCurrentChange() {
      if (this.queryOrNot === false) {
        this.getAllAPI(this.pageSize, this.currentPage)
      } else {
        if (this.queryForm.uuid === "" && this.queryForm.keyword !== "") {
          this.conditionQueryAPI(this.currentPage, "%", this.queryForm.keyword)
        } else if (this.queryForm.uuid !== "" && this.queryForm.keyword === "") {
          this.conditionQueryAPI(this.currentPage, this.queryForm.uuid, "%")
        } else {
          this.conditionQueryAPI(this.currentPage, this.queryForm.uuid, this.queryForm.keyword)
        }
      }
    },

    conditionQuery() {
      this.queryOrNot = true;
      if (this.queryForm.uuid === "" && this.queryForm.keyword === "") {
        this.getAllAPI(this.pageSize, 1)
        this.queryOrNot = false
      } else if (this.queryForm.uuid === "" && this.queryForm.keyword !== "") {
        this.conditionQueryAPI(1, "%", this.queryForm.keyword)
      } else if (this.queryForm.uuid !== "" && this.queryForm.keyword === "") {
        this.conditionQueryAPI(1, this.queryForm.uuid, "%")
      } else {
        this.conditionQueryAPI(1, this.queryForm.uuid, this.queryForm.keyword)
      }
      this.currentPage = 1
    },

    conditionQueryAPI(current, uuid, key) {
      const _this = this
      this.$api.orderApi.GetOrdersNumByConditionWithAccount(this.account, uuid, key, "300")
        .then(res => {
          if (res.data.code == 9000) {
            this.$message({
              message: res.data.message,
              type: "error"
            });
          } else if (res.data == 0) {
            _this.tableData = []
          } else {
            _this.total = res.data
            _this.$api.orderApi.GetOrdersByConditionWithAccount(_this.pageSize, current, _this.account, uuid, key, "300")
              .then(res => {
                _this.tableData = res.data
                for (let i = 0; i < _this.tableData.length; i++) {
                  _this.tableData[i].produceTime = dayjs(_this.tableData[i].produceTime).format("YYYY-MM-DD HH:mm:ss")
                  _this.tableData[i].reserveCheckInTime = dayjs(_this.tableData[i].reserveCheckInTime).format("YYYY-MM-DD HH:mm:ss")
                  _this.tableData[i].reserveCheckOutTime = dayjs(_this.tableData[i].reserveCheckOutTime).format("YYYY-MM-DD HH:mm:ss")
                  _this.tableData[i].price = _this.tableData[i].price / 100
                }
              }).catch(err => {
                console.log(err);
              });
          }
        }).catch(err => {
          console.log(err);
        });
    },

    getAllAPI(size, current) {
      const _this = this
      this.$api.orderApi.GetUnevaluatedOrdersNumByUserAccount(this.account)
        .then(res => {
          _this.total = res.data
        }).catch(err => {
          console.log(err);
        });
      this.$api.orderApi.GetUnevaluatedOrdersByUserAccount(size, current, this.account)
        .then(res => {
          _this.tableData = res.data
          for (let i = 0; i < _this.tableData.length; i++) {
            _this.tableData[i].produceTime = dayjs(_this.tableData[i].produceTime).format("YYYY-MM-DD HH:mm:ss")
            _this.tableData[i].reserveCheckInTime = dayjs(_this.tableData[i].reserveCheckInTime).format("YYYY-MM-DD HH:mm:ss")
            _this.tableData[i].reserveCheckOutTime = dayjs(_this.tableData[i].reserveCheckOutTime).format("YYYY-MM-DD HH:mm:ss")
            _this.tableData[i].price = _this.tableData[i].price / 100
          }
        }).catch(err => {
          console.log(err);
        });
    },
    onPlayerPlay(player) {
      // alert("play");
    },
    onPlayerPause(player) {
      // alert("pause");
    },
  },
  mounted() {
    // 初始时表格展示的数据
    this.getAllAPI(2, 1)
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    }
  }
}
</script>
  
<style scoped>
.orderTable {
  margin: auto;
  margin-top: 30px;
  width: 80%;
}

.orderQuery {
  text-align: right;
  margin: 10px 25px;

}

h3 {
  margin-left: 30px;
}
</style>