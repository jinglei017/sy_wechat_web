// $(function () {
//     var pageUrl = {
//         url: (window.location.href).split('#')[0]
//     };
//     var str = pageUrl.url;
//     str = str.replace(/\%/g, "%25");
//     str = str.replace(/\#/g, "%23");
//     str = str.replace(/\&/g, "%26");
//     $.ajax({
//         url: umsUrl + "/getSign.json" + "?url=" + str,
//         type: "get",
//         success: function (data) {
//             if (data != null && (data.jsonVo.status == '0' || data.jsonVo.status == 0)) {
//                 /*配置 wx.config 参数*/
//                 wx.config({
//                     debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//                     appId: data.jsonVo.result.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
//                     timestamp: data.jsonVo.result.timestamp, // 必填，生成签名的时间戳
//                     nonceStr: data.jsonVo.result.nonceStr, // 必填，生成签名的随机串
//                     signature: data.jsonVo.result.signature,// 必填，签名，见附录1
//                     jsApiList: [
//                         'checkJsApi',
//                         'scanQRCode',
//                         'chooseImage',
//                         'previewImage',
//                         'uploadImage',
//                         'downloadImage',
//                         'getLocation'
//                     ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
//                 });
//             } else {
//                 loadData("show", "errorToken", true);
//             }
//         }
//     });
//     wx.ready(function () {
//         wx.checkJsApi({  //判断当前客户端版本是否支持指定JS接口
//             jsApiList: [
//                 'scanQRCode'
//             ],
//             success: function (res) {// 以键值对的形式返回，可用true，不可用false。如：{"checkResult":{"scanQRCode":true},"errMsg":"checkJsApi:ok"}
//                 if (res.checkResult.scanQRCode != true) {
//                     loadData("show", "抱歉，当前客户端版本不支持扫一扫", true)
//                 }
//             },
//             fail: function (res) { //检测getNetworkType该功能失败时处理
//                 loadData("show", "checkJsApi error", true)
//             }
//         });
//
//     });
//
//     /*处理失败验证*/
//     wx.error(function (res) {
//         loadData('show', 'share error: ' + res.errMsg, true)
//     });
// });


/* 配置 wx.config 参数 */

$(function(){
    var pageUrl ={
        url:(window.location.href).split('#')[0]
    };
    $.ajax({
        url:"/get-sign"+"?action=get_sign_package",
        type:"post",
        data:pageUrl,
        success:function(data){
            var params = JSON.parse(data);
            /*配置 wx.config 参数*/
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: params.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
                timestamp: params.timestamp, // 必填，生成签名的时间戳
                nonceStr: params.nonceStr, // 必填，生成签名的随机串
                signature: params.signature,// 必填，签名，见附录1
                jsApiList: [
                    'checkJsApi',
                    'scanQRCode',
                    'chooseImage',
                    'previewImage',
                    'uploadImage',
                    'downloadImage',
                    'getLocation'
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });

        }
    });


    wx.ready(function(){
        wx.checkJsApi({  //判断当前客户端版本是否支持指定JS接口
            jsApiList: [
                'scanQRCode'
            ],
            success: function (res) {// 以键值对的形式返回，可用true，不可用false。如：{"checkResult":{"scanQRCode":true},"errMsg":"checkJsApi:ok"}
                if(res.checkResult.scanQRCode != true){
                    console.log('抱歉，当前客户端版本不支持扫一扫');
                }
            },
            fail: function (res) { //检测getNetworkType该功能失败时处理
                alert('checkJsApi error');
            }
        });

    });



    /*处理失败验证*/
    wx.error(function (res) {
        alert("share error: " + res.errMsg);
    });



});

