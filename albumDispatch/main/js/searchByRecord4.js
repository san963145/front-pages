$(function() {
    $('#searchByAlbum').on('click', function() {
        var albumId=$('#albumId').val();
        var startTime=$('#startTime').val();
        var endTime=$('#endTime').val();
        var reg="^[0-9]*$";
        var match=albumId.match(reg);
        if(match!=null){
            var url="album/dispatch/monitor/queryByAlbum";
            var obj={
                albumId: albumId,
                queryStartTime: +new Date(startTime),
                queryEndTime: +new Date(endTime)
            };
            request(albumId && startTime && endTime,obj,url,false);
        }else{
            alert("albumID格式错误!");
        }
    });
    $('#searchByDispatchStatus').on('click', function() {
        var dispatchStatus=$('#dispatchStatus').val();
        var startTime=$('#startTime').val();
        var endTime=$('#endTime').val();
        var url="album/dispatch/monitor/queryByDispatchStatus";
        var obj={
            dispatchStatus: dispatchStatus,
            queryStartTime: +new Date(startTime),
            queryEndTime: +new Date(endTime)
        };
        request(dispatchStatus && startTime && endTime,obj,url,true);
    });
    $('#searchByRecommendLevel').on('click', function() {
        var recommendLevel=$('#recommendLevel').val();
        var startTime=$('#startTime').val();
        var endTime=$('#endTime').val();
        var url="album/dispatch/monitor/queryByRecommendLevel";
        var obj={
            recommendLevel: recommendLevel,
            queryStartTime: +new Date(startTime),
            queryEndTime: +new Date(endTime)
        };
        request(recommendLevel && startTime && endTime,obj,url,true);
    });
});

function request(checked,obj,url,hasTitle){
    if(checked){
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'get',
            data: obj,
            success: function(data) {
                document.getElementById("queryResult").style.display='none';
                document.getElementById("boxResult").innerHTML="";
                var id=new Date().getTime();
                document.getElementById("boxResult").innerHTML=makeTableHead(id,hasTitle);
                document.getElementById("tableBody").innerHTML="";
                for(var i=0;i<data.length;i++){
                    var tr=createElement(data[i],hasTitle);
                    document.getElementById("tableBody").appendChild(tr);
                }
                document.getElementById("queryResult").style.display='block';
                var index=4;
                if(hasTitle)index=5;
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
                    aaSorting: [[index,'asc']]
                } );
            }
        });
    }else{
        alert("信息输入不完整!");
    }
}

function createElement(obj,hasTitle){
    var tr=document.createElement("tr");
    if(hasTitle){
        tr.innerHTML=
            "<td>"+obj.albumId+"</td>"+
            "<td>"+obj.title+"</td>"+
            "<td>"+convertDispatchStatus(obj.dispatchStatus)+"</td>"+
            "<td>"+obj.recommendLevel+"</td>"+
            "<td>"+obj.eventType+"</td>"+
            "<td>"+new Date(obj.updateTime).format("yyyy-MM-dd hh:mm:ss")+"</td>"+
            "<td>"+obj.operator+"</td>"+
            "<td>"+obj.reason+"</td>"+
            "<td>"+obj.score+"</td>"+
            "<td>"+obj.showCount+"</td>"+
            "<td>"+obj.clickCount+"</td>"+
            "<td>"+obj.playCount+"</td>"+
            "<td>"+obj.playFinishCount+"</td>";
    }else{
        tr.innerHTML=
            "<td>"+obj.albumId+"</td>"+
            "<td>"+convertDispatchStatus(obj.dispatchStatus)+"</td>"+
            "<td>"+obj.recommendLevel+"</td>"+
            "<td>"+obj.eventType+"</td>"+
            "<td>"+new Date(obj.updateTime).format("yyyy-MM-dd hh:mm:ss")+"</td>"+
            "<td>"+obj.operator+"</td>"+
            "<td>"+obj.reason+"</td>"+
            "<td>"+obj.score+"</td>"+
            "<td>"+obj.showCount+"</td>"+
            "<td>"+obj.clickCount+"</td>"+
            "<td>"+obj.playCount+"</td>"+
            "<td>"+obj.playFinishCount+"</td>";
    }
    return tr;
}
function makeTableHead(id,hasTitle){
    var column=""
    if(hasTitle)column="<th>标题</th>\n";
    return "<table id=\""+id+"\" class=\"table table-bordered table-hover\">\n" +
        "<thead>\n" +
        "<tr>\n" +
        "<th>专辑ID</th>\n" +
        column+
        "<th>投放状态</th>\n" +
        "<th>推荐等级</th>\n" +
        "<th>事件类型</th>\n" +
        "<th>事件时间</th>\n" +
        "<th>操作人</th>\n" +
        "<th>原因</th>\n" +
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

