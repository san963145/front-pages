$(function() {
    var date=new Date();
    var preday=new Date();
    var latestTime=$('#latestTime').val();
    preday.setDate(date.getDate()-latestTime);
    $('.datepicker').on('focus', function() {
        WdatePicker({ dateFmt: 'yyyy/MM/dd HH:mm:ss' });
    });
    $('#endTime').val(date.format('yyyy/MM/dd hh:mm:ss'));
    $('#startTime').val(preday.format('yyyy/MM/dd hh:mm:ss'));
    $('#latestTime').on('change', function() {
        date=new Date();
        $('#endTime').val(date.format('yyyy/MM/dd hh:mm:ss'));
        var latest=$('#latestTime').val();
        date.setDate(date.getDate()-latest);
        $('#startTime').val(date.format('yyyy/MM/dd hh:mm:ss'));
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