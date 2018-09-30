$(function() {
    $('#newItem').on('hidden.bs.modal', function () {
        $(this).find("textarea").val('').end();
        $(this).find("input").val([]).end();
    });
    $('#updateItem').on('hidden.bs.modal', function () {
        $(this).find("textarea").val('').end();
        $(this).find("input").val([]).end();
    });
    load();
});

function load(){
    request("api/trait/config/load","");
}

function confirmAdd(){
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
    var idType=$('.IDType:checked').val();
    var name=$('#name').val().trim();
    var hdfsPath=$('#hdfsPath').val().trim();
    var tableName=$('#tableName').val().trim();
    if(idType && name && hdfsPath && tableName){
        var url="api/trait/config/add";
        var obj={
            name: name,
            hdfsPath: hdfsPath,
            tableName: tableName,
            idType: idType,
            traits: traits
        };
        request(url,obj);
        $('#newItem').modal('hide');
    }else{
        alert("填写不完整!");
    }
}

function confirmUpdate(){
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
    var id=document.getElementById("itemID").innerHTML;
    var url="api/trait/config/update";
    var obj={
        id: id,
        traits: traits
    };
    request(url,obj);
    document.getElementById("itemID").innerHTML="";
    $('#updateItem').modal('hide');
}

function update(node){
    var tr=node.parentNode.parentNode;
    var id=tr.childNodes[1].innerHTML;
    var name=tr.childNodes[3].innerHTML;
    var hdfsPath=tr.childNodes[5].innerHTML;
    var tableName=tr.childNodes[7].innerHTML;
    var idType=tr.childNodes[9].innerHTML;
    document.getElementById("itemID").innerHTML=id;
    $("#name2").val(name);
    $("#hdfsPath2").val(hdfsPath);
    $("#tableName2").val(tableName);
    $("#idType2").val(idType);
}

function deleteItem(node){
    if(confirm("confirm to delete?")){
        var tr=node.parentNode.parentNode;
        var id=tr.childNodes[1].innerHTML;
        var url="api/trait/config/delete";
        var obj={
            id: id
        };
        request(url,obj);
    }
}

function request(url,obj){
    $.ajax({
        url: url,
        dataType: 'json',
        type: 'get',
        data: obj,
        success: function(data) {
            if(data) refresh(data);
            else{
                document.getElementById("result").innerHTML="";
            }
        }
    });
}

function refresh(data){
    document.getElementById("result").innerHTML="";
    var array=new Array();
    for(var i=0;i<data.length;i++){
        var tr="<tr>\n" +
            "<td style=\"display: none\">"+data[i].id+"</td>\n" +
            "<td style=\"width: 10%;vertical-align: middle\">"+data[i].name+"</td>\n" +
            "<td style=\"width: 20%;vertical-align: middle\">"+data[i].hdfsPath+"</td>\n" +
            "<td style=\"width: 20%;vertical-align: middle\">"+data[i].tableName+"</td>\n" +
            "<td style=\"width: 10%;vertical-align: middle\">"+data[i].idType+"</td>\n" +
            "<td style=\"width: 20%;vertical-align: middle\">"+data[i].trait+"</td>\n" +
            "<td style=\"width: 20%;vertical-align: middle\">\n" +
            "  <a style=\"display: inline;width: auto\" onclick=\"update(this)\" data-toggle=\"modal\" data-target=\"#updateItem\">update</a>\n" +
            "  <a style=\"display: inline;width: auto;float:right\" onclick=\"deleteItem(this)\">delete</a>\n" +
            "</td>"+ "</tr>"
        array.push(tr);
    }
    document.getElementById("result").innerHTML="<thead>" + "<tr>\n" +
        "<td style=\"display: none\">id</td>\n" +
        "<td style=\"width: 10%;vertical-align: middle\">Name</td>\n" +
        "<td style=\"width: 20%;vertical-align: middle\">HdfsPath</td>\n" +
        "<td style=\"width: 20%;vertical-align: middle\">TableName</td>\n" +
        "<td style=\"width: 10%;vertical-align: middle\">IDType</td>\n" +
        "<td style=\"width: 20%;vertical-align: middle\">Trait</td>\n" +
        "<td style=\"width: 20%;vertical-align: middle\">Action</td>\n" +
        "</tr>\n" +
        "</thead>" +
        "<tbody id=\"tbody\">"+array.join("")+"</tbody>";
}