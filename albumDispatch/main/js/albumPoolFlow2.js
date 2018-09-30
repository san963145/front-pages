$(function() {
    $('.datepicker').on('focus', function() {
        WdatePicker({ dateFmt: 'yyyy-MM-dd' });
    });
    $('#search').on('click', function () {
        var startTime = $('#startTime').val();
        var endTime = $('#endTime').val();
        var url = "album/dispatch/monitor/queryAlbumPoolFlowCount";
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
                    document.getElementById("queryResult").style.display='block';
                    draw(data);
                }else{
                    alert("Empty Result!");
                }
            }
        });
    }else{
        alert("信息输入不完整!");
    }
}
function draw(data){
    if(data.lenght==0)return;
    var dom = document.getElementById("graph");
    var myChart = echarts.init(dom);
    var xArray=new Array();
    var yFlowInArray=new Array();
    var yFlowOutArray=new Array();
    for(var i=0;i<data.length;i++){
        xArray.push(data[i].date);
        yFlowInArray.push(data[i].flowIn);
        yFlowOutArray.push(data[i].flowOut);
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
            data:['流入数量','流出数量']
        },
        tooltip: {
            trigger: 'axis'
        },
        series: [
            {
                name:'流入数量',
                data: yFlowInArray,
                type: 'line'
            },
            {
                name:'流出数量',
                data: yFlowOutArray,
                type: 'line'
            }
        ]
    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
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

