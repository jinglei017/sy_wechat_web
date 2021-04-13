document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';
window.addEventListener("resize", function () {
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';
})


var loadFirst = 'true'; //加载数据第一次显示（加载缓冲提示）

var contentISBlank = '<div class="contentISBlank"><span>---未查询到相关内容---</span></div>';  // 查询结果为空时的页面提示内容

var ua = window.navigator.userAgent.toLowerCase();
/*if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    $(".header").hide();
    $(".orderList").css({
        "marginTop": "0px"
    })
    $(".orderList .listTitle").css({
        "top": "0px",
        "borderTop": "none"
    })
    $(".main").css({
        "paddingTop": "0px",
        "marginTop": "0px"
    })
    $(".orderInfo").css({
        "marginTop": "0px"
    })
    $(".personMain").css({
        "marginTop": "0px"
    })
    $(".personMain .personMainTitle").css({
        "top": "0px"
    })
    // “我要下单”微信中，.header隐去之后，主体内容上移（newOrderBase，newOrderFrom，newOrderItems，newOrderTo）
    $(".content.newOrderMain").css({
        "paddingTop": "0px",
        "marginTop": "0px"
    })
}
$(function () {
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        $(".header").hide();
        $(".orderList").css({
            "marginTop": "0px"
        })
        $(".orderList .listTitle").css({
            "top": "0px",
            "borderTop": "none"
        })
        $(".main").css({
            "paddingTop": "0px",
            "marginTop": "0px"
        })
        $(".personMain").css({
            "marginTop": "0px"
        })
        $(".personMain .personMainTitle").css({
            "top": "0px"
        })
    }
})*/


//时间戳转化为时间
function timestampToTime(unixTime, isFull, timeZone) {
    if (typeof(timeZone) == 'number') {
        unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
    }
    var time = new Date(unixTime);
    var ymdhis = "";
    ymdhis += time.getFullYear() + "-";
    ymdhis += (time.getMonth() + 1) + "-";
    ymdhis += time.getDate();
    if (time.getHours() < 10) {
        ymdhis += " " + "0" + time.getHours() + ":";
    } else {
        ymdhis += " " + time.getHours() + ":";
    }
    if (time.getMinutes() < 10) {
        ymdhis += "0" + time.getMinutes() + ":";
    } else {
        ymdhis += time.getMinutes() + ":";
    }
    if (time.getSeconds() < 10) {
        ymdhis += "0" + time.getSeconds();
    } else {
        ymdhis += time.getSeconds();
    }
    return ymdhis;
}

function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
    h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
    m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
    s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
}

function timestampToTime1(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
    h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
    m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return M + D + h + m;
}

function timestampToTime2(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + ' ';
    h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + ':';
    m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() + ':';
    s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D;
}

function getTodayTime() {
    var date = new Date();
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return Y + M + D;
}

function getQueryTime(dateParmes) {
    var date = new Date();
    var year, month, day;
    date.setDate(date.getDate() - dateParmes);
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    s = year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day);
    return s;

}

/* ajax请求 —— 地址，方式，传参，成功回调函数，失败提示 */
function ajaxRequest(url, method, data, suc, tip) {
    if (!data) {
        $.ajax({
            url: url,
            type: method,
            contentType: 'application/json',
            data: '',
            dataType: "json",
            async: false,
            beforeSend: function () {
                if (loadFirst == 'true') {
                    loadData('show');
                    loadFirst = 'false';
                }
            },
            success: function (response) {
                if (loadFirst == 'false') {
                    loadData('hide');
                    loadFirst = 'true';
                }
                if (suc != "") {
                    eval(suc + "(" + JSON.stringify(response) + ")");
                }
            },
            error: function () {
                loadData('show', tip + '出错，请稍后重试！', true);
                $(".maskLayer").hide();
            }
        });
    } else {
        $.ajax({
            url: url,
            type: method,
            contentType: 'application/json',
            data: JSON.stringify(data),
            dataType: "json",
            async: false,
            beforeSend: function () {
                if (loadFirst == 'true') {
                    loadData('show');
                    loadFirst = 'false';
                }
            },
            success: function (response) {
                if (loadFirst == 'false') {
                    loadData('hide');
                    loadFirst = 'true';
                }
                if (suc != "") {
                    eval(suc + "(" + JSON.stringify(response) + ")");
                }
            },
            error: function () {
                loadData('show', tip + '出错，请稍后重试！', true);
                $(".maskLayer").hide();
            }
        });
    }
}

/*提示语：delayed 延时自动消失；text 提示语；state 状态 显示show消失任意*/
function loadData(state, text, delayed, callback) {
    var t = text ? text : '努力加载中...';
    if ($('.loading').length < 1) {
        var html = '<div class="loading"><div class="fixed_content"></div></div>';
        $('body').append(html);
    }
    $('.loading .fixed_content').text(t);
    if (state == 'show') {
        $('.loading').fadeIn(300);
        if (delayed) {
            setTimeout(function () {
                $('.loading').fadeOut(1000, function () {
                    if (callback) {
                        callback()
                    }
                });
            }, 800)
        }
    }
    else {
        $('.loading').fadeOut(400);
    }
}

function getWeek() {
    //按周日为一周的最后一天计算
    var date = new Date();
    //今天是这周的第几天
    var today = date.getDay();
    //上周日距离今天的天数（负数表示）
    var stepSunDay = -today + 1;
    // 如果今天是周日
    if (today == 0) {
        stepSunDay = -7;
    }
    // 周一距离今天的天数（负数表示）
    var stepMonday = 7 - today;
    var time = date.getTime();
    var monday = new Date(time + stepSunDay * 24 * 3600 * 1000);
    var sunday = new Date(time + stepMonday * 24 * 3600 * 1000);
    //本周一的日期 （起始日期）
    var startDate = transferDate(monday); // 日期变换
    //本周日的日期 （结束日期）
    var endDate = transferDate(sunday); // 日期变换

    return {
        startDate: startDate,
        endDate: endDate
    }
}

function transferDate(date) {
    // 年
    var year = date.getFullYear();
    // 月
    var month = date.getMonth() + 1;
    // 日
    var day = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
        day = "0" + day;
    }
    var dateString = year + '-' + month + '-' + day;
    return dateString;
}

function getCurrentTime(dateParmes) {
    var date = new Date();
    var year, month, day;
    date.setDate(date.getDate() - dateParmes);
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    s = year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day);
    return s;

}

/*取得当天日期(yyyy-MM-dd)*/
function GetNowdate() {
    var nowDate = new Date();
    var str = nowDate.getFullYear() + "-" + NumToString(nowDate.getMonth() + 1) + "-" + NumToString(nowDate.getDate());
    return str;
}

function NumToString(num) {
    if (num < 10) {
        return "0" + num;
    } else {
        return num;
    }
}

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    //  if (r != null) return unescape(r[2]); return null; //返回参数值  (解析中文参数时候出现乱码)
    if (r != null) {//返回参数值
        var str = r[2];
        return decodeURI(str);
    } else {
        return null;
    }
}

/**
 * 验证登录
 * */
function getOauth2Login(r) {
    var url = "";
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        url = wechatUrl + "/syOauth2Login.html?r=" + r;
    } else {
        url = r;
    }
    location.href = url;
}

/* ajax请求 —— 地址，方式，传参，成功回调函数，失败提示 */
function postRequest(url, data, callback, txt) {
    $.ajax({
        url: url,
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify(data),
        beforeSend: function () {
            if ($('.hasExceptionMsg').length < 1) {
                if ($('.ajax-load-pupup').length < 1) {
                    $("body").append('<div class="ajax-load-pupup"><div class="ajax-load-hint"><img src="../images/loading51.gif"/><br><br><br><span>加载中，请稍后...</span><img class="closeTip" src="../images/bar_icon_close.png" alt="" onclick="closeTipFun()" /></div></div>')
                }
            }
        },
        success: function (response) {
            if (response != null) {
                if (response.msg == 'success' || response.msg == 'SUCCESS') {
                    setTimeout(function () {
                        if ($('.hasExceptionMsg').length < 1) {
                            $(".ajax-load-pupup").remove();
                        }
                    }, 300);
                    callback(response);
                } else {
                    if (response.exceptionMsg != null) {
                        /*$(".ajax-load-pupup").addClass('hasExceptionMsg');
                        $(".ajax-load-pupup span").html(response.exceptionMsg);
                        $(".ajax-load-hint img.closeTip").show();*/

                        if (response.exceptionMsg == 'AUTHORIZEFAILURE') {
                            $(".ajax-load-pupup").addClass('hasExceptionMsg');
                            $(".hasExceptionMsg .ajax-load-hint span").css('margin-top', '3%');
                            $(".ajax-load-pupup span").html('登录信息失效，页面将在3s后跳转至登录页');
                            $(".ajax-load-hint img.closeTip").show();
                            setTimeout(function () {
                                getOauth2Login("/bind_member.html");
                            }, 3000);
                        } else {
                            $(".ajax-load-pupup").addClass('hasExceptionMsg');
                            $(".hasExceptionMsg .ajax-load-hint span").css('margin-top', '3%');
                            $(".ajax-load-pupup span").html(response.exceptionMsg);
                            $(".ajax-load-hint img.closeTip").show();
                        }
                    }
                }
            }
        },
        error: function (error) {
            if (null != error && error.responseJSON != undefined && error.responseJSON != null && error.responseJSON.exceptionMsg == 'AUTHORIZEFAILURE') {
                $(".ajax-load-pupup").addClass('hasExceptionMsg');
                $(".hasExceptionMsg .ajax-load-hint span").css('margin-top', '3%');
                $(".ajax-load-pupup span").html('登录信息失效，页面将在3s后跳转至登录页');
                $(".ajax-load-hint img.closeTip").show();
                setTimeout(function () {
                    getOauth2Login("/bind_member.html");
                }, 3000);
                return false;
            } else {
                if ($('.hasExceptionMsg').length < 1) {
                    if ($('.ajax-load-pupup').length < 1) {
                        $("body").append('<div class="ajax-load-pupup hasExceptionMsg"><div class="ajax-load-hint"><img src="../images/loading51.gif"/><br><br><br><span>网络异常，请稍后重试！</span><img class="closeTip" src="../images/bar_icon_close.png" alt="" onclick="closeTipFun()" /></div></div>')
                    } else {
                        $(".ajax-load-pupup").addClass('hasExceptionMsg');
                        $(".ajax-load-pupup span").html('网络异常，请稍后重试！');
                    }
                } else {
                    $(".ajax-load-pupup span").html('网络异常，请稍后重试！');
                }
                $(".ajax-load-hint img.closeTip").show();
            }
        }
    });
}

/* ajax请求 —— 地址，方式，传参，成功回调函数，失败提示 */
function getRequest(url, callback, txt) {
    $.ajax({
        url: url,
        type: "get",
        beforeSend: function () {
            if ($('.hasExceptionMsg').length < 1) {
                if ($('.ajax-load-pupup').length < 1) {
                    $("body").append('<div class="ajax-load-pupup"><div class="ajax-load-hint"><img src="../images/loading51.gif"/><br><br><br><span>加载中，请稍后...</span><img class="closeTip" src="../images/bar_icon_close.png" alt="" onclick="closeTipFun()" /></div></div>')
                }
            }
        },
        success: function (response) {
            if (response != null) {
                if (response.msg == 'success' || response.msg == 'SUCCESS') {
                    setTimeout(function () {
                        if ($('.hasExceptionMsg').length < 1) {
                            $(".ajax-load-pupup").remove();
                        }
                    }, 300);
                    callback(response);
                } else {
                    if (response.exceptionMsg != null) {
                        /*$(".ajax-load-pupup").addClass('hasExceptionMsg');
                        $(".ajax-load-pupup span").html(response.exceptionMsg);
                        $(".ajax-load-hint img.closeTip").show();*/
                        if (response.exceptionMsg == 'AUTHORIZEFAILURE') {
                            $(".ajax-load-pupup").addClass('hasExceptionMsg');
                            $(".hasExceptionMsg .ajax-load-hint span").css('margin-top', '3%');
                            $(".ajax-load-pupup span").html('登录信息失效，页面将在3s后跳转至登录页');
                            $(".ajax-load-hint img.closeTip").show();
                            setTimeout(function () {
                                getOauth2Login("/bind_member.html");
                            }, 3000);
                        } else {
                            $(".ajax-load-pupup").addClass('hasExceptionMsg');
                            $(".hasExceptionMsg .ajax-load-hint span").css('margin-top', '3%');
                            $(".ajax-load-pupup span").html(response.exceptionMsg);
                            $(".ajax-load-hint img.closeTip").show();
                        }
                    }
                }
            }
        },
        error: function (error) {
            if (null != error && error.responseJSON != undefined && error.responseJSON != null && error.responseJSON.exceptionMsg == 'AUTHORIZEFAILURE') {
                $(".ajax-load-pupup").addClass('hasExceptionMsg');
                $(".hasExceptionMsg .ajax-load-hint span").css('margin-top', '3%');
                $(".ajax-load-pupup span").html('登录信息失效，页面将在3s后跳转至登录页');
                $(".ajax-load-hint img.closeTip").show();
                setTimeout(function () {
                    getOauth2Login("/bind_member.html");
                }, 3000);
                return false;
            } else {
                if ($('.hasExceptionMsg').length < 1) {
                    if ($('.ajax-load-pupup').length < 1) {
                        $("body").append('<div class="ajax-load-pupup hasExceptionMsg"><div class="ajax-load-hint"><img src="../images/loading51.gif"/><br><br><br><span>网络异常，请稍后重试！</span><img class="closeTip" src="../images/bar_icon_close.png" alt="" onclick="closeTipFun()" /></div></div>')
                    } else {
                        $(".ajax-load-pupup").addClass('hasExceptionMsg');
                        $(".ajax-load-pupup span").html('网络异常，请稍后重试！');
                    }
                } else {
                    $(".ajax-load-pupup span").html('网络异常，请稍后重试！');
                }
                $(".ajax-load-hint img.closeTip").show();
            }
        }
    });
}

/* 百度地图接口 —— 地址，方式，传参，成功回调函数，失败提示 */
function getRequestBMap(url, callback, txt) {
    $.ajax({
        url: url,
        async: false,
        type: "get",
        beforeSend: function () {
            if ($('.hasExceptionMsg').length < 1) {
                if ($('.ajax-load-pupup').length < 1) {
                    $("body").append('<div class="ajax-load-pupup"><div class="ajax-load-hint"><img src="../images/loading51.gif"/><br><br><br><span>加载中，请稍后...</span><img class="closeTip" src="../images/bar_icon_close.png" alt="" onclick="closeTipFun()" /></div></div>')
                }
            }
        },
        success: function (response) {
            if (response != null) {
                if (response.status == 0) {
                    setTimeout(function () {
                        if ($('.hasExceptionMsg').length < 1) {
                            $(".ajax-load-pupup").remove();
                        }
                    }, 300);
                    callback(response);
                } else {
                    $(".ajax-load-pupup").addClass('hasExceptionMsg');
                    $(".ajax-load-pupup span").html('百度地图调用出错');   // response.message
                    $(".ajax-load-hint img.closeTip").show();
                }
            }
        },
        error: function () {
            if ($('.hasExceptionMsg').length < 1) {
                if ($('.ajax-load-pupup').length < 1) {
                    $("body").append('<div class="ajax-load-pupup hasExceptionMsg"><div class="ajax-load-hint"><img src="../images/loading51.gif"/><br><br><br><span>网络异常，请稍后重试！</span><img class="closeTip" src="../images/bar_icon_close.png" alt="" onclick="closeTipFun()" /></div></div>')
                } else {
                    $(".ajax-load-pupup").addClass('hasExceptionMsg');
                    $(".ajax-load-pupup span").html('网络异常，请稍后重试！');
                }
            } else {
                $(".ajax-load-pupup span").html('网络异常，请稍后重试！');
            }
            $(".ajax-load-hint img.closeTip").show();
        }
    });
}

//获取国家
function getCountryData() {
    var getAllData = JSON.parse(localStorage.getItem("newOrderBasicData"));
    var countryData = getAllData.countryList;
    var listData = [];
    for (var i = 0; i < countryData.length; i++) {
        listData.push(countryData[i]);
    }
    return listData;
}

//根据国家获取省
function getProvinceData(countryCode) {
    var getAllData = JSON.parse(localStorage.getItem("newOrderBasicData"));
    var provinceData = getAllData.provinceList;
    var listData = [];
    for (var i = 0; i < provinceData.length; i++) {
        if (provinceData[i].parentCode == countryCode) {
            listData.push(provinceData[i]);
        }
    }
    return listData;
}

//根据省获取市
function getCityData(provinceCode) {
    var getAllData = JSON.parse(localStorage.getItem("newOrderBasicData"));
    var cityData = getAllData.cityList;
    var listData = [];
    for (var i = 0; i < cityData.length; i++) {
        if (cityData[i].parentCode == provinceCode) {
            listData.push(cityData[i]);
        }
    }
    return listData;
}

//根据市获取区
function getDistrictData(cityCode) {
    var getAllData = JSON.parse(localStorage.getItem("newOrderBasicData"));
    var districtData = getAllData.districtList;
    var listData = [];
    for (var i = 0; i < districtData.length; i++) {
        if (districtData[i].parentCode == cityCode) {
            listData.push(districtData[i]);
        }
    }
    return listData;
}

// 去除数组重复元素：获取没重复的最右一值放入新数组
function quArraySameItemFun(array) {
    var r = [];
    for (var i = 0, l = array.length; i < l; i++) {
        for (var j = i + 1; j < l; j++)
            if (array[i] === array[j]) j = ++i;
        r.push(array[i]);
    }
    return r;
}


// 判断 正数，负数，不是数字
function checkNumType(num) {
    var reg = new RegExp("^-?[0-9]*.?[0-9]*$");
    if (reg.test(num)) {
        var absVal = Math.abs(num);
        return num == absVal ? '正数' : '负数';
    }
    else {
        return '不是数字';
    }
}

/* --- 可关闭异常弹窗 ---- start ----- */
function closeTipFun() {
    $('.ajax-load-pupup').remove();
}
