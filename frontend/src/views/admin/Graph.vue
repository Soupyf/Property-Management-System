<template>
    <div>
        <div
            :style="{ float: 'center', width: '100%', height: '40px', 'padding-bottom': '1px', 'padding-top': '20px', 'font-size': '20px', 'text-align': 'center' }">
            当周七天订单交易额
        </div>
        <div class="echart" id="weeklySumByDate"
            :style="{ float: 'center', width: '100%', height: '400px', 'padding-bottom': '50px' }">
        </div>
        <div
            :style="{ float: 'center', width: '100%', height: '40px', 'padding-bottom': '1px', 'padding-top': '20px', 'font-size': '20px', 'text-align': 'center' }">
            当周七天订单各房型交易额
        </div>

        <div class="echart" id="weeklySumByRoom"
            :style="{ float: 'center', width: '100%', height: '400px', 'padding-bottom': '50px', 'padding-top': '50px' }">
        </div>

        <div
            :style="{ float: 'center', width: '100%', height: '40px', 'padding-bottom': '1px', 'padding-top': '20px', 'font-size': '20px', 'text-align': 'center' }">
            当周七天订单成交数量统计
        </div>

        <div class="echart" id="weeklyCountByDate"
            :style="{ float: 'center', width: '100%', height: '400px', 'padding-bottom': '50px', 'padding-top': '50px' }">
        </div>
        <div
            :style="{ float: 'center', width: '100%', height: '40px', 'padding-bottom': '1px', 'padding-top': '20px', 'font-size': '20px', 'text-align': 'center' }">
            当周七天订单成交各房型数量统计
        </div>
        <div class="echart" id="weeklyCountByRoom"
            :style="{ float: 'center', width: '100%', height: '400px', 'padding-bottom': '50px', 'padding-top': '50px' }">
        </div>

    </div>
</template>

<script>
import * as echarts from "echarts";

export default {
    data() {
        return {
            option2: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: ['BarrierFree', 'Deluxe', 'Double', 'Quadruple', 'Single', 'Triple']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value'
                },
                yAxis: {
                    type: 'category',
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                },
                series: [
                    {
                        name: 'BarrierFree',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [320, 302, 301, 334, 390, 330, 320]
                    },
                    {
                        name: 'Deluxe',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: 'Double',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: 'Quadruple',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [150, 212, 201, 154, 190, 330, 410]
                    },
                    {
                        name: 'Single',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [820, 832, 901, 934, 1290, 1330, 1320]
                    },
                    {
                        name: 'Triple',
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [820, 832, 901, 934, 1290, 1330, 1320]
                    }
                ]
            },
            option1: {
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                        z: 100,
                        shadowStyle: {
                            shadowColor: "rgba(167, 167, 167, 1)",
                            shadowBlur: 10,
                            color: "rgba(255, 255, 255, 1)"
                        }
                    },
                    formatter: function (params) {
                        console.log(params)
                    },
                },
                grid: {
                    top: 20,
                    bottom: 20,
                    left: 30,
                    right: 20
                },
                xAxis: [{
                    type: 'category',
                    axisTick: {
                        show: false,
                        alignWithLabel: true,
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#889fcc"
                        }
                    },
                    data: []
                }],
                yAxis: [{
                    type: 'value',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "rgba(136, 159, 204, .2)"
                        }
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: "#889fcc"
                        }
                    },
                    axisTick: {
                        show: false
                    },
                }],
                series: [
                    {
                        data: [0, 0, 0, 0, 0, 2, 3],
                        z: 200,
                        type: 'line',
                        smooth: true,
                        symbolSize: 15,
                        showSymbol: false,
                        itemStyle: {
                            normal: {
                                show: false,
                                color: "#3282FF", //改变折线点的颜色
                                lineStyle: {
                                    color: "#3282FF" //改变折线颜色
                                },
                                label: {
                                    show: false, //开启显示
                                    position: 'top', //在上方显示
                                    textStyle: { //数值样式
                                        color: '#999999',
                                        fontSize: 10
                                    }
                                },

                            },
                            emphasis: {
                                show: true,
                                color: "#3282FF",
                                borderColor: "#ffffff",
                                label: {
                                    show: true, //开启显示
                                    position: 'top', //在上方显示
                                    textStyle: { //数值样式
                                        color: '##fff',
                                        fontSize: 14,
                                    }
                                }
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    0,
                                    1,
                                    [{
                                        offset: 0,
                                        color: 'rgba(50,130,255,0.3)'
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(50,130,255,0)'
                                    }
                                    ],
                                    false
                                ),
                                shadowColor: 'rgba(59, 34, 201,1)',
                                shadowBlur: 10
                            }
                        },

                    },
                    {
                        z: 200,
                        type: 'bar',
                        barWidth: '5',
                        itemStyle: {
                            normal: {
                                color: "transparent"
                            },
                            emphasis: {
                                color: '#2B75D4',
                            }
                        },
                    }
                ]
            },
        }
    },
    mounted() {
        this.init()
        window.addEventListener("resize", () => {
            weeklySumByDate.resize();
        })
    },
    methods: {
        init() {
            let weeklySumByDate = echarts.init(document.getElementById("weeklySumByDate"));
            this.$api.adminApi.getWeekOrderSumByNow()
                .then(res => {
                    var copy = res.data
                    this.option1.xAxis[0].data = copy.date
                    for (let i = 0; i < 7; i++) {
                        this.option1.series[0].data[i] = (copy.count[i] / 100)
                        }
                    
                    // console.log(this.option1.xAxis[0].data)
                    // console.log(this.option1.series[0].data)
                    weeklySumByDate.setOption(this.option1);// 渲染页面
                }).catch(err => {
                    console.log(err);
                });// 图标初始化

            //随着屏幕大小调节图表
            window.addEventListener("resize", () => {
                weeklySumByDate.resize();
            })

            let weeklySumByRoom = echarts.init(document.getElementById("weeklySumByRoom"));// 图标初始化

            this.$api.adminApi.getWeekOrderSumByRoomNow()
                .then(res => {
                    console.log(this.option2.series[0].data)
                    // var copy = res.data
                    this.option2.yAxis.data = res.data.date
                    for (let i = 0; i < 7; i++) {
                        this.option2.series[0].data[i] = (res.data.count.BarrierFree[i] / 100)
                        }
                    for (let i = 0; i < 7; i++) {
                        this.option2.series[1].data[i] = (res.data.count.Deluxe[i] / 100)
                    }
                    for (let i = 0; i < 7; i++) {
                        this.option2.series[2].data[i] = (res.data.count.Double[i] / 100)
                    }
                    for (let i = 0; i < 7; i++) {
                        this.option2.series[3].data[i] = (res.data.count.Quadruple[i] / 100)
                    }
                    for (let i = 0; i < 7; i++) {
                        this.option2.series[4].data[i] = (res.data.count.Single[i] / 100)
                    }
                    for (let i = 0; i < 7; i++) {
                        this.option2.series[5].data[i] = (res.data.count.Triple[i] / 100)
                    }
                    // this.option2.series[0].data = res.data.count.BarrierFree
                    // this.option2.series[1].data = res.data.count.Deluxe
                    // this.option2.series[2].data = res.data.count.Double
                    // this.option2.series[3].data = res.data.count.Quadruple
                    // this.option2.series[4].data = res.data.count.Single
                    // this.option2.series[5].data = res.data.count.Triple
                    weeklySumByRoom.setOption(this.option2);// 渲染页面
                }).catch(err => {
                    console.log(err);
                });// 图标初始化
            //随着屏幕大小调节图表
            window.addEventListener("resize", () => {
                weeklySumByRoom.resize();
            })


            let weeklyCountByDate = echarts.init(document.getElementById("weeklyCountByDate"));
            this.$api.adminApi.getWeekOrderCountByNow()
                .then(res => {
                    var copy = res.data
                    this.option1.xAxis[0].data = copy.date
                    this.option1.series[0].data = copy.count
                    console.log(this.option1.xAxis[0].data)
                    console.log(this.option1.series[0].data)
                    weeklyCountByDate.setOption(this.option1);// 渲染页面
                }).catch(err => {
                    console.log(err);
                });// 图标初始化

            //随着屏幕大小调节图表
            window.addEventListener("resize", () => {
                weeklyCountByDate.resize();
            })


            let weeklyCountByRoom = echarts.init(document.getElementById("weeklyCountByRoom"));// 图标初始化

            this.$api.adminApi.getWeekOrderCountByRoomNow()
                .then(res => {
                    console.log(this.option2.series[0].data)
                    // var copy = res.data
                    this.option2.yAxis.data = res.data.date
                    this.option2.series[0].data = res.data.count.BarrierFree
                    this.option2.series[1].data = res.data.count.Deluxe
                    this.option2.series[2].data = res.data.count.Double
                    this.option2.series[3].data = res.data.count.Quadruple
                    this.option2.series[4].data = res.data.count.Single
                    this.option2.series[5].data = res.data.count.Triple
                    weeklyCountByRoom.setOption(this.option2);// 渲染页面
                }).catch(err => {
                    console.log(err);
                });// 图标初始化
            //随着屏幕大小调节图表
            window.addEventListener("resize", () => {
                weeklyCountByRoom.resize();
            })



        }
    }



}
</script>


<style>
.el-header,
.el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
}

.el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 400px;
    width: auto;
}

body>.el-container {
    margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
    line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
    line-height: 320px;
}
</style>