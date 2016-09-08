/**
 * Created by zd on 2015/7/6.
 */
$(function(){
    $('.panel').panel({
        contentWrap: $('.container'),
        close: function(e) {
            $('.container').removeAttr('style');
        }
    });

    $('#menuBtn').on('click', function (e) {
        $('.panel').panel('toggle', 'push');
    });
    if($.os.android){
    	$('#appBtn').attr('href', 'http://a.app.qq.com/o/simple.jsp?pkgname=com.cim120');
    } else if($.os.ios) {
    	$('#appBtn').attr('href', 'https://itunes.apple.com/cn/app/xi-meng-jian-kang/id927853584?mt=8');
    }
});