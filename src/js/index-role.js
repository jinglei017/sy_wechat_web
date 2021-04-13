$(function () {
    created();

    function created() {
        var mainContent = "<ul>" +
            "        <li class='inventoryLi meauShowPermission' objectCode='/inventory.html'>" +
            "            <a href='javascript:;' hrefUrl='inventory.html'>" +
            "                <p class='pic'><img src='images/index_pic_9.png' alt=''/></p>" +
            "                <p class='txt'>库存</p>" +
            "            </a>" +
            "        </li>" +
            "        <li class='costLi meauShowPermission' objectCode='/orderStatList-client.html?orderstate=4'>" +
            "            <a href='javascript:;' hrefUrl='orderStatList-client.html?orderstate=4'>" +
            "                <p class='pic'><img src='images/ordericon1.png' alt=''/></p>" +
            "                <p class='txt'>我的订单</p>" +
            "            </a>" +
            "        </li>" +
            "        <li class='statisticsLi meauShowPermission' objectCode='/statistical.html'>" +
            "            <a href='javascript:;' hrefUrl='statistical.html'>" +
            "                <p class='pic'><img src='images/index_pic_1.png' alt=''/></p>" +
            "                <p class='txt'>统计</p>" +
            "            </a>" +
            "        </li>" +
            "        <li class='costLi meauShowPermission' objectCode='/newOrder.html?a=6'>" +
            "            <a href='javascript:;' hrefUrl='newOrder.html?a=6'>" +
            "                <p class='pic'><img src='images/my_icon_01.png' alt=''/></p>" +
            "                <p class='txt'>我要下单</p>" +
            "            </a>" +
            "        </li>" +
            "        <li class='costLi meauShowPermission' objectCode='/newOrderDj.html'>" +
            "            <a href='javascript:;' hrefUrl='newOrderDj.html'>" +
            "                <p class='pic'><img src='images/my_icon_01.png' alt=''/></p>" +
            "                <p class='txt'>在线下单</p>" +
            "            </a>" +
            "        </li>" +
            "        <li class='costLi meauShowPermission' objectCode='/newOrderShip.html'>" +
            "            <a href='javascript:;' hrefUrl='newOrderShip.html'>" +
            "                <p class='pic'><img src='images/my_icon_01.png' alt=''/></p>" +
            "                <p class='txt'>我要下单</p>" +
            "            </a>" +
            "        </li>" +
            "        <li class='distributionLi meauShowPermission' objectCode='/orderStat.html'>" +
            "            <a href='javascript:;' hrefUrl='orderStat.html'>" +
            "                <p class='pic'><img src='images/index_pic_13.png' alt=''/></p>" +
            "                <p class='txt'>配送订单</p>" +
            "            </a>" +
            "        </li>" +
            "        <li class='distributionLi meauShowPermission' objectCode='/orderStat-tpls.html'>" +
            "            <a href='javascript:;' hrefUrl='orderStat-tpls.html'>" +
            "                <p class='pic'><img src='images/index_pic_13.png' alt=''/></p>" +
            "                <p class='txt'>配送订单</p>" +
            "            </a>" +
            "        </li>" +
            "        <li class='inventoryLi meauShowPermission' objectCode='/orderCostListDj00.html'>" +
            "            <a href='javascript:;' hrefUrl='orderCostListDj00.html'>" +
            "                <p class='pic'><img src='images/index_pic_11.png' alt=''/></p>" +
            "                <p class='txt'>应收费用</p>" +
            "            </a>" +
            "        </li>" +
            "        <li class='abnormalLi meauShowPermission' objectCode='/abnormalOrder.html'>" +
            "            <a href='javascript:;' hrefUrl='abnormalOrder.html'>" +
            "                <p class='pic'><img src='images/index_pic_14.png' alt=''/></p>" +
            "                <p class='txt'>异常</p>" +
            "            </a>" +
            "        </li>" +
            "        <li class='inventoryLi meauShowPermission' objectCode='/inventory-tpls.html'>" +
            "            <a href='javascript:;' hrefUrl='inventory-tpls.html'>" +
            "                <p class='pic'><img src='images/index_pic_9.png' alt=''/></p>" +
            "                <p class='txt'>库存</p>" +
            "            </a>" +
            "        </li>" +
            "        <li class='inventoryLi meauShowPermission' objectCode='/workTaskListDj1.html'>" +
            "            <a href='javascript:;' hrefUrl='workTaskListDj1.html'>" +
            "                <p class='pic'><img src='images/index_pic_19.png' alt=''/></p>" +
            "                <p class='txt'>待揽货列表</p>" +
            "            </a>" +
            "        </li>" +
            "        <li class='vehicleLi meauShowPermission' objectCode='/vehicle.html'>" +
            "            <a href='javascript:;' hrefUrl='vehicle.html?v=" + verson + "'>" +
            "                <p class='pic'><img src='images/ordericon3.png' alt=''/></p>" +
            "                <p class='txt'>运输监控</p>" +
            "            </a>" +
            "        </li>" +
            "        <li class='myTaskLi meauShowPermission' objectCode='/allOrder.html'>" +
            "            <a href='javascript:;' hrefUrl='allOrder.html'>" +
            "                <p class='pic'><img src='images/index_pic_3.png' alt=''/></p>" +
            "                <p class='txt'>我是司机</p>" +
            "            </a>" +
            "        </li>" +
            "        <li class='myTaskLi meauShowPermission' objectCode='/material.html'>" +
            "            <a href='javascript:;' hrefUrl='material.html'>" +
            "                <p class='pic'><img src='images/index_pic_15.png' alt=''/></p>" +
            "                <p class='txt'>班次物料</p>" +
            "            </a>" +
            "        </li>" +
            "        <li class='myTaskLi meauShowPermission' objectCode='/myDelivery.html'>" +
            "            <a href='javascript:;' hrefUrl='myDelivery.html'>" +
            "                <p class='pic'><img src='images/index_pic_19.png' alt=''/></p>" +
            "                <p class='txt'>我的订单</p>" +
            "            </a>" +
            "        </li>" +
            "        <li class='abnormalLi meauShowPermission' objectCode='/abnormal.html'>" +
            "            <a href='javascript:;' hrefUrl='abnormal.html'>" +
            "                <p class='pic'><img src='images/index_pic_14.png' alt=''/></p>" +
            "                <p class='txt'>异常任务</p>" +
            "            </a>" +
            "        </li>" +
            "        <li class='costLi meauShowPermission' objectCode='/allOrder5.html'>" +
            "            <a href='javascript:;' hrefUrl='allOrder5.html'>" +
            "                <p class='pic'><img src='images/ordericon1.png' alt=''/></p>" +
            "                <p class='txt'>全部任务</p>" +
            "            </a>" +
            "        </li>" +
            "        <li class='myTaskLi meauShowPermission' objectCode='/workTaskDj0.html'>" +
            "            <a href='javascript:;' hrefUrl='workTaskDj0.html'>" +
            "                <p class='pic'><img src='images/index_pic_3.png' alt=''/></p>" +
            "                <p class='txt'>接单揽货</p>" +
            "            </a>" +
            "        </li>" +
            "        <li class='aboutSuye meauShowPermission' objectCode='/drivePath.html'>" +
            "            <a href='javascript:;' hrefUrl='drivePath.html'>" +
            "                <p class='pic'><img src='images/pathImg.png' alt=''/></p>" +
            "                <p class='txt'>路线规划</p>" +
            "            </a>" +
            "        </li>" +
            "        <li class='aboutSuye meauShowPermission' objectCode='/aboutUs.html'>" +
            "            <a href='javascript:;' hrefUrl='aboutUs.html'>" +
            "                <p class='pic'><img src='images/index_pic_4.png' alt=''/></p>" +
            "                <p class='txt'>关于我们</p>" +
            "            </a>" +
            "        </li>" +
            "    </ul>";
        $(".main").append(mainContent)
    }

    // 获取当前位置
    getLocationFun();

    var ua = window.navigator.userAgent.toLowerCase();
    var myDate = new Date();
    //获取当前年
    var year = myDate.getFullYear();
    //获取当前月
    var month = myDate.getMonth() + 1;
    //获取当前日
    var date = myDate.getDate();
    var todayTime = year + '-' + p(month) + '-' + p(date);
    var merchantInf;
    localStorage.removeItem("vehicleDate");

    getWxUserPower();

    function initIndexRole() {
        var urlCallback = "/bind_member.html";
        var logininf = localStorage.getItem("logininf");
        // 获取角色首页
        var roleId = localStorage.getItem("roleId");
        var userInfo = JSON.parse(logininf);
        if (userInfo != null && userInfo.tenantName != null && userInfo.tenantName !== '') {
            $("title").html(userInfo.tenantName);
        }
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            if (logininf == "" || logininf == null || logininf == undefined || logininf == "null" || logininf == "undefined") {
                $(".orderClassify .userInfo img").attr("src", "images/moren_tx.png");
                $(".orderClassify .userInfo .txt").html("绑定微信");
            } else {
                $(".orderClassify .userInfo img").attr("src", "images/moren_tx_l.png");
                $(".orderClassify .userInfo .txt").html("更换账号");
            }
            urlCallback = wechatUrl + "/syOauth2Login.html?r=" + urlCallback;
        } else {
            if (logininf == "" || logininf == null || logininf == undefined || logininf == "null" || logininf == "undefined") {
                $(".orderClassify .userInfo img").attr("src", "images/moren_tx.png");
                $(".orderClassify .userInfo .txt").html("登录");
            } else {
                $(".orderClassify .userInfo img").attr("src", "images/moren_tx_l.png");
                $(".orderClassify .userInfo .txt").html("退出登录");
            }
        }
        $(".indexContent ul li").click(function () {
            var hrefUrl = $(this).children("a").attr("hrefUrl");
            if (logininf == "" || logininf == null || logininf == undefined || logininf == "null" || logininf == "undefined") {
                location.href = urlCallback;
            } else {
                if ($(this).hasClass("qrCode")) {

                } else {
                    location.href = hrefUrl;
                }
            }
        });
        $(".orderClassify .userInfo").click(function () {
            logininf = localStorage.getItem("logininf");
            mui.confirm('退出登录？', '提示', ['取消', '确认'], function (e) {
                if (e.index == 1) {
                    if (logininf != null) {
                        var userInfo = JSON.parse(logininf);
                        getRequest(umsUrl + "/user/logout?token=" + userInfo.token, function () {
                        })
                    }
                    location.href = urlCallback;
                }
            })
        });
        $(".orderClassify ul li").click(function () {
            var hrefUrl = $(this).attr("hrefUrl");
            if (logininf == "" || logininf == undefined || logininf == null || logininf == "null" || logininf == "undefined") {
                location.href = urlCallback
            } else {
                location.href = hrefUrl
            }
        });
        setTimeout(function () {
            if (roleId == "0") {
                merchantInf = {
                    tenantId: userInfo.umTenantId,
                    orderType: "TO",
                    startTime: todayTime + " 00:00:00",
                    endTime: todayTime + " 23:59:59"
                };
                meauFunction("USERPARTYMOBILE");
                getOrderNum();
            } else {
                merchantInf = {
                    tenantId: userInfo.umTenantId,
                    orderType: "DO",
                    startTime: todayTime + " 00:00:00",
                    endTime: todayTime + " 23:59:59"
                };
                meauFunction("TENAPARTYMOBILE");
                getOrderNum();
            }
        }, 80);
    }


    // 基础数据
    var dictListDatas = [];
    getBasicData();
    function getBasicData() {
        var basicDataObj = {};
        var logininf = JSON.parse(localStorage.getItem("logininf"));
        if (localStorage.getItem("basicData") == null) { //获取下拉数据
            getRequest(cmdUrl + "/dictionary/all/all.json?token=" + logininf.token + "&timeStamp=" + logininf.timeStamp,function (res) {
                dictListDatas = res.result.dictList;
                basicDataObj.qtyUnitList = getDictDataLists('om_order', 'qty_unit');  //数量单位
                basicDataObj.volumeUnitList = getDictDataLists('om_order', 'volume_unit');  //体积单位
                basicDataObj.currencyList = getDictDataLists('om_order', 'currency');  //金额单位
                basicDataObj.weightUnitList = getDictDataLists('om_order', 'weight_unit');  //重量单位
                basicDataObj.orderTypeList = getDictDataLists('om_order', 'order_type');	//订单类型
                basicDataObj.orderToList = getDictDataLists('om_order', 'order_to');	//发单方
                basicDataObj.orderFromList = getDictDataLists('om_order', 'order_from');	//接单方
                basicDataObj.contactLists = getDictDataLists('cd_contact', 'contact_type');  // 联系人类型
                basicDataObj.eqpTypeList = getDictDataLists('cd_eqp', 'eqp_type');  //设备类型
                basicDataObj.countryList = res.result.countryList;  // 国家
                basicDataObj.provinceList = res.result.provinceList;  // 省
                basicDataObj.cityList = res.result.cityList;  // 市
                basicDataObj.districtList = res.result.districtList;  // 区
                basicDataObj.partyTypeList = getDictDataLists('cd_party', 'party_type'); 	//合作商类型
                basicDataObj.locationTypeList = getDictDataLists('cd_location', 'location_type');  // cd 地址类型
                basicDataObj.locationLableList = getDictDataLists('cd_location', 'location_lable');  // cd 地址标签
                localStorage.setItem("basicData", JSON.stringify(basicDataObj));

                return basicDataObj;
            });
        }else{
            basicDataObj = JSON.parse(localStorage.getItem("basicData"));
            return basicDataObj;
        }
    }
    function getDictDataLists(tableName,columnName){
        var listData = [];
        for(var i = 0;i < dictListDatas.length;i++){
            if(dictListDatas[i].tableName == tableName && dictListDatas[i].columnName == columnName){
                listData.push(dictListDatas[i]);
            }
        }
        return listData;
    }

    /**
     * 控制菜单的显示和隐藏
     * */
    function meauFunction(objectCode) {
        var logininf = localStorage.getItem("logininf");
        var myMenuList = JSON.parse(localStorage.getItem("myMenuList"));
        if (myMenuList) {
            isMenuShow(myMenuList)
        } else {
            if (logininf != "undefined" && logininf != undefined && logininf != null) {
                var userInfo = JSON.parse(logininf);
                getRequest(umsUrl + '/query/objectByUser.json?token=' + userInfo.token + "&userId=" + userInfo.userId + "&objectType=menu&parentObjectCode=" + objectCode, function (data) {
                    var myMenuList = data.result;
                    setTimeout(function () {
                        isMenuShow(myMenuList);
                        localStorage.setItem("myMenuList", JSON.stringify(myMenuList));
                    }, 80)
                })
            }
        }
    }

    function isMenuShow(newData) {
        var meauObj = $(".meauShowPermission");
        for (var i = 0; i < newData.length; i++) {
            for (var j = 0; j < meauObj.length; j++) {
                if (newData[i].objectCode == meauObj.eq(j).attr("objectCode")) {
                    for (var m = 0; m < newData[i].permissionList.length; m++) {
                        if (newData[i].permissionList[m].permissionCode == "SHOW" || newData[i].permissionList[m].permissionCode == "show") {
                            $(".meauShowPermission").eq(j).css({"display": "inline-block"})
                            $(".meauShowPermission").eq(j).show();
                        } else {
                            $(".meauShowPermission").eq(j).parents(".commandbarItem").hide();
                            $(".meauShowPermission").eq(j).hide();
                        }
                    }
                }
            }
        }
    }

    /**
     * 获取每个状态下订单的数量的值
     * */
    function getOrderNum() {
        var logininf = localStorage.getItem("logininf");
        //如果有登录信息
        if (logininf != "" && logininf != undefined && logininf != null && logininf != "null" && logininf != "undefined") {
            var userInfo = JSON.parse(logininf);
            $(".orderClassify ul li").eq(0).find(".hint").html("0");
            $(".orderClassify ul li").eq(1).find(".hint").html("0");
            $(".orderClassify ul li").eq(2).find(".hint").html("0");
            $(".orderClassify ul li").eq(3).find(".hint").html("0");
            postRequest(chartUrl + '/tenant/getOrderTotalNum?token=' + userInfo.token, merchantInf, function (data) {
                var hintNum = data.result;
                $(".orderClassify ul li").eq(0).find(".hint").html(hintNum.lontActcurrent);
                $(".orderClassify ul li").eq(1).find(".hint").html(hintNum.deviantOrderstotal);
                $(".orderClassify ul li").eq(2).find(".hint").html(hintNum.doneOrderstotal);
                $(".orderClassify ul li").eq(3).find(".hint").html(hintNum.allOrderstotal);
            });
        } else {
            //getUserPower();
        }
    }

    /**
     * 获取微信用户权限
     * */
    function getWxUserPower() {
        var logininf = localStorage.getItem("logininf");
        var urlCallback = "/bind_member.html";
        // 判断是否是微信客户端
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            var token = GetQueryString("token");
            var openId = GetQueryString("openid");
            if (null == token || "" == token || undefined == openId) {
                if (null == openId || "" == openId || undefined == openId) {
                    urlCallback = wechatUrl + "/syOauth2Login.html?r=/index.html";
                } else {
                    urlCallback = wechatUrl + "/syOauth2Login.html?r=/bind_member.html";
                }
                location.href = urlCallback;
            } else {
                //判断是否有登录信息
                var roleId = GetQueryString("role");
                localStorage.setItem("roleId", roleId);
                getRequest(umsUrl + '/user/getUserInfoBytoken?token=' + token, function (data) {
                    if (data == null || data.result == null || data.result == '') {
                        location.href = wechatUrl + "/syOauth2Login.html?r=/bind_member.html";
                    } else {
                        localStorage.setItem("logininf", JSON.stringify(data.result));
                    }
                })
            }
        } else {
            if (logininf == "" || logininf == null || logininf == undefined || logininf == "null" || logininf == "undefined") {
                location.href = urlCallback;
            }
        }
    }

    /**
     * 获取URL地址参数
     * @return {null}
     */
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    /**
     * 计算
     * */
    function p(s) {
        return s < 10 ? '0' + s : s;
    }

    // 获取用户权限
    setTimeout(function () {
        initIndexRole();
    }, 500);
});
