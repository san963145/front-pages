$(function() {
    load();
    $('#addJob').on('click', function() {
        document.getElementById("tbody").appendChild(generateRow());
    });
});

function generateRow(){
    var tr=document.createElement("tr");
    tr.innerHTML="<td style=\"width:30%\"><textarea type=\"text\" class=\"form-control\" rows=\"2\"></textarea></td>\n" +
        "<td style=\"width:50%\"><textarea type=\"text\" class=\"form-control\" rows=\"2\"></textarea></td>\n" +
        "<td style=\"padding: 24px 8px 16px 8px;width:20%\">\n" +
        "<a style=\"display: inline;width: auto\" onclick='confirmAddJob(this)'>confirm</a>\n" +
        "<a style=\"display: inline;width: auto;float:right\" onclick='cancelRow(this)'>cancel</a>\n" +
        "</td>";
    return tr;
}

function load(){
    request("flink/job/load","");
}

function confirmAddJob(node){
    var tr=node.parentNode.parentNode;
    var jobName=tr.childNodes[0].firstChild.value;
    var args=tr.childNodes[2].firstChild.value;
    if(jobName.trim() && args.trim()){
        var url="flink/job/add";
        var obj={
            jobName: jobName,
            args: args
        };
        request(url,obj);
    }else{
        alert("Empty JobName or Args");
    }
}

function updateJob(node){
    if(confirm("confirm to update?")){
        var tr=node.parentNode.parentNode;
        var jobID=tr.childNodes[1].innerHTML;
        var jobName=tr.childNodes[3].innerHTML;
        var args=tr.childNodes[5].childNodes[1].value;
        var url="flink/job/update";
        var obj={
            jobID: jobID,
            jobName: jobName,
            args: args
        };
        request(url,obj);
    }
}

function deleteJob(node){
    if(confirm("confirm to delete?")){
        var tr=node.parentNode.parentNode;
        var jobID=tr.childNodes[1].innerHTML;
        var url="flink/job/delete";
        var obj={
            jobID: jobID
        };
        request(url,obj);
    }
}

function runJob(node){
    if(confirm("confirm to run?")){
        var tr=node.parentNode.parentNode;
        var jobID=tr.childNodes[1].innerHTML;
        var url="flink/job/run";
        var obj={
            jobID: jobID
        };
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'get',
            data: obj,
            success: function(data) {

            }
        });
    }
}

function cancelRow(node){
    var tbody=node.parentNode.parentNode.parentNode;
    tbody.removeChild(tbody.lastChild);
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
            "<td style=\"display: none\">"+data[i].jobID+"</td>\n"+
            "<td style=\"padding: 24px 8px 16px 8px;width: 30%\">"+data[i].jobName+"</td>\n" +
            "<td style=\"width:50%\">\n" +
            "<textarea type=\"text\" class=\"form-control\" rows=\"2\">"+data[i].args+"</textarea>\n" +
            "</td>\n" +
            "<td style=\"padding: 24px 8px 16px 8px;width: 20%\">\n" +
            "<a style=\"display: inline;width: auto\" onclick='runJob(this)'>run</a>\n" +
            "<a style=\"display: inline;width: auto;margin-left: 35px\" onclick='updateJob(this)'>update</a>\n" +
            "<a style=\"display: inline;width: auto;float:right\" onclick='deleteJob(this)'>delete</a>\n" +
            "</td>\n" + "</tr>"
        array.push(tr);
    }
    document.getElementById("result").innerHTML="<thead>\n" + "<tr>\n" +
        "<td>Job</td>\n" +
        "<td>Arguments</td>\n" +
        "<td>Action</td>\n" +
        "</tr>\n" +
        "</thead>\n" +
        "<tbody id=\"tbody\">"+array.join("")+"</tbody>";
}