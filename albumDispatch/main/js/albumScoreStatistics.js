$(function() {
    $('.datepicker').on('focus', function() {
        WdatePicker({ dateFmt: 'yyyy-MM-dd' });
    });
    $('#search').on('click', function () {
        var startTime = $('#startTime').val();
        var endTime = $('#endTime').val();
        var url = "album/dispatch/monitor/queryAlbumScoreStatistics";
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
                document.getElementById("queryResult").style.display='none';
                document.getElementById("boxResult").innerHTML="";
                var id=new Date().getTime();
                document.getElementById("boxResult").innerHTML=makeTableHead(id);
                document.getElementById("tableBody").innerHTML="";
                for(var i=0;i<data.length;i++){
                    var tr=createElement(data[i]);
                    document.getElementById("tableBody").appendChild(tr);
                }
                document.getElementById("queryResult").style.display='block';
                $('#'+id).DataTable({
                    "aLengthMenu": [[5, 10, 20, 50, 100, -1], [5, 10, 20, 50, 100, "All"]],
                    "oLanguage": {
                        "sLengthMenu": "每页显示 _MENU_ 条记录",
                        "sZeroRecords": "没有匹配结果",
                        "sInfo": "显示第_START_至_END_项结果，共_TOTAL_项",
                        "sInfoEmpty": "没有数据",
                        "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                        "sSearch": "搜索",
                        "oPaginate": {
                            "sFirst": "<<",
                            "sPrevious": "<",
                            "sNext": ">",
                            "sLast": ">>"
                        }
                    },
                    aaSorting: [[0,'asc']]
                } );
            }
        });
    }else{
        alert("信息输入不完整!");
    }
}

function createElement(obj){
    var tr=document.createElement("tr");
    tr.innerHTML=
        "<td>"+obj.date+"</td>"+
        "<td>"+obj.result[1]+"</td>"+
        "<td>"+obj.result[2]+"</td>"+
        "<td>"+obj.result[3]+"</td>"+
        "<td>"+obj.result[4]+"</td>"+
        "<td>"+obj.result[5]+"</td>"+
        "<td>"+obj.result[6]+"</td>"+
        "<td>"+obj.result[0]+"</td>";
    return tr;
}

function makeTableHead(id){
    return "<table id=\""+id+"\" class=\"table table-bordered table-hover\">\n" +
        "<thead>\n" +
        "<tr>\n" +
        "<th>日期</th>\n" +
        "<th>[0,50)</th>\n" +
        "<th>[50,55)</th>\n" +
        "<th>[55,60)</th>\n" +
        "<th>[60,65)</th>\n" +
        "<th>[65,70)</th>\n" +
        "<th>[70,100)</th>\n" +
        "<th>质量分缺失</th>\n" +
        "</tr>\n" +
        "</thead>\n" +
        "<tbody id=\"tableBody\">\n" +
        "</tbody>\n" +
        " </table>";
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
