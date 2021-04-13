//
// $(function () {
//     var pageUrl = {
//         url: (window.location.href).split('#')[0]
//     };
//     var str = pageUrl.url;
//     $(document).on('click', '#showQRcode', function () {
//         $.ajax({
//             url: umsUrl + "/getSign.json" + "?url=" + str,
//             type: "get",
//             success: function (data) {
//                 /*生成带参数的二维码*/
//                 // var datas = {"expire_seconds": 604800, "action_name": "QR_STR_SCENE", "action_info": {"scene": {"scene_str": "test"}}};
//                 // var str = "{\"expire_seconds\":604800,\"action_name\":\"QR_STR_SCENE\",\"action_info\":{\"scene\":{\"scene_str\":\"test\"}}}";
//                 if (data != null && (data.jsonVo.status == '0' || data.jsonVo.status == 0)) {
//                     // $.ajax({
//                     //     url: "/get-qrcode" + "?access_token=" + data.jsonVo.result.accessTokenStr,
//                     //     type: "post",
//                     //     data: str,
//                     //     success: function (response) {
//                     //         console.log(JSON.stringify(response));
//                     //         console.log(JSON.stringify(response.ticket));
//                     //         alert(JSON.stringify(response));
//                     //         showQRcode(response);
//                     //     }
//                     // });
//                     showQRcode(JSON.parse(data.jsonVo.result.ticket).ticket);
//                 } else {
//                     loadData("show", "errorToken", true);
//                 }
//             }
//         });
//     });
// });
//
// function showQRcode(ticket) {
//     if (ticket != '' && ticket != undefined) {
//         var imgURL = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + ticket;
//         $('#qrcodeImg').html('<img src=' + imgURL + ' style="display:block;width: 100%;height:100%;margin: 0px auto;"/>');
//         $('#qrcodeImg').show();
//     } else {
//         loadData("show", "errorTicket", true);
//     }
// }

/* 生成微信公众号二维码 */

$(function(){
    var pageUrl ={
        url:(window.location.href).split('#')[0]
    };

    $(document).on('click','#showQRcode',function(){
        $.ajax({
            url:"/get-sign"+"?action=get_sign_package",
            type:"post",
            data:pageUrl,
            success:function(data){
                var params = JSON.parse(data);

                /*生成带参数的二维码*/
                // var datas = {"expire_seconds": 604800, "action_name": "QR_STR_SCENE", "action_info": {"scene": {"scene_str": "test"}}};
                var str = "{\"expire_seconds\":604800,\"action_name\":\"QR_STR_SCENE\",\"action_info\":{\"scene\":{\"scene_str\":\"test\"}}}";
                if(params.accessToken != '' && params.accessToken != undefined){
                    $.ajax({
                        url:"/get-qrcode"+"?access_token="+params.accessToken,
                        type:"post",
                        data:str,
                        success:function(response){
                            showQRcode(response);
                        }
                    });
                }else {
                    alert('errorToken');
                }
            }
        });
    });


});

function showQRcode(response){
    if(response.ticket != '' && response.ticket != undefined){
        var imgURL = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='+ response.ticket;
        $('#qrcodeImg').html('<img src='+ imgURL +' style="display:block;width: 100%;height:100%;margin: 0px auto;"/>');
        $('#qrcodeImg').show();
    }else{
        alert('errorTicket');
    }

}