// loadData('show');
var dictListDatas = [];
getLocationFun();      // 获取位置信息上传
var app = new Vue({
    el: '#vehicleApp',
    data: {
        logininf:{},
        driverOrderList:[{}],
        allPosArray:[]  // 所有的点 stoLatLng 数组
    },
    methods:{
        rowDrop(orderList) {	//已分配订单拖拽
            var tbody = document.querySelector('.driverOrderListRowDrop');
            var that = this;
            Sortable.create(tbody, {
                onEnd: function (evt) {  //拖拽结束发生该事件
                    that.driverOrderList.splice(evt.newIndex, 0, that.driverOrderList.splice(evt.oldIndex, 1)[0]);
                    var newArray = that.driverOrderList.slice(0);
                    that.driverOrderList = [];
                    that.$nextTick(function () {
                        that.driverOrderList = newArray;
                    });
                }
            })
        },
        sortOrderSortingFun(){ // 保存排序订单,生成货车规划路线
            var that = this,stoLatLngNullNum = that.allPosArray.length;
            if(stoLatLngNullNum == 0){
                loadData("show","未获取到订单收货经纬度，暂时无法规划路线！",true)
                return false;
            }
            if(stoLatLngNullNum > 10){
                loadData("show","收货点太多（大于10），暂时无法规划路线！",true)
                return false;
            }

        //    loadData('show');

            // ================= 高德
            /* map.clearMap();  // 清除地图上所有添加的覆盖物
             $('#panel').html('');
             var truckDriving = new AMap.TruckDriving({
                 map: map,
                 policy: 0, // 规划策略
                 size: 1, // 车型大小
                 width: 2.5, // 宽度
                 height: 2, // 高度
                 load: 1, // 载重
                 weight: 12, // 自重
                 axlesNum: 2, // 轴数
                 province: '沪', // 车辆牌照省份
                 isOutline: true,
                 outlineColor: '#ffeeee',
                 panel: 'panel'
             });
             var truckPath = [],startEndPosition = [],numm = 0;  // 路线路径（第一个、最后一个 对应 起点终点），起止点（起点和终点——发货地）

             for(var i = 0; i < this.driverOrderList.length;i++){
                 if(this.driverOrderList[i].sfrLatLng && numm == 0){
                     numm = 1;
                     var str = this.driverOrderList[i].sfrLatLng.split(',');
                     startEndPosition.push(str[0]);
                     startEndPosition.push(str[1]);
                 }
             }

             truckPath.push({lnglat:startEndPosition});  // push 起点

             for(var ii = 0; ii < that.allPosArray.length;ii++){
                 var string = that.allPosArray[ii].split(','),pointPosition = [];
                 pointPosition.push(string[0]);
                 pointPosition.push(string[1]);
                 truckPath.push({lnglat:pointPosition});
             }

             truckPath.push({lnglat:startEndPosition});  // push 终点
          //   console.log(truckPath.length);
             truckDriving.search(truckPath, function(status, result) {
                 // searchResult即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
                 if (status === 'complete') {
                     console.log('获取货车规划数据成功');
                 } else {
                     console.log('获取货车规划数据失败：' + result)
                 }
             });*/

            // ================= 百度 ++++++++++++++++++++++++++  限制：途经点不超过10个点
            map.clearOverlays();  // 清除地图上所有添加的覆盖物
            $('#r-result').html('');
            var endpointArray = [],waypointArray = [];  // 端点数组（起点和终点——发货地sfrLatLng），途经点数组（途经点——所有订单stoLatLng）
            for(var i = 0; i < this.driverOrderList.length;i++){
                var item = this.driverOrderList[i];
                if(item.stoLatLng){
                    var string0 = item.sfrLatLng.split(',');
                    if(endpointArray.length == 0){
                        getRequestBMap('/BMap-transformLocations/' + "?coords="+string0[0]+","+string0[1]+"&from=1&to=5&ak="+BmapQdAk,function(data){
                            if(data.result != undefined){
                                var pointItem0 = new BMap.Marker(new BMap.Point(data.result[0].x,data.result[0].y));
                                endpointArray.push(pointItem0);
                            }
                        });
                    }
                }
            }
            for(var ii = 0; ii < that.allPosArray.length;ii++){
                var item00 = that.allPosArray[ii];
                var string00 = item00.split(','),BMapLat00 = '',BMapLon00 = '';
                getRequestBMap('/BMap-transformLocations/' + "?coords="+string00[0]+","+string00[1]+"&from=1&to=5&ak="+BmapQdAk,function(data){
                    if(data.result != undefined){
                        BMapLat00 = data.result[0].x;
                        BMapLon00 = data.result[0].y;
                        var pointItem11 = new BMap.Marker(new BMap.Point(BMapLat00,BMapLon00));
                        waypointArray.push(pointItem11);
                    }
                });
            }
            var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, panel: "r-result",autoViewport: true}});
            driving.search(endpointArray[0], endpointArray[0],{waypoints:waypointArray});//waypoints表示途经点

            /*console.log(endpointArray);
            console.log(waypointArray);*/

            setTimeout(function() {
                $('.truckDriveContBtn').show();  // 可查看详细路线
                loadData('hide');
            },1000);

        },
        saveOrderSortingFun(){  // 保存排序订单
            var that = this;
            var newSortArray = [];
            for(var i = 0; i < this.driverOrderList.length;i++){
                newSortArray.push({
                    fromOrderId:this.driverOrderList[i].fromOrderId,
                    seq:i+1,
                    toOrderId:this.driverOrderList[i].omOrderId
                })
            }
            postRequest(tmsUrl+'/driver/update/tfoOrderLnkSeq.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp,newSortArray,function(res){
                var driverParam = {
                    orderNo:getUrlParam('orderNo'),
                    contactTel:getUrlParam('contactTel'),
                    eqpNo:getUrlParam('eqpNo'),
                    startCompleteTime:getTodayTime(),
                    endCompleteTime:getTodayTime()
                };
                postRequest(tmsUrl+'/driver/query/transportOrderPlanInfo.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp,driverParam,function(res){
                    if(res.result != null){
                        if(res.result.orderInfoResVoList != null){
                            if(res.result.orderInfoResVoList.length != 0){
                                that.rowDrop(res.result.orderInfoResVoList);
                                that.driverOrderList = res.result.orderInfoResVoList;
                            }else{
                                that.driverOrderList = [];
                            }
                        }else{
                            that.driverOrderList = [];
                        }
                    }else{
                        that.driverOrderList = [];
                    }
                });
            });
        },
        showLayerFun(){
            $(".searchLayer").show();
        },
        closeLayerFun(){
            $(".searchLayer").hide();
        },
        refreshFun(){
            window.location.reload();
        },
        orderInfoFun(driverOrderItem){
            var orderid = driverOrderItem.omOrderId,orderStatus;
            if(driverOrderItem.completeStatus == '1'){
                orderStatus = '1';
            }else{
                orderStatus = '0';
            }
            location.href = "orderInfo.html?orderid="+orderid+"&orderStatus="+orderStatus;
        }
    },
    created:function(){
        var driveInfomation = getUrlParam('eqpNo')+'-'+getUrlParam('contactName')+'-'+getUrlParam('contactTel');
        $(".header .txt").html(driveInfomation);
        $("title").html(driveInfomation);

        var that = this,newArray = [],cenArray = [];
        that.logininf = JSON.parse(localStorage.getItem("logininf"));

        //获取订单列表
        var driverParam = {
            orderNo:getUrlParam('orderNo'),
            contactTel:driveInfomation.split('-')[2],
            eqpNo:driveInfomation.split('-')[0],
            startCompleteTime:getTodayTime(),
            endCompleteTime:getTodayTime()
        };
        postRequest(tmsUrl+'/driver/query/transportOrderPlanInfo',driverParam,function(res){
            orderReceiptMarkerArray = []; //标记订单点集合  清空

            that.allPosArray = [];  // 所有的点 stoLatLng 数组
            var newAllPosArray = [];  // 所有的点 stoLatLng 数组

            // ================= 高德
            /*map.clearMap();  // 清除地图上所有添加的覆盖物
            $('#panel').html('');*/

            // ================= 百度
            map.clearOverlays();  // 清除地图上所有添加的覆盖物
            $('#r-result').html('');

            if(res.result != null){
                if(res.result.orderInfoResVoList != null){
                    if(res.result.orderInfoResVoList.length != 0){
                        that.rowDrop(res.result.orderInfoResVoList);
                        that.driverOrderList = res.result.orderInfoResVoList;

                        var orderInfoList = res.result.orderInfoResVoList;

                        // 选出所有的点（可能订单有相同点（stoLatLng））
                        for(var r=0;r<orderInfoList.length;r++){
                            var rItem = orderInfoList[r];
                            if(rItem.stoLatLng){
                                var par = {
                                    stoLatLng: rItem.stoLatLng,
                                    stoAddress:rItem.stoAddress
                                };
                                newAllPosArray.push(rItem.stoLatLng);
                            }
                        }
                        that.allPosArray = quArraySameItemFun(newAllPosArray);

                        var bcTotalQWV = localStorage.getItem("bcTotalQWV");
                        var na = that.allPosArray.length;
                        $(".carAmountInf").html("<span style='color: red;'>"+na+"个送货点</span>"+" - 整车件毛体：" + bcTotalQWV);

                        // 标记订单点

                        // ================= 高德
                        /*for(var j = 0,orderReceiptMarker; j < orderInfoList.length; j++){   // 标记单个订单
                            var item = orderInfoList[j],stoPosition = [];
                            if(item.stoLatLng){
                                var string = item.stoLatLng.split(','),newDiv = document.createElement("div");
                                stoPosition.push(string[0]);
                                stoPosition.push(string[1]);

                                orderReceiptMarker = new AMap.Marker({
                                    map: map,
                                    position: stoPosition
                                });

                                if(item.completeStatus == '1'){  // 完成
                                    newDiv.innerHTML = '<img src="https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png"/>'; // 15px-24px ; 13px-21px ; 14px-22px
                                    orderReceiptMarker.content = '<p class="font_14"><span>收货商：</span><span>'+item.stoPartyName+'</span></p>'+
                                        '<p class="font_14"><span>完成状态：</span><span class="done2">完成</span></p>';
                                }else{
                                    newDiv.innerHTML = '<img src="https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png"/>'; // 15px-24px ; 13px-21px ; 14px-22px
                                    orderReceiptMarker.content = '<p class="font_14"><span>收货商：</span><span>'+item.stoPartyName+'</span></p>'+
                                        '<p class="font_14"><span>完成状态：</span><span class="no_done">未完成</span></p>';
                                }

                                orderReceiptMarker.setContent(newDiv);  //更新点标记内容

                                /!*orderReceiptMarker.on('click', signalOrderClick);
                                orderReceiptMarker.emit('click', {target: orderReceiptMarker});*!/
                                orderReceiptMarkerArray.push(orderReceiptMarker);
                            }
                        }*/

                        // ================= 百度
                        for(var i=0;i<orderInfoList.length;i++){
                            var item = orderInfoList[i];
                            if(item.stoLatLng){
                                var string = item.stoLatLng.split(','),BMapLat = '',BMapLon = '';
                                getRequestBMap('/BMap-transformLocations/' + "?coords="+string[0]+","+string[1]+"&from=1&to=5&ak="+BmapQdAk,function(data){
                                    if(data.result != undefined){
                                        BMapLat = data.result[0].x;
                                        BMapLon = data.result[0].y;
                                    }
                                });
                                var myIcon;
                                if(item.completeStatus == '1'){  // 完成
                                    myIcon = new BMap.Icon("../images/mark_b.png", new BMap.Size(22,40));
                                }else{
                                    myIcon = new BMap.Icon("../images/mark_r.png", new BMap.Size(22,40));
                                }

                                var marker = new BMap.Marker(new BMap.Point(BMapLat,BMapLon),{icon:myIcon});  // 创建标注
                                var content = '收货商：'+item.stoPartyName;
                                if(item.completeStatus == '1'){  // 完成
                                    content += '<br>完成状态：<span class="done2">完成</span>';
                                }else{
                                    content += '<br>完成状态：<span class="no_done">未完成</span>';
                                }
                                map.addOverlay(marker);               // 将标注添加到地图中
                                //    addClickHandler(content,marker);
                            }
                        }

                    }else{
                        that.driverOrderList = [];
                    }
                }else{
                    that.driverOrderList = [];
                }
            }else{
                that.driverOrderList = [];
            }

         //   loadData('hide');

        });

    }
});


// ================= 高德
// 地图
/*var map = new AMap.Map("container", {
    mapStyle: 'amap://styles/692385c0456b39aa7ddc41e56c88596f',
    zoom: 11
});
var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)}); //信息窗体
var orderReceiptMarkerArray = []; //标记订单点集合
function signalOrderClick(e) {
    infoWindow.setContent(e.target.content);
    infoWindow.open(map, e.target.getPosition());
}*/


// ================= 百度
// 百度地图API功能
var map = new BMap.Map("allmap");
map.centerAndZoom(new BMap.Point(121.473658,31.230378), 11);
map.enableScrollWheelZoom(true);

var opts = {
    width : 250,     // 信息窗口宽度
    height: 80,     // 信息窗口高度
    title : "订单信息" , // 信息窗口标题
    enableMessage:true//设置允许信息窗发送短息
};
function addClickHandler(content,marker){
    marker.addEventListener("click",function(e){
        openInfo(content,e)}
    );
}
function openInfo(content,e){
    var p = e.target;
    var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
    var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
    map.openInfoWindow(infoWindow,point); //开启信息窗口
}

//根据  tableName  columnName  匹配基础数据
function getDictDataLists(tableName,columnName){
    var listData = [];
    for(var i = 0;i < dictListDatas.length;i++){
        if(dictListDatas[i].tableName == tableName && dictListDatas[i].columnName == columnName){
            listData.push(dictListDatas[i]);
        }
    }
    return listData;
}
