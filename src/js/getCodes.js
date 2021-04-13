
/* 生成订单号二维码，条形码 */

$(function(){

    $(document).on('click','#showQRcode',function(){
        /*订单号二维码*/
        generateQRCode("table",200, 200, "SYDO1806091213480408");

        /*订单号条形码*/
        $("#barcode").barcode("SYDO1806091213480408", "code93",{barWidth:2, barHeight:30});  // way1
       // $("#barcode").barcode("SYDO1806091213480408", "code128",{barWidth:2, barHeight:30});  // way2

        $("#barcode").css('transform','rotate(-90deg)');
        $("#Codes").show();
    });

});

/*生成二维码*/
function generateQRCode(rendermethod, picwidth, picheight, url) {
    $("#qrcode").qrcode({
        render: rendermethod, // 渲染方式有table方式（IE兼容）和canvas方式
        width: picwidth, //宽度
        height:picheight, //高度
        text: utf16to8(url), //内容
        typeNumber:-1,//计算模式
        correctLevel:2,//二维码纠错级别
        background:"#ffffff",//背景颜色
        foreground:"#000000"  //二维码颜色

    });
}

//中文编码格式转换
function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c > 0x0001 || c == 0x0001) && (c < 0x007F || c == 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}
