function getStyle(obj, attr)
{
    if(obj.currentStyle)
    {
        return obj.currentStyle[attr];
    }
    else
    {
        return getComputedStyle(obj, false)[attr];
    }
}
function setStyle(obj, json)
{
    if(obj.length)
        for(var i=0;i<obj.length;i++) setStyle(obj[i], json);
    else
    {
        if(arguments.length==2) //json
            for(var i in json) setStyle(obj, i, json[i]);
        else    //name, value
        {
            switch(arguments[1].toLowerCase())
            {
                case 'opacity':
                    obj.style.filter='alpha(opacity:'+arguments[2]+')';
                    obj.style.opacity=arguments[2]/100;
                    break;
                default:
                    if(typeof arguments[2]=='number')
                    {
                        obj.style[arguments[1]]=arguments[2]+'px';
                    }
                    else
                    {
                        obj.style[arguments[1]]=arguments[2];
                    }
                    break;
            }
        }
    }
}
function $(id)
{
    return document.getElementById(id);
}

function getByClass(oParent,sClass)
{
    var aEle = oParent.getElementsByTagName('*');
    var aResult = [];
    var re=new RegExp('\\b'+sClass+'\\b', 'i');
    
    for(var i=0; i<aEle.length;i++)
    {
        if(aEle[i].className.search(re)!=-1)
        {
            aResult.push(aEle[i]);
        }
    }
    return aResult;
}

function setStyle3(obj, name, value)
{
    obj.style['Webkit'+name.charAt(0).toUpperCase()+name.substring(1)]=value;
    obj.style['Moz'+name.charAt(0).toUpperCase()+name.substring(1)]=value;
    obj.style['ms'+name.charAt(0).toUpperCase()+name.substring(1)]=value;
    obj.style['O'+name.charAt(0).toUpperCase()+name.substring(1)]=value;
    obj.style[name]=value;
}
function startMove(obj, json,options)
{
    options=options||{};
    options.time=options.time||700;
    options.type=options.type||'buffer';
    
    var count=parseInt(options.time/30);
    var n=0;
    
    //璧风偣
    var start={};
    var dis={};
    for(var i in json)
    {
        if(i=='opacity')
        {
            start[i]=Math.round(parseFloat(getStyle(obj, 'opacity'))*100);
        }
        else
        {
            start[i]=parseInt(getStyle(obj, i));
        }
        
        dis[i]=json[i]-start[i];
    }
    /*start={width: 100, height: 150}*/
    
    clearInterval(obj.timer);
    obj.timer=setInterval(function (){
        n++;
        
        for(var i in json)
        {
            switch(options.type)
            {
                case 'linear':
                    var cur=start[i]+dis[i]*n/count;
                    break;
                case 'buffer':
                    var a=1-n/count;
                    
                    var c=1-a*a*a;
                    
                    var cur=start[i]+dis[i]*c;
                    break;
            }
            
            if(i=='opacity')
            {
                obj.style.filter='alpha(opacity:'+cur+')';
                obj.style.opacity=cur/100;
            }
            else
            {
                obj.style[i]=cur+'px';
            }
        }
        
        if(n==count)
        {
            clearInterval(obj.timer);
            
            options.end && options.end();
            
            //alert(new Date().getTime()-s);
        }
    }, 30);
}

function addReady(fn)
{
    if(document.addEventListener)
    {
        document.addEventListener('DOMContentLoaded', fn, false);
    }
    else
    {
        //IE6-8
        var oS=document.createElement('script');
        var oHead=document.getElementsByTagName('head')[0];
        
        oHead.appendChild(oS);
        
        oS.defer=true;
        oS.onreadystatechange=function ()
        {
            if(oS.readyState=='complete')
            {
                fn();
            }
        };
    }
}

addReady(function()
{
    var oDiv = getByClass(document.body,'menu')[0];

    //检测是否有menu
    if(!getByClass(document.body,'menu')[0]){return false;}

    //工具json
    var tool_json = 
    {
        name:['工具/手册'],
        link:['http://www.aibusy.com/tools/css_selector/index.html','http://www.aibusy.com/zless/index.html','http://www.aibusy.com/tools/lessAnimation/index.html','http://www.aibusy.com/tools/character_code.html','http://tool.lu/'],
        text:['CSS选择器','zless','less动画','字符编码转换','CSS/JS格式化']
    }

    //快速导航
    var fastNav_json = 
    {
        name:['快速导航'],
        link:['http://aibusy.com/','http://aibusy.com/blog/','zless/index.html'],
        text:['首页','博客','zless']
    }

    //友情链接
    var links_json = 
    {
        name:['友情链接'],
        link:['http://www.w3cplus.com/','http://www.clevaly.com/','http://www.lesscss.net/'],
        text:['W3CPlus','Clevaly','Less官网']
    }

    //为menu创建菜单
    var creatMenu = document.createElement('div');

    creatMenu.innerHTML = '';
    creatMenu.className = 'menu_show';

    oDiv.appendChild(creatMenu);

    //创建内容
    function pushCont(json)
    {
        var oH3 = document.createElement('h3');
        var oItem = document.createElement('div');
        
        oItem.className = 'menu_item';

        creatMenu.appendChild(oH3);
        creatMenu.appendChild(oItem);

        oH3.innerHTML = json.name[0];

        //创建链接
        for(var i=0;i<json.link.length;i++)
        {
            var aLink = document.createElement('a');
            aLink.href = json.link[i];
            aLink.innerHTML = json.text[i];
            aLink.target = '_blank';
            oItem.appendChild(aLink);
        }

    }

    //插入
    pushCont(tool_json);
    pushCont(fastNav_json);
    pushCont(links_json);
    

    //menu事件
    oDiv.onmouseover = function()
    {
        creatMenu.style.display = 'block';
        startMove(creatMenu,{top:60,opacity:100},{time:200});
    }
    oDiv.onmouseout = function()
    {
        creatMenu.style.display = 'none';
        startMove(creatMenu,{top:30,opacity:0},{time:200});
    }


})