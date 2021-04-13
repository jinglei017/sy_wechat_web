
var logininf = JSON.parse(localStorage.getItem("logininf"));

$(function(){
    // 获取当前位置
    getLocationFun();
    /* 微信中不隐去.header */
    var ua = window.navigator.userAgent.toLowerCase();
    // if(ua.match(/MicroMessenger/i) == 'micromessenger'){
    //     $(".header").show();
    //     $(".main").css({
    //         "marginTop":"0.88rem"
    //     })
    // }
    /* 图表宽高 */
    $(window).load(function () {
        chartsWH();
    });

    /*库存统计——当前库存*/
    var param = {
        sortType : 'all'
    };
    ajaxRequest(wmsUrl + '/query/itemInventorySort?token='+logininf.token+'&timeStamp='+logininf.timeStamp,'post',param,'currentInventory','获取当前库存');

    /*tab 切换*/
    $(document).on('click','.tab-titles>li',function(){
        $(this).find('span').addClass('active');
        $(this).siblings('li').find('span').removeClass('active');
        var index = $(this).index();
        $('.tab-container .tab-content:eq(' + (index) + ')').show().siblings('.tab-content').hide();
        switch(index)
        {
            case 0:  // 库存统计——当前库存
               // ajaxRequest(wmsUrl + '/query/itemInventorySort?token='+logininf.token+'&timeStamp='+logininf.timeStamp+'&sortType=all','post','','currentInventory','获取当前库存');
                break;
            case 1: // 出库统计——默认显示 近一周
                outboundChartW11();
                $('.outSearchBtn:eq(0)').addClass('active').siblings('.outSearchBtn').removeClass('active');
                break;
            case 2: // 渠道统计——默认显示 近一周
                distribution1();
                $('.distSearchBtn:eq(0)').addClass('active').siblings('.distSearchBtn').removeClass('active');
                break;
        }
    });

    /*按钮点击*/
// search 出库统计
    $(document).on('click','.outSearchBtn',function(){
        $(this).addClass('active').siblings('.outSearchBtn').removeClass('active');
        var index = $(this).index();
        switch(index)
        {
            case 0:  // 近一周
                outboundChartW11();
                break;
            case 1:  // 近两周
                outboundChartW2();
                break;
            case 2:  // 近一月
                outboundChartM1();
                break;
        }
    });

// search 渠道统计
    $(document).on('click','.distSearchBtn',function(){
        $(this).addClass('active').siblings('.distSearchBtn').removeClass('active');
        var index = $(this).index();
        switch(index)
        {
            case 0:  // 近一周
                distribution1();
                break;
            case 1:  // 近两周
                distribution2();
                break;
            case 2:  // 近一月
                distribution3();
                break;
        }
    });

});


// 图表宽高
function chartsWH() {
    var w = $(window).width()*0.9;
    var w2 = $(window).width()*0.96;
    var h = $(window).height()*0.7;
    var h2 = $(window).height()*0.5;
    $('.eContainer').css({'width':w,'height':h});  // 出库统计柱状图
    $('.eContainer2').css({'width':w2,'height':h2});  // 渠道统计圆环图
}

// 库存统计
function currentInventory(response){

    if(response.result.top.length == 0){
        $('#inventoryChart_top').html(contentISBlank);
    }else{
        if(response.result.bottom.length == 0){
            $('#inventoryChart_bot').html(contentISBlank);
        }else{
            var InventoryGoods_t = response.result.top,InventoryGoods_b = response.result.bottom,GoodsLength_t = response.result.top.length,GoodsLength_b = response.result.bottom.length;

            /* 柱状图 */
            // top
            var curInventoryChart_t = echarts.init(document.getElementById('inventoryChart_top'));
            var chartTitle_t = '库存商品Top'+GoodsLength_t;
            var namesList_t = [];    //类别数组（用于存放饼图的类别）
            var seriesList_t = []; //数据数组（用于存放饼图的数据）
            $.each(InventoryGoods_t, function (index, item) {
                namesList_t.push(item.itemName);
                seriesList_t.push({
                    minUnit: item.unit1,
                    name: item.itemName,
                    value: Math.round(item.qty1)
                });
            });
            PageChartBarOption2(curInventoryChart_t,chartTitle_t,namesList_t,seriesList_t);
            curInventoryChart_t.hideLoading();

            // bot
            var curInventoryChart_b = echarts.init(document.getElementById('inventoryChart_bot'));
            var chartTitle_b = '库存商品Bottom'+GoodsLength_b;
            var namesList_b = [];    //类别数组（用于存放饼图的类别）
            var seriesList_b = []; //数据数组（用于存放饼图的数据）
            for (var i = (GoodsLength_b-1); i >=0; i--) {
                namesList_b.push(InventoryGoods_b[i].itemName);
                seriesList_b.push({
                    minUnit: InventoryGoods_b[i].unit1,
                    name: InventoryGoods_b[i].itemName,
                    value: Math.round(InventoryGoods_b[i].qty1)
                });
            }
            PageChartBarOption2(curInventoryChart_b,chartTitle_b,namesList_b,seriesList_b);
            curInventoryChart_b.hideLoading();

        }
    }
}

function bubbleSort(arr){  // 冒泡排序：比较数组元素的qty2
    for(var i = 0;i < arr.length - 1;i++){
        for(var j = 0;j < arr.length - 1 - i;j++){
            if(Number(arr[j].qty2) < Number(arr[j+1].qty2)){
                var temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
    return arr;
}

// 出库统计 —— 近一周
function outboundChartW11(){
    ajaxRequest(chartUrl + '/query/orderItemDeliverySort?token='+logininf.token+'&timeStamp='+logininf.timeStamp+'&sortType=all&orderType=TO'+'&startShpDate='+getCurrentTime(7)+'&endShpDate='+GetNowdate(),'get','','outboundChartW11Suc','获取近一周出库统计');
}

function outboundChartW11Suc(response) {
    /* top */
    var namesList_t = [],seriesList_t = [],namesList_b = [],seriesList_b = [];
    $.each(response.result.top, function (index, item) {
        namesList_t.push(item.itemName);
        seriesList_t.push({
            minUnit: item.unit1,
            name: item.itemName,
            value: Math.round(item.totalQty)
        });
    });
    $.each(response.result.bottom, function (index, item) {
        namesList_b.push(item.itemName);
        seriesList_b.push({
            minUnit: item.unit1,
            name: item.itemName,
            value: Math.round(item.totalQty)
        });
    });
    var myChart_t = echarts.init(document.getElementById('outboundChart_top'));
    PageChartBarOption2(myChart_t,'近一周出库Top10',namesList_t,seriesList_t);
    myChart_t.hideLoading();

    /* bot */
    var myChart_b = echarts.init(document.getElementById('outboundChart_bot'));
    PageChartBarOption2(myChart_b,'近一周出库Bottom10',namesList_b,seriesList_b);
    myChart_b.hideLoading();

}

// 出库统计 —— 近两周
function outboundChartW2(){
    ajaxRequest(chartUrl + '/query/orderItemDeliverySort?token='+logininf.token+'&timeStamp='+logininf.timeStamp+'&sortType=all&orderType=TO'+'&startShpDate='+getCurrentTime(14)+'&endShpDate='+GetNowdate(),'get','','outboundChartW2Suc','获取近两周出库统计');
}

function outboundChartW2Suc(response) {
    /* top */
    var namesList_t = [],seriesList_t = [],namesList_b = [],seriesList_b = [];
    $.each(response.result.top, function (index, item) {
        namesList_t.push(item.itemName);
        seriesList_t.push({
            minUnit: item.unit1,
            name: item.itemName,
            value: Math.round(item.totalQty)
        });
    });
    $.each(response.result.bottom, function (index, item) {
        namesList_b.push(item.itemName);
        seriesList_b.push({
            minUnit: item.unit1,
            name: item.itemName,
            value: Math.round(item.totalQty)
        });
    });
    var myChart_t = echarts.init(document.getElementById('outboundChart_top'));
    PageChartBarOption2(myChart_t,'近两周出库Top10',namesList_t,seriesList_t);
    myChart_t.hideLoading();

    /* bot */
    var myChart_b = echarts.init(document.getElementById('outboundChart_bot'));
    PageChartBarOption2(myChart_b,'近两周出库Bottom10',namesList_b,seriesList_b);
    myChart_b.hideLoading();

}

// 出库统计 —— 近一月
function outboundChartM1(){
    ajaxRequest(chartUrl + '/query/orderItemDeliverySort?token='+logininf.token+'&timeStamp='+logininf.timeStamp+'&sortType=all&orderType=TO'+'&startShpDate='+getCurrentTime(30)+'&endShpDate='+GetNowdate(),'get','','outboundChartM1Suc','获取近一月出库统计');
}

function outboundChartM1Suc(response) {
    /* top */
    var namesList_t = [],seriesList_t = [],namesList_b = [],seriesList_b = [];
    $.each(response.result.top, function (index, item) {
        namesList_t.push(item.itemName);
        seriesList_t.push({
            minUnit: item.unit1,
            name: item.itemName,
            value: Math.round(item.totalQty)
        });
    });
    $.each(response.result.bottom, function (index, item) {
        namesList_b.push(item.itemName);
        seriesList_b.push({
            minUnit: item.unit1,
            name: item.itemName,
            value: Math.round(item.totalQty)
        });
    });
    var myChart_t = echarts.init(document.getElementById('outboundChart_top'));
    PageChartBarOption2(myChart_t,'近一月出库Top10',namesList_t,seriesList_t);
    myChart_t.hideLoading();

    /* bot */
    var myChart_b = echarts.init(document.getElementById('outboundChart_bot'));
    PageChartBarOption2(myChart_b,'近一月出库Bottom10',namesList_b,seriesList_b);
    myChart_b.hideLoading();
}

// 渠道统计 —— 近一周
function distribution1(){ // 根据订单数 —— value：订单数
    ajaxRequest(chartUrl + '/query/orderTotalCountGroupByPartySort?token='+logininf.token+'&timeStamp='+logininf.timeStamp+'&sortType=all&orderType=TO'+'&startShpDate='+getCurrentTime(7)+'&endShpDate='+GetNowdate()+'&partyType=STO','get','','distribution1Suc','获取近一周渠道统计');
}

function distribution1Suc(response) {
    /* top */
    var seriesList_t = [],seriesList_b = [];
    $.each(response.result.top, function (index, item) {
        seriesList_t.push({
            itemNum: Math.round(item.totalCount),
            name: item.partyName+'('+Math.round(item.totalCount)+'单)',
            value: Math.round(item.totalCount)
        });
    });
    $.each(response.result.bottom, function (index, item) {
        seriesList_b.push({
            itemNum: Math.round(item.totalCount),
            name: item.partyName+'('+Math.round(item.totalCount)+'单)',
            value: Math.round(item.totalCount)
        });
    });

    var myChart_t = echarts.init(document.getElementById('distChart_top'));
    PageChartPieOption2(myChart_t,'','');  // 点击图形查看详情
    myChart_t.hideLoading();
    myChart_t.setOption({    //加载数据图表
        tooltip: {
            trigger: 'item',
            // formatter: "{a} <br/>{b}: {c} ({d}%)"
            formatter: function(params) {
                var res ='';
                var myseries = seriesList_t;
                for (var i = 0; i < myseries.length; i++) {
                    if(myseries[i].name==params.name){
                        //  res+=myseries[i].name+'<br/>'+' 订单数: '+myseries[i].value+'单</br>'+' 商品数: '+myseries[i].itemNum +'件</br>'+' 总费用: '+myseries[i].allMoney+'元</br>';
                        res+=myseries[i].name;
                    }

                }
                return res;
            },
            position: ['0','10%']
        },
        legend: {
        },
        graphic: {
            left: '38%',
            style: {
                text: '近一周Top5',
                fill: '#000',
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        series: [{
            data: seriesList_t
        }]
    });

    /* bot */
    var myChart_b = echarts.init(document.getElementById('distChart_bot'));
    PageChartPieOption2(myChart_b,'','');
    myChart_b.hideLoading();
    myChart_b.setOption({    //加载数据图表
        tooltip: {
            trigger: 'item',
            // formatter: "{a} <br/>{b}: {c} ({d}%)"
            formatter: function(params) {
                var res ='';
                var myseries = seriesList_b;
                for (var i = 0; i < myseries.length; i++) {
                    if(myseries[i].name==params.name){
                        res+=myseries[i].name;
                    }

                }
                return res;
            },
            position: ['0','10%']
        },
        legend: {
        },
        graphic: {
            left: '33%',
            style: {
                text: '近一周Bottom5',
                fill: '#000',
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        series: [{
            data: seriesList_b
        }]
    });
}

// 渠道统计 —— 近两周
function distribution2(){ // 根据订单数 —— value：订单数
    ajaxRequest(chartUrl + '/query/orderTotalCountGroupByPartySort?token='+logininf.token+'&timeStamp='+logininf.timeStamp+'&sortType=all&orderType=TO'+'&startShpDate='+getCurrentTime(14)+'&endShpDate='+GetNowdate()+'&partyType=STO','get','','distribution2Suc','获取近两周渠道统计');
}

function distribution2Suc(response) {
    /* top */
    var seriesList_t = [],seriesList_b = [];
    $.each(response.result.top, function (index, item) {
        seriesList_t.push({
            itemNum: Math.round(item.totalCount),
            name: item.partyName+'('+Math.round(item.totalCount)+'单)',
            value: Math.round(item.totalCount)
        });
    });
    $.each(response.result.bottom, function (index, item) {
        seriesList_b.push({
            itemNum: Math.round(item.totalCount),
            name: item.partyName+'('+Math.round(item.totalCount)+'单)',
            value: Math.round(item.totalCount)
        });
    });

    var myChart_t = echarts.init(document.getElementById('distChart_top'));
    PageChartPieOption2(myChart_t,'','');
    myChart_t.hideLoading();
    myChart_t.setOption({    //加载数据图表
        tooltip: {
            trigger: 'item',
            // formatter: "{a} <br/>{b}: {c} ({d}%)"
            formatter: function(params) {
                var res ='';
                var myseries = seriesList_t;
                for (var i = 0; i < myseries.length; i++) {
                    if(myseries[i].name==params.name){
                        res+=myseries[i].name;
                    }

                }
                return res;
            },
            position: ['0','10%']
        },
        legend: {
        },
        graphic: {
            left: '38%',
            style: {
                text: '近两周Top5',
                fill: '#000',
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        series: [{
            data: seriesList_t
        }]
    });

    /* bot */
    var myChart_b = echarts.init(document.getElementById('distChart_bot'));
    PageChartPieOption2(myChart_b,'','');
    myChart_b.hideLoading();
    myChart_b.setOption({    //加载数据图表
        tooltip: {
            trigger: 'item',
            // formatter: "{a} <br/>{b}: {c} ({d}%)"
            formatter: function(params) {
                var res ='';
                var myseries = seriesList_b;
                for (var i = 0; i < myseries.length; i++) {
                    if(myseries[i].name==params.name){
                        res+=myseries[i].name;
                    }

                }
                return res;
            },
            position: ['0','10%']
        },
        legend: {
        },
        graphic: {
            left: '33%',
            style: {
                text: '近两周Bottom5',
                fill: '#000',
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        series: [{
            data: seriesList_b
        }]
    });
}

// 渠道统计 —— 近一月
function distribution3(){ // 根据订单数 —— value：订单数
    ajaxRequest(chartUrl + '/query/orderTotalCountGroupByPartySort?token='+logininf.token+'&timeStamp='+logininf.timeStamp+'&sortType=all&orderType=TO'+'&startShpDate='+getCurrentTime(30)+'&endShpDate='+GetNowdate()+'&partyType=STO','get','','distribution3Suc','获取近一月渠道统计');
}

function distribution3Suc(response) {
    /* top */
    var seriesList_t = [],seriesList_b = [];
    $.each(response.result.top, function (index, item) {
        seriesList_t.push({
            itemNum: Math.round(item.totalCount),
            name: item.partyName+'('+Math.round(item.totalCount)+'单)',
            value: Math.round(item.totalCount)
        });
    });
    $.each(response.result.bottom, function (index, item) {
        seriesList_b.push({
            itemNum: Math.round(item.totalCount),
            name: item.partyName+'('+Math.round(item.totalCount)+'单)',
            value: Math.round(item.totalCount)
        });
    });

    var myChart_t = echarts.init(document.getElementById('distChart_top'));
    PageChartPieOption2(myChart_t,'','');
    myChart_t.hideLoading();
    myChart_t.setOption({    //加载数据图表
        tooltip: {
            trigger: 'item',
            // formatter: "{a} <br/>{b}: {c} ({d}%)"
            formatter: function(params) {
                var res ='';
                var myseries = seriesList_t;
                for (var i = 0; i < myseries.length; i++) {
                    if(myseries[i].name==params.name){
                        res+=myseries[i].name;
                    }

                }
                return res;
            },
            position: ['0','10%']
        },
        legend: {
        },
        graphic: {
            left: '38%',
            style: {
                text: '近一月Top5',
                fill: '#000',
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        series: [{
            data: seriesList_t
        }]
    });

    /* bot */
    var myChart_b = echarts.init(document.getElementById('distChart_bot'));
    PageChartPieOption2(myChart_b,'','');
    myChart_b.hideLoading();
    myChart_b.setOption({    //加载数据图表
        tooltip: {
            trigger: 'item',
            // formatter: "{a} <br/>{b}: {c} ({d}%)"
            formatter: function(params) {
                var res ='';
                var myseries = seriesList_b;
                for (var i = 0; i < myseries.length; i++) {
                    if(myseries[i].name==params.name){
                        res+=myseries[i].name;
                    }

                }
                return res;
            },
            position: ['0','10%']
        },
        legend: {
        },
        graphic: {
            left: '33%',
            style: {
                text: '近一月Bottom5',
                fill: '#000',
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        series: [{
            data: seriesList_b
        }]
    });
}


