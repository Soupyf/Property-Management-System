<template>
    <!-- xtbork7986@sandbox.com -->
</template>
<script>
export default {
    mounted() {
        var form = this.$route.query.html;
        const div = document.createElement("div");
        div.innerHTML = form; //此处form就是后台返回接收到的数据
        document.body.appendChild(div);
        document.forms[0].submit();//进行表单提交 跳转
    }
}
</script>
<style scoped>

</style>