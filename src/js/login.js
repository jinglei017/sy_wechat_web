$(function () {

    var ua = window.navigator.userAgent.toLowerCase();

    // 清除基础数据
    localStorage.removeItem("basicData");
    localStorage.removeItem("allData");
    localStorage.removeItem("newOrderBasicData");

    localStorage.removeItem("addressinf");
    localStorage.removeItem("allInfo");
    localStorage.removeItem("logininf");
    localStorage.removeItem("partnersList");
    localStorage.removeItem("servicePointList");
    localStorage.removeItem("mobilePhone");
    localStorage.removeItem("omnibarToken");

    localStorage.removeItem("driverMobile");
    localStorage.removeItem("itemOrderId");
    localStorage.removeItem("orderLength");
    localStorage.removeItem("tasklistData");
    localStorage.removeItem("currentTime");
    localStorage.removeItem("myMenuList");

    var jumpIndexUrl = "/index.html";

    var getValidTokenInt0 = 60;
    var getValidTokenTimer0;
    var gotValidToken0 = 0;
    var loginMethods = 0;

    var roleItem = GetQueryString("r");
    var getOpenid = GetQueryString("openid");
    if (getOpenid != "" || getOpenid != null || getOpenid != undefined) {
        //解除绑定
        $.ajax({
            url: wechatUrl + '/unBind.json',
            type: "post",
            data: {
                openid: getOpenid
            },
            success: function (data) {
                console.log(data);
            }
        })
    }

    var currentLogo = "images/logo_2.png";
    $(".logoimg img").attr("src",currentLogo);

    $(".registerHint i").click(function () {
        $(".maskLayer").show();
    });

    var roleId = localStorage.getItem("roleId");
    if (roleId == "" || roleId == null || roleId == undefined || roleId == "0") {
        $(".loginCon ul li").show();
        $(".loginCon ul .telLi").hide();
        $(".loginCon ul li:nth-child(1) div:nth-child(1)").addClass("roleActive")
        roleItem = "0";
    } else if (roleId == "2") {
        $(".loginCon ul li").show();
        $(".loginCon ul .telLi").hide();
        $(".loginCon ul li:nth-child(1) div:nth-child(3)").addClass("roleActive")
        roleItem = "2";
    } else if (roleId == "1") {
        $(".loginCon ul li").show();
        $(".loginCon ul .telLi").hide();
        $(".loginCon ul li:nth-child(1) div:nth-child(2)").addClass("roleActive")
        roleItem = "1";
    }

    $(".maskLayer .popup h3 a").click(function () {
        $(".maskLayer").hide();
        $(".registerHint").addClass("agreeTerms");
    });

    // 选择短信登录还是密码登录
    $(".noteLogin").click(function () {
        $(".noteLogin").hide();
        $(".passwordLogin").show();
        $(".loginCon ul li").hide();
        $(".loginCon ul li").eq(0).show();
        $(".loginCon ul .telLi").show();
        loginMethods = "1";
    });
    $(".passwordLogin").click(function () {
        $(".passwordLogin").hide();
        $(".noteLogin").show();
        $(".loginCon ul li").show();
        $(".loginCon ul .telLi").hide();
        loginMethods = "0";
    });

    // 选择角色
    $(".roleChoiceDiv").click(function () {
        $(this).addClass("roleActive")
        $(this).siblings(".roleChoiceDiv").removeClass("roleActive");
        $(".roleParent").css({"border": "0", "border-bottom": "1px solid #e5e5e5"})
        if ($(this).index() == 0) {
            roleItem = "0";
        }
        if ($(this).index() == 1) {
            roleItem = "1";
        }
        if ($(this).index() == 2) {
            roleItem = "2";
        }
    });

    // 获取验证码
    $(".loginCon .yzmButton").click(function () {
        var telInp = $(".telInp").val();
        var TEL_REGEXP = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (TEL_REGEXP.test(telInp)) {
            if (gotValidToken0 == 0) {
                getRequest(umsUrl + "/getMobileLoginAuthToken.json?mobileNo=" + telInp, function (res) {
                    gotValidToken0 = "1";
                    $('.yzmButton').html(getValidTokenInt0 + ' s'); // 倒计时初始值
                    startTimer0();
                });
            } else {
                markmsg("操作频繁，请稍后重试");
            }
        } else {
            markmsg("请输入正确的号码");
        }
    });

    // 选择角色
    $(".lessee,.name,.pwd,.telInp,.telYzm").focus(function () {
        if ($(".roleActive").length == 0) {
            $(".roleParent").css({
                "border": "1px solid red",
                "border-top-left-radius": "0.12rem",
                "border-top-right-radius": "0.12rem"
            })
            $(this).attr("maxlength", "0")
        } else {
            $(this).attr("maxlength", "100")
            $(".roleParent").css({"border": "0", "border-bottom": "1px solid #e5e5e5"})
        }
    });

    // 登录
    $(".loginCon .dlbtn").click(function () {
        if (loginMethods == 0) {
            passwordLogin()	// 密码登录
        }
        if (loginMethods == 1) {
            noteLogin()	// 短信登录
        }
    });

    //获取短信验证码
    $(".getcode").click(function yanz() {
        //var name = $("#phone").val().trim();
        var reg = /^1\d{10}$/;
        //发送短信验证码

        //重发验证码
        var num = 60;
        var numCode = setInterval(function () {
            $(".getcode").off("click", yanz);
            num--;
            $(".getcode").css({
                "color": "#fff"
            }).html("重发验证码:" + num + "s")
            if (num < 0) {
                clearInterval(numCode);
                $(".getcode").css({
                    "color": "#ff3535"
                }).html("获取短信验证码").on("click", yanz)
            }
        }, 1000)

    });

    $(".freeReg").click(function () {
        location.href = regUrl;
    });

    /**
     * 手机认证
     * */
    function noteLogin() {
        var telVal = $(".telInp").val().trim();
        var telVal2 = $(".telYzm").val().trim();
        var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        var role = "";
        if (telVal == "") {
            markmsg("手机号码不能为空");
            return false;
        } else if (telVal2 == "") {
            markmsg("请填写验证码");
            return false;
        }
        var userInfo = {
            loginType: 3,
            userName: telVal,
            passWord: telVal2
        };
        postRequest(umsUrl + '/user/login.json', userInfo, function (data) {
            var userInfo = data.result;
            var memberCode = userInfo.uuid;//membercode  地址栏返回的membercode
            var mobilePhone = userInfo.mobilePhone;
            var token = userInfo.token;
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                $.ajax({
                    url: wechatUrl + '/newbindMember.json?token=' + token + '&role=' + roleItem + '&mobilePhone=' + mobilePhone + '&openid=' + getOpenid + '&memberCode=' + memberCode,
                    type: "post",
                    success: function (data) {
                        if (data.status == 2) {
                            loadData("show", data.msg, true);
                            return false;
                        } else {
                            localStorage.setItem("logininf", JSON.stringify(userInfo));
                            localStorage.setItem("roleId", roleItem);
                            location.href = wechatUrl + "/syOauth2Login.html?r=" + jumpIndexUrl;
                        }
                    },
                    error: function () {
                        markmsg("验证码不正确");
                    }
                })
            } else {
                localStorage.setItem("logininf", JSON.stringify(userInfo));
                localStorage.setItem("roleId", roleItem);
                location.href = jumpIndexUrl;
            }
        })
    }

    /**
     * 账号登录
     * */
    function passwordLogin() {
        var lesseeVal = $(".lessee").val().trim();
        var nameVal = $(".name").val().trim();
        var pwdVal = $(".pwd").val().trim();
        if (lesseeVal == "") {
            markmsg("请输入租户名");
            return false;
        } else if (nameVal == "") {
            markmsg("请输入用户名");
            return false;
        } else if (pwdVal == "") {
            markmsg("请输入密码");
            return false;
        } else {
            var userInfo = {
                loginType: 4,
                tenantCode: lesseeVal,
                userName: nameVal,
                passWord: pwdVal
            };
            $.ajax({
                url: umsUrl + '/user/login',
                type: "post",
                contentType: 'application/json',
                data: JSON.stringify(userInfo),
                success: function (data) {
                    var userInfo = data.result;
                    if (userInfo == undefined || userInfo == null || userInfo == '') {
                        markmsg("账户不存在或已禁用");
                        return false;
                    }
                    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                        var memberCode = userInfo.uuid;//membercode  地址栏返回的membercode
                        var mobilePhone = userInfo.mobilePhone;
                        var token = userInfo.token;
                        $.ajax({
                            url: wechatUrl + '/newbindMember.json?token=' + token + '&role=' + roleItem + '&mobilePhone=' + mobilePhone + '&openid=' + getOpenid + '&memberCode=' + memberCode,
                            type: "post",
                            success: function (data) {
                                if (data.status == 2) {
                                    loadData("show", data.msg, true);
                                    return false;
                                } else {
                                    userInfo.openid = getOpenid;
                                    localStorage.setItem("logininf", JSON.stringify(userInfo));
                                    localStorage.setItem("roleId", roleItem);
                                    location.href = wechatUrl + "/syOauth2Login.html?r=" + jumpIndexUrl;
                                }
                            },
                            error: function () {

                            }
                        })
                    } else {
                        localStorage.setItem("logininf", JSON.stringify(userInfo));
                        localStorage.setItem("roleId", roleItem);
                        location.href = jumpIndexUrl;
                    }
                },
                error: function (xhr) {
                    markmsg("密码不正确");
                }
            })
        }
    }

    function startTimer0() { // 启动定时器
        getValidTokenTimer0 = setInterval(function () {
            getValidTokenInt0--; // 时间递减
            $('.yzmButton').html(getValidTokenInt0 + ' s');
        }, 1000);
        setTimeout(function () {
            clearTimer0();
        }, 1 * 60 * 1000);
    }

    function clearTimer0() { // 清除定时器
        gotValidToken0 = "0";
        clearInterval(getValidTokenTimer0);
        $('.yzmButton').html("获取验证码");
        getValidTokenInt0 = 60;
    }

    function markmsg(err) {
        $(".markmsg").html(err).css({
            "display": "block"
        });
        setTimeout(function () {
            $(".markmsg").hide();
        }, 2000)
    }

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
})
