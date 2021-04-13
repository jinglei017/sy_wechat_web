
 /* Echarts——饼图——图表（初始化后），图表标题（主标题） */
function PageChartPieOption(chart,chartTitle,subtext){
    chart.setOption({  // 显示标题，图例和空的坐标轴
        title: {
            text: chartTitle,
            textStyle:{
                //文字颜色
                color:'#000',
                //字体风格,'normal','italic','oblique'
                fontStyle:'normal',
                //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                fontWeight:'normal',
                //字体系列
                fontFamily:'sans-serif',
                //字体大小
                fontSize:16
            },
            subtext: subtext,
            x:'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)",
            position: ['1%', '7%']
        },
        color:['#f7a35c','#91ed7c','#424248','#8185e9','#d48265','#e5d354','#2a918f','#f55a5a','#91e9e1','#6e7074'],
        legend: {
            orient: 'vertical',
            x: 'left',
            data: []
        },
        /*toolbox: {
            show: true,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: {
                    show: true,
                    type: ['pie', 'funnel'],
                    option: {
                        funnel: {
                            x: '25%',
                            width: '50%',
                            funnelAlign: 'left',
                            max: 1548
                        }
                    }
                },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },*/
        series: [{
            name: chartTitle,
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: []
        }]
    });
    chart.showLoading();    //数据加载完之前先显示一段简单的loading动画
}

 /* Echarts——圆环图——图表（初始化后），图表标题（主标题） */
 function PageChartPieOption2(chart,chartTitle,subtext){
     chart.setOption({  // 显示标题，图例和空的坐标轴
         title: {
             text: chartTitle,
             textStyle:{
                 //文字颜色
                 color:'#000',
                 //字体风格,'normal','italic','oblique'
                 fontStyle:'normal',
                 //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                 fontWeight:'normal',
                 //字体系列
                 fontFamily:'sans-serif',
                 //字体大小
                 fontSize:16
             },
             subtext: subtext,
             x:'center'
         },
         // 点击图表各类别的弹出框
         tooltip: {
             trigger: 'item',
             formatter: "{a} <br/>{b}: {c} ({d}%)"
         },
         color:['#f25e81','#91ed7c','#f7a35c','#8185e9','#7db6ed'],
         // 图例
         legend: {
             orient: 'vertical',
             x: 'left',
             data: []
         },
         // graphic 是原生图形元素组件。可以支持的图形元素包括：image, text, circle, sector, ring, polygon, polyline, rect, line, bezierCurve, arc, group,
         graphic: {
             type: 'text',               // [ default: image ]用 setOption 首次设定图形元素时必须指定。image, text, circle, sector, ring, polygon, polyline, rect, line, bezierCurve, arc, group,
             top: '52%',              // 描述怎么根据父元素进行定位。top 和 bottom 只有一个可以生效。如果指定 top 或 bottom，则 shape 里的 y、cy 等定位属性不再生效。『父元素』是指：如果是顶层元素，父元素是 echarts 图表容器。如果是 group 的子元素，父元素就是 group 元素。
             left: '33%',             // 同上
             style: {
                 text: '',       // 文本块文字。可以使用 \n 来换行。[ default: '' ]
                 fill: '#000',           // 填充色。
                 fontSize: 16,           // 字体大小
                 fontWeight: 'bold'      // 文字字体的粗细，可选'normal'，'bold'，'bolder'，'lighter'
             }
         },
         // 工具栏（视图表格，保存成图片）
         /*toolbox: {
             show: true,
             feature: {
                 mark: { show: true },
                 dataView: { show: true, readOnly: false },
                 magicType: {
                     show: true,
                     type: ['pie', 'funnel'],
                     option: {
                         funnel: {
                             x: '25%',
                             width: '50%',
                             funnelAlign: 'left',
                             max: 1548
                         }
                     }
                 },
                 restore: { show: true },
                 saveAsImage: { show: true }
             }
         },*/
         series: [{
             name: chartTitle,
             type: 'pie',
             center: ['50%', '55%'],  // 图表位置
             radius: ['50%', '70%'],
             avoidLabelOverlap: false,
             // 点击图形，信息出现在中间
             /*label: {
                 normal: {
                     show: false,
                     position: 'center'
                 },
                 emphasis: {
                     show: true,
                     textStyle: {
                         fontSize: '25',
                         fontWeight: 'bold'
                     }
                 }
             },*/
             // 点击图形，信息出现在图形上
             label: {
                 normal: {
                     position: 'inner'
                 },
                 emphasis: {
                     show: true,
                     textStyle: {
                         fontSize: '17',
                         fontWeight: 'bold'
                     }
                 }
             },
             labelLine: {
                 normal: {
                     show: false
                 }
             },
             data: []
         }]
     });
     chart.showLoading();    //数据加载完之前先显示一段简单的loading动画
 }

 /* Echarts——柱状图（单）——图表（初始化后），图表标题（主标题），轴，数据 */
 // 轴——y轴
 function PageChartBarOption1(chart,chartTitle,yAxisList,seriesList){
     chart.setOption({  // 显示标题，图例和空的坐标轴
         color: ['#3398DB'],
         tooltip : {
             trigger: 'axis',
             axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                 type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
             },
             position: ['1%', '5%']
         },
         legend: {
             data:[chartTitle]
         },
         grid: {
             left: '3%',
             right: '4%',
             bottom: '3%',
             containLabel: true
         },
         xAxis : [
             {
                 type : 'value'
             }
         ],
         yAxis : [
             {
                 type : 'category',
                 axisTick : {show: false},
                 data : yAxisList
             }
         ],
         series : [
             {
                 name:chartTitle,
                 type:'bar',
                 label: {
                     normal: {
                         show: true,
                         position: 'inside'
                     }
                 },
                 data:seriesList
             }
         ]
     });
     chart.showLoading();    //数据加载完之前先显示一段简单的loading动画
 }
 // 轴——x轴
 function PageChartBarOption2(chart,chartTitle,yAxisList,seriesList){
     chart.setOption({  // 显示标题，图例和空的坐标轴
         color: ['#f45b5b'],
         /*tooltip : {
             trigger: 'axis',
             axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                 type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
             },
             position: ['1%', '5%']
         },*/
         tooltip: {                         // 修改点击图表的弹出框
             trigger: 'item',
             position: ['1%', '5%'],
             formatter: function(params) {
                 var res ='';
                 var myseries = seriesList;
                 for (var i = 0; i < myseries.length; i++) {
                     if(myseries[i].name==params.name){
                         res+=myseries[i].name+'</br>'+myseries[i].value +'&nbsp;'+ myseries[i].minUnit;
                     }

                 }
                 return res;
             }
         },
         legend: {
             data:[chartTitle]
         },
         grid: {
             left: '3%',
             right: '4%',
             bottom: '3%',
             containLabel: true
         },
         xAxis : [
             {
                 type : 'category',
                 data : yAxisList,
                 axisTick: {
                     alignWithLabel: true
                 },
                 axisLabel : {//坐标轴刻度标签的相关设置。
                     interval:0,
                     rotate:"90"
                 }
             }
         ],
         yAxis : [
             {
                 type : 'value'
             }
         ],
         series : [
             {
                 name:chartTitle,
                 type:'bar',
                 barWidth: '85%',
                 label: {
                     normal: {
                         show: true,
                         position: 'inside'
                     }
                 },
                 data:seriesList
             }
         ]
     });
     chart.showLoading();    //数据加载完之前先显示一段简单的loading动画
 }