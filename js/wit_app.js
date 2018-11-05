/**
 * @author W.Dong
 * @date 2018/11/2
 */
var _wd = {
    /**
     * 提示框
     * @$t:提示内容
     * @$c:提示框颜色
     */
    info: function ($t, $c) {
        var t = $t, c = $c, d = document.querySelector("#toAlert");
        var className = "AC fix F2 ma rad03e P05M MTH  LSP " + " " + c;
        if (d) {
            var div = d.querySelector("div");
            d.classList.remove("none");
            if (div.style.display == "none") div.style.display = "";
            div.innerHTML = '<div class="' + className + '" style="width:40%;top:50%;left:0; right: 0">' + t + '</div>';
        } else {

            var div = document.createElement("div");
            div.className = "CW CH fix index999";
            div.id = "toAlert";
            div.innerHTML = '<div class="' + className + '" style="width:40%;top:50%;left:0; right: 0">' + t + '</div>';
            document.body.appendChild(div);
        }
        setTimeout(function () {
            if (d) d.classList.add("none");
            else document.querySelector("#toAlert").classList.add("none");
        }, 3000);
    },
    /*
    * ajax数据交互
    * @url：地址
    * @asunc：异步？同步
    * @para：传输数据
    * @func：成功返回值方法
    * */
    ajax_formdata: function (url, async, para, func, error, file, noloading) {
        var xmlhttp, $this = this;
        var form = new FormData();
        if (para) {
            for (var i in para) {
                if (typeof para[i] == "object") {
                    form.append(i, JSON.stringify(para[i]));
                    continue;
                }
                form.append(i, para[i]);
            }
        }
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest()
        } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
        }
        xmlhttp.open("post", url, async);
//        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        if (file)
            xmlhttp.setRequestHeader("Content-type", "multipart/form-data");
        xmlhttp.onreadystatechange = function () {
            //console.log(xmlhttp);
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    var msg = xmlhttp.responseText;
                    func(msg);
                }
                else {
                    var funerr = error || function () {

                        _wd.info("服务器异常！", "bgc24");

                        console.log("服务器异常！", 1500);
                    };
                    funerr();
                }
            }
        };
        xmlhttp.send(form);
    },
    //获取url中"?"符后的字串
    getUrl: function () {
        var url = location.search;
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },
    /**时间格式化处理
     *
     * */
    dateFtt: function (fmt, date) {
        var o = {
            "M+": date.getMonth() + 1,                 //月份
            "d+": date.getDate(),                    //日
            "h+": date.getHours(),                   //小时
            "m+": date.getMinutes(),                 //分
            "s+": date.getSeconds(),                 //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    //创建时间格式化显示
    crtTimeFtt: function (value) {
        var crtTime = new Date(value);
        //直接调用公共JS里面的时间类处理的办法
        //yyyy-MM-dd hh:mm:ss
        return _wd.dateFtt("yyyy-MM-dd hh:mm:ss", crtTime);
    },
    /**
     * [Show_Hidden 点击控制div显示与隐藏]
     * @param {[id]} obj [需要显示隐藏div的id]
     */
    Show_Hidden: function (obj) {
        var div = document.getElementById(obj);
        if (div.className.indexOf("none") > -1) {
            div.classList.remove("none");
        } else {
            div.classList.add("none");
        }
    }
};