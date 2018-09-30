$(function() {
    $('.datepicker').on('focus', function() {
        WdatePicker({ dateFmt: 'yyyy-MM-dd' });
    });
    $('#search').on('click', function () {
        var startTime = $('#startTime').val();
        var endTime = $('#endTime').val();
        var url = "album/dispatch/monitor/queryAlbumDispatchFlowRate";
        request(startTime,endTime,url);
    });
});
function request(startTime,endTime,url){
    if(startTime && endTime){
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'get',
            data: {
                queryStartTime: +new Date(startTime),
                queryEndTime: +new Date(endTime)
            },
            success: function(data) {
                if(data.length>0){
                    document.getElementById("queryResult").innerHTML="";
                    document.getElementById("queryResult").style.display='block';
                    for(var i=0;i<data.length;i++){
                        draw(data[i].type,data[i].lines);
                    }
                }else{
                    alert("Empty Result!");
                }
            }
        });
    }else{
        alert("信息输入不完整!");
    }
}
function draw(type,lines){
    if(lines.lenght==0)return;
    var div=document.createElement("div");
    //div.className+="col-md-12";
    div.innerHTML=generateBoxHtml(type);
    document.getElementById("queryResult").appendChild(div);
    var dom = document.getElementById(type);
    var myChart = echarts.init(dom);
    var xArray=new Array();
    var yDispatchedArray=new Array();
    var yRemainingArray=new Array();
    var yTodayDemandedArray=new Array();
    var yTotalFlowArray=new Array();
    for(var i=0;i<lines.length;i++)
     for(var j=0;j<lines[i].points.length;j++) {
        xArray.push(new Date(lines[i].points[j].ts).format('yyyy/MM/dd hh:mm:ss'));
        yDispatchedArray.push(lines[i].points[j].dispatchedCount);
        yRemainingArray.push(lines[i].points[j].remainingCount);
        yTodayDemandedArray.push(lines[i].points[j].totalDemandedCount);
        if(type=='total') yTotalFlowArray.push(lines[i].totalFlowCount);
        else yTotalFlowArray.push(0);
     }
    var option = {
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xArray
        },
        yAxis: {
            type: 'value'
        },
        legend: {
            data:['当日已投放数量','剩余待投放数量','当日需投放总数量','总流量或预测总流量']
        },
        tooltip: {
            trigger: 'axis'
        },
        series: [
            {
                name:'当日已投放数量',
                data: yDispatchedArray,
                type: 'line'
            },
            {
                name:'剩余待投放数量',
                data: yRemainingArray,
                type: 'line'
            },
            {
                name:'当日需投放总数量',
                data: yTodayDemandedArray,
                type: 'line'
            },
            {
                name:'总流量或预测总流量',
                data: yTotalFlowArray,
                type: 'line'
            }
        ]
    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}
function generateBoxHtml(type){
    return "<div class=\"box box-info\">\n" +
        "<div class=\"box-header with-border\">\n" +
        "<h3 class=\"box-title\">"+type+"</h3>\n" +
        "</div>\n" +
        "<div class=\"box-body\" id=\""+type+"\" style=\"height:400px\">\n" +
        "</div>\n" +
        "</div>"
}
$(function() {
    var date=new Date();
    var preday=new Date();
    var latestTime=$('#latestTime').val();
    preday.setDate(date.getDate()-latestTime);
    $('.datepicker').on('focus', function() {
        WdatePicker({ dateFmt: 'yyyy-MM-dd' });
    });
    $('#endTime').val(date.format('yyyy-MM-dd'));
    $('#startTime').val(preday.format('yyyy-MM-dd'));
    $('#latestTime').on('change', function() {
        date=new Date();
        $('#endTime').val(date.format('yyyy-MM-dd'));
        var latest=$('#latestTime').val();
        date.setDate(date.getDate()-latest);
        $('#startTime').val(date.format('yyyy-MM-dd'));
    });
});

Date.prototype.format = function(format) {
    var o = {
        "M+" : this.getMonth() + 1, // month
        "d+" : this.getDate(), // day
        "h+" : this.getHours(), // hour
        "m+" : this.getMinutes(), // minute
        "s+" : this.getSeconds(), // second
        "q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
        "S" : this.getMilliseconds()
        // millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }

    for ( var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
