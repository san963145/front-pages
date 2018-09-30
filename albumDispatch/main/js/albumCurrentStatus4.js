$(function() {
    $('#search').on('click', function() {
        var dispatchStatus=$('#dispatchStatus').val();
        var recommendLevel=$('#recommendLevel').val();
        var obj={
            dispatchStatus: dispatchStatus,
            recommendLevel: recommendLevel
        };
        request(obj);
    });
});

function request(obj){
    $.ajax({
        url: "album/dispatch/monitor/queryByAlbumCurrentStatus",
        dataType: 'text',
        type: 'get',
        data: obj,
        success: function(data) {
            document.getElementById("queryResult").style.display='none';
            document.getElementById("boxResult").innerHTML="";
            var id=new Date().getTime();
            document.getElementById("boxResult").innerHTML=makeTableHead(id);
            document.getElementById("tableBody").innerHTML="";
            document.getElementById("tableBody").innerHTML=data;
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
                }
            });
        }
    });
}

function createElement(obj){
    var endTime=new Date(obj.endTime).format("yyyy-MM-dd hh:mm:ss");
    if(obj.endTime>new Date().getTime())endTime="-";
    var tr=document.createElement("tr");
    tr.innerHTML=
        "<td>"+obj.albumId+"</td>"+
        "<td>"+obj.title+"</td>"+
        "<td>"+convertDispatchStatus(obj.dispatchStatus)+"</td>"+
        "<td>"+obj.recommendLevel+"</td>"+
        "<td>"+new Date(obj.createTime).format("yyyy-MM-dd hh:mm:ss")+"</td>"+
        "<td>"+new Date(obj.startTime).format("yyyy-MM-dd hh:mm:ss")+"</td>"+
        "<td>"+endTime+"</td>"+
        "<td>"+obj.score+"</td>"+
        "<td>"+obj.showCount+"</td>"+
        "<td>"+obj.clickCount+"</td>"+
        "<td>"+obj.playCount+"</td>"+
        "<td>"+obj.playFinishCount+"</td>";
    return tr;
}
function makeTableHead(id){
    return "<table id=\""+id+"\" class=\"table table-bordered table-hover\">\n" +
        "<thead>\n" +
        "<tr>\n" +
        "<th>专辑ID</th>\n" +
        "<th>标题</th>\n" +
        "<th>投放状态</th>\n" +
        "<th>推荐等级</th>\n" +
        "<th>创建时间</th>\n" +
        "<th>启动时间</th>\n" +
        "<th>结束时间</th>\n" +
        "<th>质量分</th>\n" +
        "<th>展示次数</th>\n" +
        "<th>点击次数</th>\n" +
        "<th>播放次数</th>\n" +
        "<th>完播数</th>\n" +
        "</tr>\n" +
        "</thead>\n" +
        "<tbody id=\"tableBody\">\n" +
        "</tbody>\n" +
        " </table>";
}
function convertDispatchStatus(dispatchStatus){
    switch(dispatchStatus){
        case 0:return "Enable";break;
        case 1:return "Disable";break;
        case 2:return "Pause";break;
    }
}

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