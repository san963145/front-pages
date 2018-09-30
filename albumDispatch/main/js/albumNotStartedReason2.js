$(function() {
    $('#search').on('click', function() {
        var albumId=$('#albumId').val();
        var startTime=$('#startTime').val();
        var endTime=$('#endTime').val();
        var reg="^[0-9]*$";
        var match=albumId.match(reg);
        if(match!=null){
            var url="album/dispatch/monitor/queryAlbumNotStartedReason";
            var obj={
                albumId: albumId,
                queryStartTime: +new Date(startTime),
                queryEndTime: +new Date(endTime)
            };
            request(obj,url);
        }else{
            alert("albumID格式错误!");
        }
    });
});

function request(obj,url){
    $.ajax({
        url: url,
        dataType: 'json',
        type: 'get',
        data: obj,
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
                aaSorting: [[3,'desc']]
            } );
        }
    });
}

function createElement(obj){
    var tr=document.createElement("tr");
    tr.innerHTML=
        "<td>"+obj.albumId+"</td>"+
        "<td>"+obj.title+"</td>"+
        "<td>"+new Date(obj.createTime).format("yyyy-MM-dd hh:mm:ss")+"</td>"+
        "<td>"+new Date(obj.ts).format("yyyy-MM-dd hh:mm:ss")+"</td>"+
        "<td>"+obj.reason+"</td>"
    return tr;
}
function makeTableHead(id){
    return "<table id=\""+id+"\" class=\"table table-bordered table-hover\">\n" +
        "<thead>\n" +
        "<tr>\n" +
        "<th>专辑ID</th>\n" +
        "<th>标题</th>\n" +
        "<th>创建时间</th>\n" +
        "<th>启动失败时间</th>\n" +
        "<th>原因</th>\n" +
        "</tr>\n" +
        "</thead>\n" +
        "<tbody id=\"tableBody\">\n" +
        "</tbody>\n" +
        " </table>";
}