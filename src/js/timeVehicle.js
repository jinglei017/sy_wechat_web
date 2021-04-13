var app = new Vue({
    el: '#timeVehicleApp',
    data: {
        logininf: {},
        generalInfo: {},
        tableOrderList: [],
        isSearchLayer: false,
        totalNum: 0,
        pageNumVal: 1
    },
    methods:{
        // 订单搜索
        getSearchVal(page){
            var that = this;
            var startTime = $("#startTime").val().trim();
            if(startTime == "" || startTime == undefined){
                loadData('show', '请输入您要查找的日期', true);
                return false;
            }
            that.pageNumVal = page;
            var searchFormArr = {
                startCompleteTime: startTime,
                endCompleteTime: startTime,
                pageInfo: {
                    pageNum:that.pageNumVal,
                    pageSize:30
                }
            };
            that.generalInfo = {};
            that.tableOrderList = [];
            that.showTimeSpan = startTime;
            //获取订单列表
            postRequest(tmsUrl + "/wx/query/transportCostInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.generalInfo = res.result;
                if(res.result.pageModel.data != null && res.result.pageModel.data.length > 0){
                    that.tableOrderList = res.result.pageModel.data;
                }
                that.totalNum = res.result.pageModel.pageInfo.pages;
                that.isSearchLayer = false;
            })
        },
        // 翻页
        onScroll(){
            var that = this;
            if($(".main #tableBodyDetails").outerHeight() - $(".main").scrollTop() - $(".main").height() < 10){
                if($(".ajax-loder-wrap").length > 0){
                    return false;
                }
                if(that.pageNumVal < 3){
                    that.pageNumVal = parseInt(that.pageNumVal) + parseInt(1);
                    that.getSearchVal(that.pageNumVal);
                }
            }
        },
        returnBack(){
            if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                location.href = wechatUrl + "/syOauth2Login.html?r=/index.html";
            }else{
                location.href = "index.html";
            }
        },
        openSearch(){
            var that = this;
            that.isSearchLayer = !that.isSearchLayer;
        }
    },
    created:function(){
        var that = this;
        that.showTimeSpan = getQueryTime(1);
        $("#startTime").attr("value",getQueryTime(1));
        var searchFormArr = {
            pageInfo:{
                pageNum:1,
                pageSize:30
            },
            startCompleteTime:getQueryTime(1),
            endCompleteTime:getQueryTime(1)
        };
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        //获取订单列表
        postRequest(tmsUrl + "/wx/query/transportCostInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
            that.generalInfo = res.result;
            if(res.result.pageModel.data != null && res.result.pageModel.data.length > 0){
                that.tableOrderList = res.result.pageModel.data;
            }
            that.totalNum = res.result.pageModel.pageInfo.pages;
        })
    },
    filters:{
        formatSeconds(value) { //秒转换成小时+分钟+秒
            var theTime = parseInt(value);// 需要转换的时间秒
            var theTime1 = 0;// 分
            var theTime2 = 0;// 小时
            if(theTime > 60) {
                theTime1 = parseInt(theTime/60);
                theTime = parseInt(theTime%60);
                if(theTime1 > 60) {
                    theTime2 = parseInt(theTime1/60);
                    theTime1 = parseInt(theTime1%60);
                }
            }
            var result = '';
            if(theTime > 0){
                result = ""+parseInt(theTime)+"秒";
            }
            if(theTime1 > 0) {
                result = ""+parseInt(theTime1)+"分"+result;
            }
            if(theTime2 > 0) {
                result = ""+parseInt(theTime2)+"小时"+result;
            }
            return result;
        }
    }
});
$(function(){
    // 获取当前位置
    getLocationFun();
    /* 微信中不隐去.header */
    var ua = window.navigator.userAgent.toLowerCase();
});
