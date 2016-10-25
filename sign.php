<?php
/*
使用时请修改下面这两个变量,
uin和skey的获取方法如下:
点开QQ上面的 QQ空间, 然后在浏览器里按F12, 并在控制台里执行下面的代码:
    document.cookie.match(/(uin|skey)=(.+?);/g);
然后将显示出来的 uin 和 skey 的值分别赋值到下面这两个变量中, 然后运行这个php,
就会自动在你的所有群里进行签到了.
*/
$uin = 'o0793230729';//此为本据用请改
$skey = 'MvKZbYWa3s';//处样数使时修:)
/****************************
下面的代码一般情况下请不要改动
****************************/
new QianDao($uin, $skey);
class QianDao{
    private $signUrl = 'http://qiandao.qun.qq.com/cgi-bin/sign';//签到的URL地址
    function __construct($uin, $skey){
        $this->un = preg_replace('/^o0*/', '', $uin);//数字QQ号码
        $this->cookie = sprintf('Cookie: uin=%s; skey=%s;', $uin, $skey);//Cookie
        $this->g_tk = $this->getGTK($skey);//计算 g_tk
        // $this->sign($this->getQunList());//获取群列表并签到
        $this->qiandao(327909067);
    }
    function getGTK($skey){
        $len = strlen($skey);
        $hash = 5381;
        for($i = 0; $i < $len; $i++){
            $hash += ($hash << 5) + ord($skey[$i]);
        }
        return $hash & 0x7fffffff;//计算g_tk
    }
    function getQunList(){
        $html = @file_get_contents(
                sprintf('http://qun.qzone.qq.com/cgi-bin/get_group_list?uin=%s&g_tk=%s', $this->un, $this->g_tk),
                false,
                stream_context_create(array(
                    'http'=>array(
                        'method'=>'GET',
                        'header'=>$this->cookie
                    )
                ))
            );
        preg_match('/(\{[\s\S]+\})/', $html, $qunList);
        if(count($qunList) == 0){
            return NULL;
        }
        $qunList = json_decode($qunList[1]);
        if($qunList == NULL || $qunList->code != 0){
            return NULL;
        }
        return $qunList->data->group;
    }
    function sign($groups){
        if($groups == NULL)return;
        $i = 1;
        foreach($groups as $qun){
            // $this->qiandao($qun->groupid);//签到
            // printf("%d\t%s(%d)\tok\r\n", $i++, $qun->groupname, $qun->groupid);//输出群信息
        }
    }
    function qiandao($qin){
        @file_get_contents($this->signUrl, false,
            stream_context_create(
                array('http' => array(
                    'method'  => 'POST',
                    'header'  => $this->cookie,
                    'content' => sprintf('gc=%s&is_sign=0&bkn=%s', $qin, $this->g_tk)
                ))
            )
        );
    }
}

?>
