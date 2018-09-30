$(function() {
    $('.datepicker').on('focus', function() {
        WdatePicker({ dateFmt: 'yyyy-MM-dd' });
    });
    $('#searchByAlbum').on('click', function () {
        var albumId = $('#albumId').val();
        var startTime = $('#startTime').val();
        var endTime = $('#endTime').val();
        var traits;
        var array=new Array();
        $('.traitItem:checked').each(function(){
            array.push($(this).val());
        });
        traits=array.join(",");
        if(array.length==0){
            alert("未选择画像!");
            return;
        }
        request(albumId,startTime,endTime,traits);
    });
});

function request(albumId,startTime,endTime,traits){
    if(albumId && startTime && endTime){
        $.ajax({
            url: 'album/dispatch/monitor/queryAlbumTrait',
            dataType: 'json',
            type: 'get',
            data: {
                albumId: albumId,
                startTime: +new Date(startTime),
                endTime: +new Date(endTime),
                traits: traits
            },
            success: function(data) {
                if(data){
                    document.getElementById("queryResult").style.display='none';
                    document.getElementById("boxResult").innerHTML="";
                    var id=new Date().getTime();
                    document.getElementById("boxResult").innerHTML=makeTableHead(id,data.titles);
                    document.getElementById("tableBody").innerHTML="";
                    var records=data.records;
                    for(var i=0;i<records.length;i++){
                        var tr=createElement(records[i]);
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
                        aaSorting: [[0,'desc']]
                    } );
                }else{
                    alert("Empty Result!");
                }
            }
        });
    }else{
        alert("信息输入不完整!");
    }
}

function makeTableHead(id,titles){
    var array=new Array();
    for(var i=0;i<titles.length;i++){
        array.push("<th>"+titles[i]+"</th>\n");
    }
    return "<table id=\""+id+"\" class=\"table table-bordered table-hover\">\n" +
        "<thead>\n" +
        "<tr>\n" +
        array.join("")+
        "</tr>\n" +
        "</thead>\n" +
        "<tbody id=\"tableBody\">\n" +
        "</tbody>\n" +
        " </table>";
}

function createElement(record){
    var tr=document.createElement("tr");
    var array=new Array();
    for(var i=0;i<record.length;i++){
        array.push("<td>"+record[i]+"</td>");
    }
    tr.innerHTML=array.join("");
    return tr;
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