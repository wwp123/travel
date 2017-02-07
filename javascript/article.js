//评论
var $commentBox = $('.comment-box');
var $issueBtn = $commentBox.find('.issue-btn');
var $commentList = $commentBox.find('.comment_list');
var num = $commentBox.find('li').length;
var $textarea = $commentBox.find('textarea');
$issueBtn.on('click', function() {
	if($(this).siblings('textarea').val()) {
		var textVal = $(this).siblings('textarea').val();
		var htm = '<li>' +
			'	       <a href="#" class="portrait" title="xxx-1分钟前">' +
			'	           <img src="images/portrait.jpg" alt="头像"/>' +
			'	       </a>' +
			'	       <a href="#" class="name" title="xxx-1分钟前">xxx</a>' +
			'	       <span class="text">' + textVal + '</span>' +
			'	       <a href="javascript:;" class="btn reply-btn">回复</a>' +
			'	       <a href="javascript:;" class="btn delete-btn">删除</a>' +
			'	   </li>';
		$commentList.append(htm);
		$(this).siblings('.error').css('display', 'none');
		$(this).siblings('textarea').val('');
		num = $commentBox.find('li').length;
		$commentBox.find('.title').text('评论(' + num + ')');
	} else {
		$(this).siblings('.error').css('display', 'inline-block');
	}
});
$(document).on('click', '.delete-btn', function() {
	$(this).parents('li').remove();
	num = $commentBox.find('li').length;
	$commentBox.find('.title').text('评论(' + num + ')');
});
$(document).on('click', '.reply-btn', function() {
	$textarea.val('回复 xxx ');
	num = $commentBox.find('li').length;
	$commentBox.find('.title').text('评论(' + num + ')');
});

//reveal-modal
$('.reveal-modal a.close').on('click', function() {
	$(this).parents('.reveal-modal').foundation('reveal', 'close');
});

//富文本编辑器
//实例化编辑器
//建议使用工厂方法getEditor创建和引用编辑器实例，如果在某个闭包下引用该编辑器，直接调用UE.getEditor('editor')就能拿到相关的实例
var ue = UE.getEditor('editor', {
	toolbars: [
		['fullscreen', 'undo', 'redo', 'bold', 'italic',
			'underline', 'strikethrough', 'justifyleft',
			'justifycenter', 'justifyright', 'blockquote', 'link',
			'insertimage'
		]
	]
});

function isFocus(e) {
	alert(UE.getEditor('editor').isFocus());
	UE.dom.domUtils.preventDefault(e)
}

function setblur(e) {
	UE.getEditor('editor').blur();
	UE.dom.domUtils.preventDefault(e)
}

function insertHtml() {
	var value = prompt('插入html代码', '');
	UE.getEditor('editor').execCommand('insertHtml', value)
}

function createEditor() {
	enableBtn();
	UE.getEditor('editor');
}

function getAllHtml() {
	alert(UE.getEditor('editor').getAllHtml())
}

function getContent() {
	var arr = [];
	arr.push("使用editor.getContent()方法可以获得编辑器的内容");
	arr.push("内容为：");
	arr.push(UE.getEditor('editor').getContent());
	alert(arr.join("\n"));
}

function getPlainTxt() {
	var arr = [];
	arr.push("使用editor.getPlainTxt()方法可以获得编辑器的带格式的纯文本内容");
	arr.push("内容为：");
	arr.push(UE.getEditor('editor').getPlainTxt());
	alert(arr.join('\n'))
}

function setContent(isAppendTo) {
	var arr = [];
	arr.push("使用editor.setContent('欢迎使用ueditor')方法可以设置编辑器的内容");
	UE.getEditor('editor').setContent('欢迎使用ueditor', isAppendTo);
	alert(arr.join("\n"));
}

function setDisabled() {
	UE.getEditor('editor').setDisabled('fullscreen');
	disableBtn("enable");
}

function setEnabled() {
	UE.getEditor('editor').setEnabled();
	enableBtn();
}

function getText() {
	//当你点击按钮时编辑区域已经失去了焦点，如果直接用getText将不会得到内容，所以要在选回来，然后取得内容
	var range = UE.getEditor('editor').selection.getRange();
	range.select();
	var txt = UE.getEditor('editor').selection.getText();
	alert(txt)
}

function getContentTxt() {
	var arr = [];
	arr.push("使用editor.getContentTxt()方法可以获得编辑器的纯文本内容");
	arr.push("编辑器的纯文本内容为：");
	arr.push(UE.getEditor('editor').getContentTxt());
	alert(arr.join("\n"));
}

function hasContent() {
	var arr = [];
	arr.push("使用editor.hasContents()方法判断编辑器里是否有内容");
	arr.push("判断结果为：");
	arr.push(UE.getEditor('editor').hasContents());
	alert(arr.join("\n"));
}

function setFocus() {
	UE.getEditor('editor').focus();
}

function deleteEditor() {
	disableBtn();
	UE.getEditor('editor').destroy();
}

function disableBtn(str) {
	var div = document.getElementById('btns');
	var btns = UE.dom.domUtils.getElementsByTagName(div, "button");
	for(var i = 0, btn; btn = btns[i++];) {
		if(btn.id == str) {
			UE.dom.domUtils.removeAttributes(btn, ["disabled"]);
		} else {
			btn.setAttribute("disabled", "true");
		}
	}
}

function enableBtn() {
	var div = document.getElementById('btns');
	var btns = UE.dom.domUtils.getElementsByTagName(div, "button");
	for(var i = 0, btn; btn = btns[i++];) {
		UE.dom.domUtils.removeAttributes(btn, ["disabled"]);
	}
}

function getLocalData() {
	alert(UE.getEditor('editor').execCommand("getlocaldata"));
}

function clearLocalData() {
	UE.getEditor('editor').execCommand("clearlocaldata");
	alert("已清空草稿箱")
}

//标签插件
var setValue = '[]'; //赋值
var tag1 = new Tag('e1', {
	listUrl: 'javascript/tag.json',
	recoUrl: 'javascript/rec-tag.json',
	isReco: true,
	isdataPs1: true,
	//					width:300,
	isdataPs2: true,
	setValue: setValue,
	grayTip: "添加相关标签，输入用回车、空格、或逗号隔开",
});
tag1.setDataParser1(function(data1) { //下拉框
	var v = {};
	v.text = data1.tagName;
	v.id = data1.tagName;
	v.isSystem = data1.isSystem;
	return v;
});
tag1.setDataParser2(function(data2) { //推荐框
	//					var vl = {};
	//					vl.text = data2.tagName;
	//					vl.id=data2.tagName;
	//					vl.isSystem=data2.isSystem;
	//					return vl;
});
tag1.loadTag(); //加载插件

//授权
$(document).wSelect({
	fade: true,
	animate: true,
	size: '7'
});