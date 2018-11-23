/**
 * @author W.Dong
 * @date 2018/11/2
 * @Description:数据交互接口
 */
var _phone = "18806097971";
var _editor = "W.Dong";
var url = "http://121.43.233.185/alumnicloudweb";
//http://121.43.233.185/alumnicloudweb
// var url = "http://192.168.10.5:8888";
var id = "";
//33303820012003301
//33303822009303
//获取学校id
if (_wd.getUrl()) {
    var s_guid = _wd.getUrl().Cid;
}
//获取班级id
id = s_guid + "2003301";
console.log(s_guid);

//返回值失败的情况
function m_Error(msg) {
    var p = JSON.parse(msg);
    if (p.result < 0) {
        _wd.info("服务器异常！", "bgc24");
        return false;
    }
    return true;
}

//班级信息
function class_message() {
    var para = {
        guid: s_guid,
        page: 1,
        pagesize: 1
    };
    _wd.ajax_formdata(url + "/school/queryByGuid.do", true, para, function (msg) {
        if (m_Error(msg)) {
            var p = JSON.parse(msg);
            // console.log(p);
            schoolname = p.message[0].name;//获取学校名称
            var para = {
                guid: id,
                page: 1,
                pagesize: 1
            };
            _wd.ajax_formdata(url + "/class/queryByGuid.do", true, para, function (msg) {
                if (m_Error(msg)) {
                    var p = JSON.parse(msg);
                    // console.log(p);
                    //获取班级和班主任
                    classname = p.message[0].name;
                    master = p.message[0].master;
                    document.getElementById("class_name").innerText = schoolname + classname + "班";
                    document.getElementById("class_master").innerText = "班主任：" + master;
                }
            });
        }
    });
}

//首页通知
function cl_index() {
    var f_notice = document.getElementById("first_notice");
    document.getElementById("index_notice").innerHTML = "";
    var para = {
        cid: id,
        page: 1,
        pagesize: 5//首页只展示五条数据
    };
    _wd.ajax_formdata(url + "/notice/queryByCid.do", true, para, function (msg) {
        if (m_Error(msg)) {
            var p = JSON.parse(msg).message;
            if (p.length > 0) {
                // console.log(JSON.parse(msg));
                //插入置顶通知，即数据库首条数据
                f_notice.innerText = "【" + p[0].title + "】" + p[0].notice;
                var sameTime;
                p.forEach(function (v) {
                    var date = _wd.crtTimeFtt(v.date);
                    var nowTime = _wd.getCurrentDate(1);//获取当前时间
                    var YMD = date.substring(0, 10);//获取数据中时间的年月日
                    var HM = date.substring(11, date.length);//获取数据中时间的时分
                    var DF_time = _wd.getDateDF(nowTime, YMD);//计算两者时间差天数
                    switch (DF_time) {
                        case 0:
                            YMD = "今天";
                            break;
                        case 1:
                            YMD = "昨天";
                            break;
                        case 2:
                            YMD = "前天";
                            break;
                    }
                    var timeTitle = "";
                    //判断是否为同一天的通知
                    if (sameTime != YMD) {
                        timeTitle = '<div class="AC colorA PB1M PT1M flexbox" id="index_time">' +
                            '                <img class="W31 FL" src="../images/icon/line-min.png" alt="">' +
                            '                <div class="W41 FL">' + YMD + '</div>' +
                            '                <img class="W31 FL" src="../images/icon/line-min.png" alt="">' +
                            '            </div>';
                    }
                    var div = document.createElement("div");
                    var id = "index_n_" + v.id;
                    var n_detail = v.notice;
                    if (n_detail.length == 0 || typeof(n_detail) == "undefined") {
                        n_detail = "";
                    }
                    //展开通知详情
                    div.onclick = function () {
                        _wd.Show_Hidden(id);
                    };
                    div.innerHTML = timeTitle +
                        '<div class=" bgc10 rad05  MB">' +
                        '                <div class="P1M W11 AL ">' +
                        '                    <div>通知：' + v.title + '</div>' +
                        '                    <div class="MT05  F2 colorA"><div class="FL W43 ellips">发布人：' + v.editor + '</div><div class="FR W41 AR">' + HM + '</div> </div>' +
                        '                   <div class="FL P1M none MT05 W11  rad03e color8 bgcaf5" id="index_n_' + v.id + '">' +
                        '                       <div class="LH2 F3">' + n_detail + '</div>' +
                        '                           </div>' +
                        '                    <div class="clear"></div>' +
                        '                </div>' +
                        '            </div>';
                    document.getElementById("index_notice").appendChild(div);
                    sameTime = YMD;
                });
            } else {
                //若无通知内容置空
                document.getElementById("top_notice").innerHTML = "";
                document.getElementById("index_tip").innerText = "";
            }

        }
    });
}

//发布通知页面
function Re_notice() {
    document.getElementById("re_notice").innerHTML = "";
    var div = document.createElement("div");
    div.className = " W11 index99 fix bgc9 CH";
    div.innerHTML = '<div class="top0 H W11 AC ffHT bgc9 ">发布通知' +
        '    <div  class="FL B4M H4M F2" onclick="dais.toggle(re_notice,0)"> 取消</div>' +
        '    <div  class="FR B4M H4M F2 color8" id="n_release" onclick="in_notice()"> 发布</div>' +
        '</div><div class="bgc10 W11 F2 AL">' +
        '<div  class="FL W11 F3 H4M LH3   bordBD1  bgcddc  color876 bord_select AC" id="n_tag" title="-1" data-t="radio" data-s="班务,探望,游玩,喜报,哀悼" />选择类型标签</div>' +
        '<input type="text" class=" FL H4M W11  ALP  bordBD1 " id="re_title" placeholder="输入标题"/>' +
        '<textarea class=" FL  W11  ALP  bordBD1 ffWRYH " rows="8"  style="resize:none"  id="re_content" placeholder="发布我的内容......" ></textarea>' +
        '<div class="W11 FL AR F1 colorA PR1M">最多输入250个字</div>' +
        '</div>';
    document.getElementById("re_notice").appendChild(div);
    dais.toggle("re_notice", 1);
    _wit.event.div_UI("s_select");
    //输入标题后 发布按钮 改变颜色
    document.getElementById("re_title").oninput = function () {
        var div = document.getElementById("n_release");
        if (this.value.length > 0) {
            if (document.getElementById("n_tag").innerText.indexOf("选择类型标签") > -1) {
                _wd.info("请选择类型标签！", "bgc44");
            } else {
                div.classList.remove("color8");
                div.classList.add("colorff");
            }
        } else {
            div.classList.remove("colorff");
            div.classList.add("color8");
        }
    };
}

//发布通知接口
function in_notice() {
    var type = parseInt(document.getElementById("n_tag").title);
    var title = document.getElementById("re_title").value;
    var notice = document.getElementById("re_content").value;
    if (type < 0 || title.length <= 0) {
        _wd.info("通知标签、标题不能为空", "bgc44");
    } else if (_wd.getBLen(title) > 50) {
        _wd.info("标题不能超过25个字！", "bgc44");
    } else if (_wd.getBLen(notice) > 500) {
        _wd.info("内容不能超过250个字！", "bgc44");
    } else {
        var para = {
            json: {
                sid: s_guid,
                cid: id,
                phone: _phone,
                type: type,
                editor: _editor,
                title: title,
                notice: notice,
                date: new Date().getTime(),
                replay: ""
            }
        };
        // console.log(para.json);
        _wd.ajax_formdata(url + "/notice/insert.do", true, para, function (msg) {
            // console.log(JSON.parse(msg));
            var p = JSON.parse(msg).result;
            if (p == 1) {
                dais.toggle(re_notice, 0);
                toMenu("cl_notice");
            } else {
                _wd.info("发布失败，请重试！", "bgc24");
            }
        });
    }
}

var tag_number = 1;//通知编号
var more_btn = 1;//计算点击更多次数

//通知消息
function cl_notice() {
    document.getElementById("cont_notice").innerHTML = "";
    tag_number = 1;
    getNoticeList(1);
}

//获取通知列表
function getNoticeList(page) {
    var para = {
        cid: id,
        page: page,
        pagesize: 20
    };
    _wd.ajax_formdata(url + "/notice/queryByCid.do", true, para, function (msg) {
        if (m_Error(msg)) {
            var p = JSON.parse(msg).message;
            var more_notice = document.getElementById("more_notice");
            if (p.length < 20 && p.length > 0) {
                more_notice.innerText = "—————— END ——————";
            } else if (p.length == 0) {
                more_notice.innerText = "已经没有更多了！";
                more_btn = 1;
            } else {
                more_notice.innerText = "点击加载更多";
            }
            p.forEach(function (v) {
                var div = document.createElement("div");
                div.className = " W11 AL";
                var id = "notice_" + v.id;
                var n_detail = v.notice;
                if (n_detail.length == 0 || typeof(n_detail) == "undefined") {
                    n_detail = "";
                }
                div.onclick = function () {
                    _wd.Show_Hidden(id);
                };
                div.innerHTML = '  <div class="W11 P1M bordBD1">' +
                    '<div class="thicker F3"><b class="colorO F3 italic MR">' + tag_number++ + ' </b> ' + v.title + '</div>' +
                    '<div class="FR F2 MT05 colorA">' + _wd.crtTimeFtt(v.date) + '</div>' +
                    '<div class="FL P1M none MT05 W11  rad03e color8 bgcaf5" id="notice_' + v.id + '">' +
                    '<div class="LH2 F3">' + n_detail + '</div>' +
                    '<div class="FR F2" > 发布人：' + v.editor + '</div>' +
                    '</div>' +
                    '<div class="clear"></div>' +

                    '</div>';
                document.getElementById("cont_notice").appendChild(div);
            });
        }
    });
}

//点击更多加载下一页列表
var moreNotice = document.getElementById("more_notice");
moreNotice.onclick = function () {
    more_btn++;
    getNoticeList(more_btn);
};

//添加通讯录
function cl_information() {
    daisWH(6,7);//设置默认座位表
    var cont = document.getElementById("phone_list");
    cont.innerHTML = "";
    var para = {
        cid: id,
        page: 1,
        pagesize: 50
    };
    _wd.ajax_formdata(url + "/member/queryByCid.do", true, para, function (msg) {
        if (m_Error(msg)) {
            var p = JSON.parse(msg).message;
            p.forEach(function (v) {
                var div = document.createElement("div");
                div.className = " W11 H7M bordBD1";
                div.innerHTML = '<li class="absolute W11 H7M bordBD1 bgc10 ofh index9">' +
                    '<img class="FL B5M rad0 M" src="../images/pic1.png" alt=""> ' +
                    '<div class="FL  C8M MT05 LH2"> ' +
                    '<div class="FL W21 color876 bold ofh F3">' + v.name + '</div> ' +
                    '<div class="FR W21 AR color8 F3 ofh">' + v.dept + v.job + '</div> ' +
                    '<div class="FL W11 color8 F3 ellips AL">' + v.comp +
                    '</div></div></li>' +
                    '<div class="absolute left0 B7M H7M F4 AC LH4 bgc36 color1 ">详情</div>' +
                    '<div class="absolute right0 B7M H7M F4 AC LH4 bgc45 color1 ">打电话</div>"';
                var li = div.querySelector("li");
                SomeEvent(li, {
                    MOVE_LIMIT_BACK: true
                    , CW: CW
                    , S: M * 6
                    , L: M * 12
                    , MOVE_BACK: {_X: 10, X_: CW - 10}
                    , MOVE_LIMIT: true
                }, f, {});
                cont.appendChild(div);
            });
        }
    });
    var f = {
        A_L: function () {
            console.log("1");
        },
        A_R: function () {
            console.log("2");
        },
        A_O: function () {

        }
    }
}
function classmatesMember() {

}
var ph_more_btn = 1;
//档案
function cl_photo() {
    console.log("cl_photo");
    ph_more_btn = 1;
    var ph_img = document.getElementById("ph_img");
    ph_img.innerHTML = "";
    var ph_video = document.getElementById("ph_video");
    ph_video.innerHTML = "";
    var ph_word = document.getElementById("ph_word");
    ph_word.innerHTML = "";
    get_cl_Photo(ph_more_btn, 1);//获取相册
    get_cl_Photo(ph_more_btn, 2);//获取视频文件夹
    get_cl_Photo(ph_more_btn, 4);//获取文件
    //添加毕业照小白点
    add_photoindex();

}

//添加毕业照的小白点
function add_photoindex() {
    var ph_photoindex = document.getElementById("ph_index");
    ph_photoindex.innerHTML = "";
    by_photos.forEach(function () {
        var div = document.createElement("li");
        div.className = " color8 radius index9 inlineB F8";
        div.innerHTML = '&#8226';
        ph_photoindex.appendChild(div);
    });
    ph_photoindex.children[0].className = ph_white;//设置初始状态的小白点
    document.getElementById("by_photo").src = "../images/byz/" + by_photos[0];//设置初始图片
}

function get_cl_Photo(page, type) {
    // console.log(page);
    var ph_img = document.getElementById("ph_img");
    var ph_video = document.getElementById("ph_video");
    var ph_word = document.getElementById("ph_word");
    var para = {
        cid: id,
        type: type,
        page: page,
        pagesize: 7
    };
    _wd.ajax_formdata(url + "/recordGroup/queryByType.do", true, para, function (msg) {
        if (m_Error(msg)) {
            var p = JSON.parse(msg).message;
            // console.log(JSON.parse(msg));
            var more_div = document.createElement("div");
            more_div.className = " FL ML";
            more_div.id = "ph_more_type" + type;
            more_div.onclick = function () {
                ph_more_btn++;
                get_cl_Photo(ph_more_btn, type);
            };
            if (p.length > 6) {
                more_div.innerHTML = "<div id='more_btn_img" + type + "'>" +
                    "<img class='A41  bgc8 P2M' src='../images/icon/more.png' >" +
                    '<div class="F2 ellips A41 PB1M AC color8">更多...</div></div>';
            } else {
                var pa_id = "ph_more_type" + type;
                if (document.getElementById(pa_id)) {
                    var more_img = "more_btn_img" + type;
                    document.getElementById(pa_id).removeChild(document.getElementById(more_img));
                } else {

                }
            }
            p.forEach(function (v) {
                var div = document.createElement("div");
                div.className = " FL ML class_files";
                div.id = "ph_" + v.id;
                div.onclick = function () {
                    addPhotos(v.id, v.name, v.phone, v.date, type);
                };
                var imgurl = "";
                var para = {
                    cid: id,
                    gid: v.id,
                    page: 1,
                    pagesize: 1
                };
                _wd.ajax_formdata(url + "/record/queryByGid.do", true, para, function (msg) {
                    if (m_Error(msg)) {
                        var p = JSON.parse(msg);
                        var imgSrc = "";
                        var imgHtml = "";
                        imgurl = p.logoPath;
                        if (p.message.length > 0) {//相册中含有图片的使用相册首张作为封面
                            imgSrc = imgurl + p.message[0].src;
                            imgHtml =  '<img class="W11 H11 OFC"  src="' + imgSrc + '" alt="" onerror="_wd.noFind_Pic(this)">'
                        } else {//若为空相册则用默认封面，根据type值区分，并且样式上添加P1M
                            switch (type) {
                                case 1:
                                    imgSrc = "../images/icon/null_pic.png";
                                    break;
                                case 2:
                                    imgSrc = "../images/icon/null_video.png";
                                    break;
                                case 4:
                                    imgSrc = "../images/icon/null_flw.png";
                                    break;
                            }
                            imgHtml =  '<img class="W11 P1M H11 OFC"  src="' + imgSrc + '" alt="" onerror="_wd.noFind_Pic(this)">'
                        }
                        div.innerHTML = '<div class="pic44  bgc9 AC ofh">'+imgHtml+
                            '</div>' +
                            '<div class="F2 ellips A41 PB1M AC color8">' + v.name + '</div>';
                        switch (type) {
                            case 1:
                                ph_img.appendChild(div);
                                break;
                            case 2:
                                ph_video.appendChild(div);
                                break;
                            case 4:
                                ph_word.appendChild(div);
                                break;
                        }
                    }
                });
            });
            switch (type) {
                case 1:
                    ph_img.appendChild(more_div);
                    break;
                case 2:
                    ph_video.appendChild(more_div);
                    break;
                case 4:
                    ph_word.appendChild(more_div);
                    break;
            }

        }
    });
    // _wd.clear(ph_img);
    // _wd.clear(ph_video);
    // _wd.clear(ph_word);
}

function ph_type_list(type) {
    switch (type) {
        case 1:
            return "相册";

        case 2:
            return "视频";

        case 4:
            return "文件";

    }
}

//新建相册页面
function newPhoto(type) {
    var cont = document.getElementById("ph_new");
    cont.innerHTML = "";
    var h_tag = "";
    switch (type) {
        case 1:
            h_tag = "新建相册";
            break;
        case 2:
            h_tag = "新建视频集";
            break;
        case 4:
            h_tag = "新建文件夹";
            break;
    }
    var in_place = h_tag.substring(2, h_tag.length);
    var div = document.createElement("div");
    div.className = "W11";
    div.innerHTML = '      <div class="top0 H W11 AC bgc9 ffHT">' + h_tag +
        '            <div class="FL B4M H4M F2" onclick="dais.toggle(ph_new,0)">取消</div>' +
        '            <div class="FR B4M H4M F2 color8" onclick=""></div>' +
        '        </div>' +
        '        <div class="bgc10 W11 P1M AC">' +
        '            <input type="text" id="folder_name" class="AL H5M W11 F4  color8 bordBD1" placeholder="填写' + in_place + '名称"/>' +
        '<textarea id="folder_memo" class="W11 color8  ALP  bordBD1 ffWRYH " rows="5"  style="resize:none"  id="re_content" placeholder="' + in_place + '描述（非必填）" ></textarea>' +
        // '            <input type="text" id="folder_memo" class="AL H3M W11 F2 italic color8 bordBD1" placeholder="' + in_place + '描述（非必填）"/>' +
        '            <div class="MT2 W54 ma  AC bgcff rad03e P05M F3 color1 " onclick="addFolder(' + type + ')">完成创建</div>' +
        '        </div>';
    cont.appendChild(div);
    dais.toggle("ph_new", 1);
}

//添加相册接口
function addFolder(type) {
    var fol_name = document.getElementById("folder_name").value;
    var para = {
        json: {
            sid: s_guid,
            cid: id,
            phone: _phone,
            type: type,
            name: fol_name,
            memo: "",
            date: new Date().getTime()
        }
    };
    _wd.ajax_formdata(url + "/recordGroup/insert.do", true, para, function (msg) {
        var p = JSON.parse(msg).result;
        // console.log(JSON.parse(msg));
        if (p > 0) {
            dais.toggle("ph_new", 0);
            toMenu("cl_photo");
        } else {
            _wd.info("创建失败！", "bgc24");
        }
    });
}

function ph_addMore($id, $page) {
    var para = {
        cid: id,
        gid: $id,
        page: $page,
        pagesize: 18
    };
    _wd.ajax_formdata(url + "/record/queryByGid.do", true, para, function (msg) {
        if (m_Error(msg)) {
            var imgurl = JSON.parse(msg).logoPath;
            var p = JSON.parse(msg).message;
            console.log(p);
            var ph_img = document.getElementById("ph_list");
            var ph_more = document.getElementById("ph_addMore");
            if (p.length == 0) {
                ph_more.innerText = "没有内容了";
            }
            else {
                if (p.length < 18) {
                    ph_more.innerText = "没有内容了";
                }
                p.forEach(function (v) {
                    var div = document.createElement("div");
                    div.className = "pic33 FL ML ofh AC";
                    div.onclick = function () {
                    };
                    div.innerHTML =
                        '<img class=" W11 H11 P05M OFC"  src="' + imgurl + v.src + '" alt="" onerror="_wd.noFind_Pic(this)">';
                    ph_img.appendChild(div);
                });
            }
            _wd.clear(ph_img);
        }
    });
}

function addPhotos($id, $name, $phone, $date, $type) {
    var record_id = $id;
    var record_name = $name;
    if (record_name.length > 10) {
        record_name = record_name.substring(0, 10) + "…";
    }
    var cont = document.getElementById("re_photo");
    cont.innerHTML = "";
    var div = document.createElement("div");
    div.className = "index100 absolute top0 left0  bgc9 W11 CHmin ofh";
    div.id = "detail_ph";
    div.innerHTML = '  <div class="fix index100 top0 H bgc9 W11 AC ffHT " id="ph_name">' + record_name +
        '<div class="FL B4M H4M F2" id="ph_return_up"><b class="F3 ">&lt;</b>返回</div>' +
        '<div class="FR B4M H4M F2 color8" onclick=""></div>' +
        '</div>' +
        '<div class="bgc10 W11 P1M">' +
        '<div class="H"></div>' +
        '<div class="FL W43 color8 P05M AL ellips" id="ph_title">' + record_name +
        '</div>' +
        '<div  class="FR  rad03e bgcff P05M W41 AC relative" id="add_photo" >上传' + ph_type_list($type) +
        '</div>' +
        '<input type="file" id="up_photo" multiple="multiple" accept="image/*" class="none" capture="camera" >' +
        '<div class="clear">' +
        '</div></div>' +
        '<div class=" bgc10 P1M  F2  W11 colorA"><div class="FL W42 ellips">创建者：' + $phone + '</div>' +
        '<div class="FR W42 ellips AR">' + _wd.crtTimeFtt($date) + '</div><div class="clear"></div> </div>' +
        '<div class="W11 bgc10" id="ph_list">' +
        '</div>' +
        '<div class="W11 H4M AC color8 F2 PT1M" id="ph_addMore">点击加载更多...</div>';
    cont.appendChild(div);
    _wd.show(cont);
    document.getElementById("photo").classList.add("CHNH");
    document.getElementById("ph_return_up").onclick = function () {
        _wd.deleteChild("re_photo", "detail_ph");
        document.getElementById("photo").classList.remove("CHNH");
    };
    var ua = navigator.userAgent.toLowerCase(); //判断是否是苹果手机，是则是true
    var isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);
    if (isIos) {
        document.getElementById("up_photo").removeAttribute("capture");
    }
    ph_addMore(record_id, 1);
    var ph_more = document.getElementById("ph_addMore");
    var ph_more_number = 1;
    ph_more.onclick = function () {
        ph_more_number++;
        ph_addMore(record_id, ph_more_number);
    };

    var input = document.getElementById("up_photo");
    input.value = "";
    var result;
    var dataArr = []; // 储存所选图片的结果(文件名和base64数据)
    var fd;  //FormData方式发送请求
    var oSelect = document.getElementById("add_photo");
    // var oAdd = document.getElementById("add");
    var oInput = document.getElementById("up_photo");
    if (typeof FileReader === 'undefined') {
        // alert("抱歉，你的浏览器不支持 FileReader");
        input.setAttribute('disabled', 'disabled');
    } else {
        input.addEventListener('change', readFile, false);
    }

    function readFile() {
        fd = new FormData();
        var iLen = this.files.length;
        var index = 0;
        var cont = document.getElementById("ph_upload");
        // cont.innerHTML = "";
        var div = document.createElement("div");
        div.id = "ph_up_list" + record_id;
        div.className = "index100 absolute top0 left0  bgc10 W11 CHmin";
        div.innerHTML = '  <div class="fix index100 top0 H bgc9 W11 AC ffHT ">' +
            '<div class="FL B4M H4M F2" id="up_return">&lt;&nbsp;返回</div>' +
            '<div class="FR B4M H4M F2 color8 " id="ph_upload_btn" >上传</div>' +
            '</div>' +
            // '<div class="H4M AC W11  colorA MTH" onclick="add_up_morePic()">添加照片</div>' +
            // '<div class="F2 AC W11 MT colorA" id="dbclick_delete"></div>' +
            '<div class="bgc10 W11 P05M MTH" id="ch_list">' +
            '</div>';
        cont.appendChild(div);
        _wd.show(cont);
        document.getElementById("detail_ph").classList.add("H1M");
        document.getElementById("up_return").onclick = function () {
            _wd.deleteChild("ph_upload", "ph_up_list" + record_id);
            document.getElementById("detail_ph").classList.remove("H1M");
        };
        // dais.toggle("ph_upload", 1);
        for (var i = 0; i < iLen; i++) {
            if (!input['value'].match(/.jpg|.gif|.png|.jpeg|.bmp/i)) {　　//判断上传文件格式
                return alert("上传的图片格式不正确，请重新选择");
            }
            var reader = new FileReader();
            reader.index = i;
            fd.append("files", this.files[i]);
            console.log(this.files[i]);
            reader.readAsDataURL(this.files[i]);  //转成base64
            reader.fileName = this.files[i].name;
            reader.onload = function (e) {
                var imgMsg = {
                    name: this.fileName,//获取文件名
                    base64: this.result   //reader.readAsDataURL方法执行完后，base64数据储存在reader.result里
                };
                dataArr.push(imgMsg);
                result = '<img class=" index99 relative H1M B1M topM" src="../images/icon/delete.png" id="delete_ph' + imgMsg.name + '" alt=""> <img class=" W11 H11 P05M OFC" src="' + this.result + '" alt=""/> ';
                var div1 = document.createElement('div');
                div1.index = index;
                div1.innerHTML = result;
                var upload_btn = document.getElementById("ph_upload_btn");
                if (div1.innerHTML.length > 0) {
                    // document.getElementById("dbclick_delete").innerText = "长按图片删除！";
                    upload_btn.classList.add("colorff");
                    upload_btn.classList.remove("color8");
                } else {
                    upload_btn.classList.add("color8");
                    upload_btn.classList.remove("colorff");
                }
                div1.className = "FL M05 pic33 ofh";
                div1.id = "delete_p" + imgMsg.name;
                document.getElementById("ch_list").appendChild(div1);
                var deletePicId = "delete_ph" + imgMsg.name;
                var deletePic = document.getElementById(deletePicId);
                deletePic.onclick = function () {
                    this.parentNode.remove();                  // 在页面中删除该图片元素
                    delete dataArr[this.index];  // 删除dataArr对应的数据
                    fd.delete(index);
                    // console.log(oInput.value);
                };
                index++;
            }
        }
        document.getElementById("ph_upload_btn").onclick = function () {
            // var fd = new FormData();
            fd.append("json", JSON.stringify({
                cid: id,
                sid: s_guid,
                gid: record_id,
                phone: _phone,
                type: $type,
                name: "测试图片",
                src: "",
                memo: "测试备注",
                date: new Date().getTime(),
                replay: ""
            }));
            // Array.prototype.forEach.call(ipt_id.files, function (v) {
            //     // console.log(ipt_id.files);
            //     console.log(v);
            //     fd.append("files", v);
            // });
            console.log(fd);
            _wd.ajax_formdata(url + "/record/insert.do", true, fd, function (msg) {
                _wd.hide("ph_upload");
                _wd.hide("re_photo");
                toMenu("cl_photo");
                console.log(msg);
            }, function (msg) {
                _wd.info("无法上传，请重试！", "bgc24");
            });
        }
    }

    oSelect.onclick = function () {
        oInput.value = "";   // 先将oInput值清空，否则选择图片与上次相同时change事件不会触发
        //清空已选图片
        dataArr = [];
        index = 0;
        oInput.click();
    };
}

/**
 * 上传图片
 * @type:类型
 * @ipt_id:input上传控件id
 * @gid:相册id
 * */
function Re_insert(type, ipt_id, gid) {
    var fd = new FormData();
    fd.append("json", JSON.stringify({
        cid: id,
        sid: s_guid,
        gid: gid,
        phone: _phone,
        type: type,
        name: "测试图片",
        src: "",
        memo: "测试备注",
        date: new Date().getTime(),
        replay: ""
    }));
    Array.prototype.forEach.call(ipt_id.files, function (v) {
        // console.log(ipt_id.files);
        console.log(v);
        fd.append("files", v);
    });
    console.log(fd);
    _wd.ajax_formdata(url + "/record/insert.do", true, fd, function (msg) {
        _wd.hide("ph_upload");
        _wd.hide("re_photo");
        toMenu("cl_photo");
        console.log(msg);
    }, function (msg) {
        _wd.info("无法上传，请重试！", "bgc24");
    });
}
