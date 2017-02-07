(function( $ ){
	// 对Date的扩展，将 Date 转化为指定格式的String
	// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
	// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
	// 例子： 
	// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
	// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
	Date.prototype.format = function (fmt) { //author: meizz 
	    var o = {
	        "M+": this.getMonth() + 1, //月份 
	        "d+": this.getDate(), //日 
	        "h+": this.getHours(), //小时 
	        "m+": this.getMinutes(), //分 
	        "s+": this.getSeconds(), //秒 
	        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	        "S": this.getMilliseconds() //毫秒 
	    };
	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	    for (var k in o)
	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	    return fmt;
	}
	/*第1个参数是加载编辑器div容器，第2个参数是编辑器类型，第3个参数是div容器宽，第4个参数是div容器高*/
    var dataImg,NUM,dataId;

	  
	xiuxiu.embedSWF("xiuxiu_img",1,"700px","600px","img1");
	
	xiuxiu.onInit = function (id)
	{
        xiuxiu.loadPhoto(dataImg, false);
        xiuxiu.setUploadURL("http://192.168.16.101/upload/fileUpload.sp?act=uploadSave&appId=00000001&caseId=00000019");
        xiuxiu.setUploadType(2);
	}
	xiuxiu.onUploadResponse = function (vo)
	{	
		console.log("上传响应" + vo);
		var data= eval("("+vo+")");
        $('#'+dataId).find('.imgWrap img').attr('src',data.thumbnailUrl);
        baseMode.arr_images[NUM].raw = data.fileUrl;
        baseMode.arr_images[NUM].thumbnail_url=data.thumbnailUrl;
        $('#xiuxiu').foundation('reveal','close');
	}
	
	xiuxiu.onDebug = function (data)
	{
        console.log("错误响应" + data);
	}
	
	xiuxiu.onClose = function (id)
	{
        //alert(id + "关闭");
        clearFlash();
	}
	
	//清除flash
    function clearFlash()
    {
        document.getElementById("flashEditorOut").innerHTML='<div id="flashEditorContent"><p><a href="http://www.adobe.com/go/getflashplayer"><img alt="Get Adobe Flash player" src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif"></a></p></div>';
    }
	
	var uploaderInit = {
    	//批量管理按钮
    	batchManageBtn:function(){
    		var page = this;
			$('#batchBtn').click(function() {
				$('#manageBar').toggle();
				var isHide = $("#manageBar").is(":hidden");
				if (isHide) {
					$('#uploader').find('.filelist .success').removeClass("checked").hide();
				} else {
					document.getElementById("checkbox1").checked = false;
					$('#uploader').find('.filelist .success').removeClass("checked").show();
					$('#check-num').html("0");
				}
			});
    		$('#checkbox1').click(function() {
				var isCheck = document.getElementById("checkbox1").checked;
				var num = $('#uploader').find('.filelist .success').length;

				if (isCheck) {
					$('#uploader').find('.filelist .success').removeClass("checked").addClass('checked');
					$('#check-num').html(num);
				} else {
					$('#uploader').find('.filelist .success').removeClass("checked");
					$('#check-num').html("0");
				}
			});
			//批量编辑按钮
			$('#editBtn').click(function() {
				var num = $('#check-num').html();
				if (num == "0") {
					//$('#edit_imginfo_1').foundation('reveal', 'close');
					jqBaseapp.popup("请选择文件", "2");
				} else {
					$('#edit_imginfo').foundation('reveal', 'open');
				}
				//清空编辑框
				clearPhotoEditInfo();
			});
			$('#deleBtn').click(function() {
				var num = $('#check-num').html();
				if (num == "0") {
					//$('#edit_imginfo_1').foundation('reveal', 'close');
					jqBaseapp.popup("请选择文件", "2");
				} else {
					$('#warning').foundation('reveal', 'open');
				}
			});
			//确认删除
			$('#yesBtn1').click(function() {
				var $checkImg = $('#uploader').find('.filelist .checked');
				$checkImg.each(function() {
					var $li = $(this).parents('li'),
						fileId = $li.attr("id"),
						type = $li.attr("data-type");
					$('#' + fileId).remove();
					if (type != "1") {
						uploader.removeFile(fileId);
					}

					for (i = 0; i < baseMode.arr_images.length; i++) {
						if (baseMode.arr_images[i].wuFileId == fileId) {
							baseMode.arr_images.splice(i, 1);
						}
					};
				});
				$('#check-num').html("0");
				document.getElementById('checkbox1').checked = false;
				if ($('#uploader').find('.filelist li').length == "0") {
					$('#manageBar').hide();
				}
				jqBaseapp.popup("删除成功", "1");
				$('#warning').foundation('reveal', 'close');
			});
			//完成管理
	    	$('#compBtn').click(function() {
				$('#manageBar').toggle();
				$('#uploader').find('.filelist .success').removeClass("checked").hide();
			});
    	},
    	//时间
    	pubDate: "",
    	pubimgInit: function() {
			var nowdate = new Date();
			$('#postTime').daterangepicker({
				format: 'YYYY-MM-DD HH:mm:ss',
				startDate: nowdate,
				maxDate: '2100-01-10',
				showWeekNumbers: true,
				showDropdowns: true,
				timePicker12Hour: false,
				singleDatePicker: true,
				timePicker: true,
			});
			$('#right-label').daterangepicker({
				format: 'YYYY-MM-DD HH:mm:ss',
				startDate: nowdate,
				maxDate: '2100-01-10',
				showWeekNumbers: true,
				showDropdowns: true,
				timePicker12Hour: false,
				singleDatePicker: true,
				timePicker: true,
			});
			$('#right-label1').daterangepicker({
				format: 'YYYY-MM-DD HH:mm:ss',
				startDate: nowdate,
				maxDate: '2100-01-10',
				showWeekNumbers: true,
				showDropdowns: true,
				timePicker12Hour: false,
				singleDatePicker: true,
				timePicker: true,
			});


		}
    };
    
    var jqBaseapp = {
    	popup: function(popupname, flag) {
			$('.alert-box.warning').show();
			$('.alert-box.warning span').text(popupname);
			$('.alert-box.warning .fa').removeAttr('style');

			if (flag == '1') {
				$('.alert-box.warning .fa').addClass('fa-check');
			} else if (flag == '2') {
				$('.alert-box.warning .fa').addClass('fa-exclamation-circle');
			} else {
				$('.alert-box.warning .fa').hide();
			}

			$('.alert-box.warning').addClass('rj-slide');
			setTimeout(function() {
				$('.alert-box.warning').removeClass('rj-slide');
				$('.alert-box.warning .fa').show().removeClass('fa-check').removeClass('fa-exclamation-circle');
			}, 3000);

		}
    }
    uploaderInit.batchManageBtn();
	/*uploaderInit.pubimgInit();*/
	var baseMode = {
	    s_host: window.Cfg.baseDomains,
		basePath: window.Cfg.basePath,
		arr_images: []
	}
    // 当domReady的时候开始初始化
   	var isEdit = false;
	var authorId = "",
		contentTxt="",
		imgThumArr="",
		sort_image=[],//排序后的照片
		ue,
		oldGroupId="",
		activeId;	
	
	//清空编辑框
	var clearPhotoEditInfo=function() {
			$('#right-label').val("");
			$('#tpmc').val("");
			$('#tpms').val("");
			$('#psdd').val("");
			$('#searchIndex').html('');
		};
	var getArrIndex= function(wuFileId) {
			for (i = 0; i < baseMode.arr_images.length; i++) {
				if (baseMode.arr_images[i].wuFileId == wuFileId) {
					return i;
				}
			}
			return null;
		};
		var sort;
    	sortableInit = function() {
    		var container = document.getElementById("sortable-list");
			var sort = new Sortable(container, {
				group: "name",
				distance:10,
				animation: 150,
				draggable: ".Sortable-item",
				handle: ".imgWrap",
				zIndex:1,
			});
    	}
        var $wrap = $('#uploader'),
			
            // 图片容器
            $queue = $( '<ul id="sortable-list" class="filelist"></ul>' )
                .appendTo( $wrap.find( '.queueList' ) ),

            // 状态栏，包括进度和控制按钮
            $statusBar = $wrap.find( '.statusBar' ),

            // 文件总体选择信息。
            $info = $statusBar.find( '.info' ),

            // 上传按钮
            $upload = $wrap.find( '.uploadBtn' ),

            // 没选择文件之前的内容。
            $placeHolder = $wrap.find( '.placeholder' ),

            $progress = $statusBar.find( '.progress' ).hide(),

            // 添加的文件数量
            fileCount = 0,

            // 添加的文件总大小
            fileSize = 0,

            // 优化retina, 在retina下这个值是2
            ratio = window.devicePixelRatio || 1,

            // 缩略图大小
            thumbnailWidth = 200 * ratio,
            thumbnailHeight = 200 * ratio,

            // 可能有pedding, ready, uploading, confirm, done.
            state = 'pedding',

            // 所有文件的进度信息，key为file id
            percentages = {},
            // 判断浏览器是否支持图片的base64
            isSupportBase64 = ( function() {
                var data = new Image();
                var support = true;
                data.onload = data.onerror = function() {
                    if( this.width != 1 || this.height != 1 ) {
                        support = false;
                    }
                }
                data.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                return support;
            } )(),

            // 检测是否已经安装flash，检测flash的版本
            flashVersion = ( function() {
                var version;

                try {
                    version = navigator.plugins[ 'Shockwave Flash' ];
                    version = version.description;
                } catch ( ex ) {
                    try {
                        version = new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
                                .GetVariable('$version');
                    } catch ( ex2 ) {
                        version = '0.0';
                    }
                }
                version = version.match( /\d+/g );
                return parseFloat( version[ 0 ] + '.' + version[ 1 ], 10 );
            } )(),

            supportTransition = (function(){
                var s = document.createElement('p').style,
                    r = 'transition' in s ||
                            'WebkitTransition' in s ||
                            'MozTransition' in s ||
                            'msTransition' in s ||
                            'OTransition' in s;
                s = null;
                return r;
            })(),

            // WebUploader实例
            uploader;

        if ( !WebUploader.Uploader.support('flash') && WebUploader.browser.ie ) {

            // flash 安装了但是版本过低。
            if (flashVersion) {
                (function(container) {
                    window['expressinstallcallback'] = function( state ) {
                        switch(state) {
                            case 'Download.Cancelled':
                                alert('您取消了更新！')
                                break;

                            case 'Download.Failed':
                                alert('安装失败')
                                break;

                            default:
                                alert('安装已成功，请刷新！');
                                break;
                        }
                        delete window['expressinstallcallback'];
                    };

                    var swf = './flash/expressInstall.swf';
                    // insert flash object
                    var html = '<object type="application/' +
                            'x-shockwave-flash" data="' +  swf + '" ';

                    if (WebUploader.browser.ie) {
                        html += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';
                    }

                    html += 'width="100%" height="100%" style="outline:0">'  +
                        '<param name="movie" value="' + swf + '" />' +
                        '<param name="wmode" value="transparent" />' +
                        '<param name="allowscriptaccess" value="always" />' +
                    '</object>';

                    container.html(html);

                })($wrap);

            // 压根就没有安转。
            } else {
                $wrap.html('<a href="http://www.adobe.com/go/getflashplayer" target="_blank" border="0"><img alt="get flash player" src="http://www.adobe.com/macromedia/style_guide/images/160x41_Get_Flash_Player.jpg" /></a>');
            }

            return;
        } else if (!WebUploader.Uploader.support()) {
            alert( 'Web Uploader 不支持您的浏览器！');
            return;
        }

        // 实例化
        uploader = WebUploader.create({
            pick: {
                id: '#filePicker',
                label: ''
            },
            formData: {
                uid: 123
            },
			auto:true,
            dnd: '#dndArea',
            paste: '#uploader',
            swf:'./flash/Uploader.swf',
            chunked: false,
            chunkSize: 512 * 1024,
            //server:'/upload/fileUpload.sp?act=uploadSave&appId=00000001&caseId=00000019',
//          // runtimeOrder: 'flash',
			server:'./server/fileupload.php',

             accept: {
                 title: 'Images',
                 extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
             },

            // 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
            disableGlobalDnd: true,
            fileNumLimit: 30,
            fileSizeLimit: 200 * 1024 * 1024,    // 200 M
            fileSingleSizeLimit: 50 * 1024 * 1024    // 50 M
        });

        // 拖拽时不接受 js, txt 文件。
        uploader.on( 'dndAccept', function( items ) {
            var denied = false,
                len = items.length,
                i = 0,
                // 修改js类型
                unAllowed = 'text/plain;application/javascript ';

            for ( ; i < len; i++ ) {
                // 如果在列表里面
                if ( ~unAllowed.indexOf( items[ i ].type ) ) {
                    denied = true;
                    break;
                }
            }
			sortableInit();
            return !denied;
        });

        uploader.on('dialogOpen', function() {
            console.log('here');
        });

       uploader.on('filesQueued', function() {
           uploader.sort(function( a, b ) {
               if ( a.name < b.name )
                 return -1;
               if ( a.name > b.name )
                 return 1;
               return 0;
           });
       });

        // 添加“添加文件”的按钮，
        uploader.addButton({
            id: '#filePicker2',
            label: '继续添加'
        });

        uploader.on('ready', function() {
            window.uploader = uploader;
            sortableInit();
            if (imgThumArr != "") {
				$placeHolder.addClass('element-invisible');
				$('#filePicker2').removeClass('element-invisible');
				$queue.show();
				$statusBar.removeClass('element-invisible');
				$statusBar.show();
				var filelength = imgThumArr.length;
				var fileLimitNum = 10 - parseInt(filelength);
				uploader.option("fileNumLimit", fileLimitNum); //限制
				for (var i = 0; i < filelength; i++) {
					imgThumArr[i].wuFileId = 'WU_FILE_' + i + 'E';
					addEditFile(imgThumArr[i], i);
				}

				uploader.addButton({
					id: '#filePicker2',
					label: '继续添加'
				});

				uploader.refresh();
			}
        });
		// 当有文件添加进来时执行，负责view的创建
		function addEditFile(file, i) {
			file.uploadTime = file.uploadTime.length == "10" ? file.uploadTime + " 00:00:00" : file.uploadTime;
			baseMode.arr_images.push(file);

			var fileId = 'WU_FILE_' + i + 'E',
				fileName = file.name; //文件名称

			//data-type为1表示是编辑下的图片，已经上传的
			var $li = $('<li id="' + fileId + '" data-type="1" data-id="' + fileId + '" class="state-complete">' +
				'<div class="covers" title="点击设置封面">封面</div>'+
				'<p class="title">' + fileName + '</p>' +
				'<p class="imgWrap"></p>' +
				'<p class="progress"><span></span></p>' +
				'</li>');
			
			var $btns = $('<div class="file-panel">' +
					'<span class="edit" title="编辑信息">编辑信息</span>' +
					'<span class="rotateRight" title="向右旋转">向右旋转</span>' +
					'<span class="cancel" title="删除">删除</span>'+
					'<span class="fa fa-ellipsis-h" title="更多"></span></div>'
				).appendTo($li),
				$prgress = $li.find('p.progress span'),
				$wrap = $li.find('p.imgWrap'),
				$info = $('<p class="error"></p>'),

				showError = function(code) {
					switch (code) {
						case 'exceed_size':
							text = '文件大小超出';
							break;

						case 'interrupt':
							text = '上传暂停';
							break;

						default:
							text = '上传失败，请重试';
							break;
					}

					$info.text(text).appendTo($li);
				};
			img = $('<img src="' + file.raw + '">');
			$wrap.empty().append(img);
			var isHide = $("#manageBar").is(":hidden"),
				$checkIcon = '<span class="success" style="display:none;"></span>';
			if (!isHide) {
				$checkIcon = '<span class="success"></span>';
			}
			$wrap.append($checkIcon); //添加样式checked为选中状态

			$li.on('mouseenter', function() {
				$btns.stop().animate({
					height: 34
				});
			});

			$li.on('mouseleave', function() {
				$btns.stop().animate({
					height: 0
				});
			});
			
			//图片点击事件
			$imgClick = $li.find('.imgWrap');
			$imgClick.click(function() {
				var $liSuccess = $li.find(".success");
				if ($liSuccess.hasClass('checked')) {
					$liSuccess.removeClass('checked');
				} else {
					$liSuccess.addClass('checked');
				}
				var num = $('#uploader').find(".filelist .success.checked").length;
				if (num == $('#uploader').find(".filelist .success").length) {
					//全选选中
					document.getElementById("checkbox1").checked = true;
				} else {
					document.getElementById("checkbox1").checked = false;
				}
				$('#check-num').html(num);
			});
			$btns.on('click', 'span', function() {

				var index = $(this).index(),
					deg;

				switch (index) {
					case 0:
						$('#edit_imginfo').foundation('reveal', 'open');
						clearPhotoEditInfo(); //清空编辑器数据
						$li = $(this).parents('li');
						var wuFileId = $(this).parents('li').attr("id");
						var num = getArrIndex(wuFileId);
						$('#right-label').val(baseMode.arr_images[num].uploadTime);
						$('#tpmc').val(baseMode.arr_images[num].name);
						$('#tpms').val(baseMode.arr_images[num].description);
						$('#psdd').val(baseMode.arr_images[num].address);
						$('#saveimg').attr("uid", wuFileId).attr("data-num", num);

						//uploader.removeFile(file);
						return;

					case 1:
						file.rotation += 90;
						break;

					case 2:
						//file.rotation -= 90;
						//uploader.removeFile(file);
						var $li = $(this).parents('li');
						var wuFileId = $li.attr("id");
						$li.remove();
						for (i = 0; i < baseMode.arr_images.length; i++) {
							if (baseMode.arr_images[i].wuFileId == wuFileId) {
								baseMode.arr_images.splice(i, 1);
							}
						};
						updateTotalProgress();
						break;
				}

				if (supportTransition) {
					deg = 'rotate(' + file.rotation + 'deg)';
					$wrap.css({
						'-webkit-transform': deg,
						'-mos-transform': deg,
						'-o-transform': deg,
						'transform': deg
					});
				} else {
					$wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');
					// use jquery animate to rotation
					// $({
					//     rotation: rotation
					// }).animate({
					//     rotation: file.rotation
					// }, {
					//     easing: 'linear',
					//     step: function( now ) {
					//         now = now * Math.PI / 180;

					//         var cos = Math.cos( now ),
					//             sin = Math.sin( now );

					//         $wrap.css( 'filter', "progid:DXImageTransform.Microsoft.Matrix(M11=" + cos + ",M12=" + (-sin) + ",M21=" + sin + ",M22=" + cos + ",SizingMethod='auto expand')");
					//     }
					// });
				}


			});

			$li.appendTo($queue);
			
		}
		$(document).on('click','.success',function(){
			if ($(this).hasClass('checked')) {
				$(this).removeClass('checked');
			} else {
				$(this).addClass('checked');
			}
			var num = $('#uploader').find(".filelist .success.checked").length;
			if (num == $('#uploader').find(".filelist .success").length) {
				//全选选中
				document.getElementById("checkbox1").checked = true;
			} else {
				document.getElementById("checkbox1").checked = false;
			}
			$('#check-num').html(num);
		});
        // 当有文件添加进来时执行，负责view的创建
        function addFile( file ) {
            var $li = $( '<li class="Sortable-item" id="' + file.id + '">' +
            		'<div class="covers" title="点击设置封面">封面</div>'+
                    '<p class="title">' + file.name + '</p>' +
                    '<p class="imgWrap"></p>'+
                    '<p class="progress"><span></span></p>' +
                    '</li>' ),
				//$action = $('<div class="action"><a class="margin-r" href="javascript:void(0)">插入大图</a><a href="javascript:void(0)">插入小图</a></div>').appendTo( $li ),
            	$btns = $('<div class="file-panel">' +
                    '<span class="rotateRight" title="向右旋转">向右旋转</span>' +
                    //'<span class="rotateLeft" title="向左旋转">向左旋转</span>' +
                    '<span class="cancel" title="删除">删除</span>'+
					'<div class="moreBtn"><a class="fa fa-ellipsis-h" title="更多"></a>'+
					'<div class="moreSel clearfix"><i class="edit" title="编辑信息"></i>' +
					'<i class="beautify fa fa-magic" title="美化"></i>' +
					'</div></div></div>'
					).appendTo( $li ),
                $prgress = $li.find('p.progress span'),
                $wrap = $li.find( 'p.imgWrap' ),
                $info = $('<p class="error"></p>'),
                showError = function( code ) {
                    switch( code ) {
                        case 'exceed_size':
                            text = '文件大小超出';
                            break;

                        case 'interrupt':
                            text = '上传暂停';
                            break;

                        default:
                            text = '上传失败，请重试';
                            break;
                    }

                    $info.text( text ).appendTo( $li );
                    
                };
			img = $('<img src="' + file.raw + '">');
			$wrap.empty().append(img);
			var isHide = $("#manageBar").is(":hidden"),
			$checkIcon = '<span class="success"></span>';
			
            if ( file.getStatus() === 'invalid' ) {
                showError( file.statusText );
            } else {
                // @todo lazyload
                $wrap.text( '预览中' );
                uploader.makeThumb( file, function( error, src ) {
                    var img;

                    if ( error ) {
                        $wrap.text( '不能预览' );
                        return;
                    }

                    if( isSupportBase64 ) {
                        img = $('<img src="'+src+'">');
                        $wrap.empty().append( img );
                    } else {
                        $.ajax('./server/preview.php', {
                            method: 'POST',
                            data: src,
                            dataType:'json'
                        }).done(function( response ) {
                            if (response.result) {
                                img = $('<img src="'+response.result+'">');
                                $wrap.empty().append( img );
                            } else {
                                $wrap.text("预览出错");
                            }
                        });
                    }
                }, thumbnailWidth, thumbnailHeight );

                percentages[ file.id ] = [ file.size, 0 ];
                file.rotation = 0;
            }

            file.on('statuschange', function( cur, prev ) {
                if ( prev === 'progress' ) {
                    $prgress.hide().width(0);
                } else if ( prev === 'queued' ) {
                   // $li.off( 'mouseenter mouseleave' );
                   // $btns.remove();
                }

                // 成功
                if ( cur === 'error' || cur === 'invalid' ) {
                    console.log( file.statusText );
                    showError( file.statusText );
                    percentages[ file.id ][ 1 ] = 1;
                } else if ( cur === 'interrupt' ) {
                    showError( 'interrupt' );
                } else if ( cur === 'queued' ) {
                    percentages[ file.id ][ 1 ] = 0;
                } else if ( cur === 'progress' ) {
                    $info.remove();
                    $prgress.css('display', 'block'); 
                } else if ( cur === 'complete' ) {
                	var isHide = $("#manageBar").is(":hidden"),
						$checkIcon = '<span class="success"></span>';
					if (!isHide) {
						$checkIcon = '<span class="success" style="display:none;"></span>';
					}
					if($('#manageBar').css('display')=="none"){
						 $li.append( '<span class="success checked" style="display:none"></span>' ); //添加样式checked为选中状态
					}
					else{
						 $li.append( '<span class="success"></span>' ); 
					}
                   
                }

                $li.removeClass( 'state-' + prev ).addClass( 'state-' + cur );
            });

            $li.on( 'mouseenter', function() {
                $btns.stop().animate({height: 34});
            });

            $li.on( 'mouseleave', function() {
                $btns.stop().animate({height: 0});
            });
            //图片点击事件
			$imgClick = $li.find('.imgWrap');
			$imgClick.click(function() {
				var $liSuccess = $li.find(".success");
				if ($liSuccess.hasClass('checked')) {
					$liSuccess.removeClass('checked');
				} else {
					$liSuccess.addClass('checked');
				}
				var num = $('#uploader').find(".filelist .success.checked").length;
				if (num == $('#uploader').find(".filelist .success").length) {
					//全选选中
					document.getElementById("checkbox1").checked = true;
				} else {
					document.getElementById("checkbox1").checked = false;
				}
				$('#check-num').html(num);
			});
			
//			$action.on('click','a',function(){
//				var i = $(this).index();
//				switch(i){
//					case 0:
//						var value = '<img src="http://hdn.xnimg.cn/photos/hdn321/20130612/2235/h_main_NNN4_e80a000007df111a.jpg "/>';
//						UE.getEditor('myEditor').execCommand('insertHtml', value)
//					break;
//					case 1:
//					console.log('2');
//					break;
//
//
//				}
//			});
			
			//编辑功能
            $btns.on( 'click', 'span', function() {
                var index = $(this).index(),
                    deg;

                switch ( index ) {
                    case 0:
                        file.rotation += 90;
                        break;
                        break;

                    case 1:
                    	
                    	var $li = $(this).parents('li');
                    	$li.find('.success').addClass('checked');
                    	var $subli = $li.siblings();
                    	$subli.find('.success').removeClass('checked');
						var wuFileId = $li.attr("id");
						//$('#warning').foundation('reveal','open');
						//$li.remove();
						type = $li.attr("data-type");
						if (type != "1") {
							uploader.removeFile(wuFileId);
						}
						for (i = 0; i < baseMode.arr_images.length; i++) {
							if (baseMode.arr_images[i].wuFileId == wuFileId) {
								baseMode.arr_images.splice(i, 1);
							}
						};
						updateTotalProgress();
                        return;
                        break;
                }

                if ( supportTransition ) {
                    deg = 'rotate(' + file.rotation + 'deg)';
                    $wrap.css({
                        '-webkit-transform': deg,
                        '-mos-transform': deg,
                        '-o-transform': deg,
                        'transform': deg
                    });
                } else {
                    $wrap.css( 'filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ (~~((file.rotation/90)%4 + 4)%4) +')');
                    // use jquery animate to rotation
                    // $({
                    //     rotation: rotation
                    // }).animate({
                    //     rotation: file.rotation
                    // }, {
                    //     easing: 'linear',
                    //     step: function( now ) {
                    //         now = now * Math.PI / 180;

                    //         var cos = Math.cos( now ),
                    //             sin = Math.sin( now );

                    //         $wrap.css( 'filter', "progid:DXImageTransform.Microsoft.Matrix(M11=" + cos + ",M12=" + (-sin) + ",M21=" + sin + ",M22=" + cos + ",SizingMethod='auto expand')");
                    //     }
                    // });
                }


            });
			$btns.on('click','i',function(){
				var index = $(this).index();
				 switch ( index ) {
                    case 0:
                    $('#edit_imginfo').foundation('reveal', 'open');
						clearPhotoEditInfo(); //清空编辑器数据
						$li = $(this).parents('li');
						var wuFileId = $(this).parents('li').attr("id");
						var num = getArrIndex(wuFileId);
						$('#right-label').val(baseMode.arr_images[num].uploadTime);
						$('#tpmc').val(baseMode.arr_images[num].name);
						$('#tpms').val(baseMode.arr_images[num].description);
						$('#psdd').val(baseMode.arr_images[num].address);
						$('#saveimg').attr("uid", wuFileId).attr("data-num", num);
						return;
                    break;
                    case 1:
                     	$li = $(this).parents('li');
						var wuFileId = $(this).parents('li').attr("id");
						var num = getArrIndex(wuFileId);
						$('#xiuxiu').foundation('reveal','open');
						dataImg = baseMode.arr_images[num].raw;
						dataId = wuFileId;
						NUM = num;
                    break;
				 }
			})
            $li.appendTo( $queue );
            
        }
		//负责获取封面的功能
		$(document).on("click",".covers",function(){
			var $covers = $('.covers');
			if($(this).hasClass('active')){
				$(this).removeClass('active');
			}else{
				$covers.removeClass('active');
				$(this).toggleClass('active');
				
			}
		});
        // 负责view的销毁
        function removeFile( file ) {
            var $li = $('#'+file.id);

            delete percentages[ file.id ];
            updateTotalProgress();
            $li.off().find('.file-panel').off().end().remove();
        }

        function updateTotalProgress() {
            var loaded = 0,
                total = 0,
                spans = $progress.children(),
                percent;

            $.each( percentages, function( k, v ) {
                total += v[ 0 ];
                loaded += v[ 0 ] * v[ 1 ];
            } );

            percent = total ? loaded / total : 0;


            spans.eq( 0 ).text( Math.round( percent * 100 ) + '%' );
            spans.eq( 1 ).css( 'width', Math.round( percent * 100 ) + '%' );
            updateStatus();
        }

        function updateStatus() {
            var text = '', stats;

            if ( state === 'ready' ) {
                text = '选中' + fileCount + '张图片，共' +
                        WebUploader.formatSize( fileSize ) + '。';
            } else if ( state === 'confirm' ) {
                stats = uploader.getStats();
                if ( stats.uploadFailNum ) {
                    text = '已成功上传' + stats.successNum+ '张照片至XX相册，'+
                        stats.uploadFailNum + '张照片上传失败，<a class="retry" href="#">重新上传</a>失败图片或<a class="ignore" href="#">忽略</a>'
                }

            } else {
                stats = uploader.getStats();
                text = '共' + fileCount + '张（' +
                        WebUploader.formatSize( fileSize )  +
                        '），已上传' + stats.successNum + '张';

                if ( stats.uploadFailNum ) {
                    text += '，失败' + stats.uploadFailNum + '张';
                }
            }

            $info.html( text );
        }

        function setState( val ) {
            var file, stats;

            if ( val === state ) {
                return;
            }

            $upload.removeClass( 'state-' + state );
            $upload.addClass( 'state-' + val );
            state = val;

            switch ( state ) {
                case 'pedding':
                    $placeHolder.removeClass( 'element-invisible' );
                    $queue.hide();
                    $statusBar.addClass( 'element-invisible' );
                    uploader.refresh();
                    break;

                case 'ready':
                    $placeHolder.addClass( 'element-invisible' );
                    $( '#filePicker2' ).removeClass( 'element-invisible');
                    $queue.show();
                    $statusBar.removeClass('element-invisible');
                    uploader.refresh();
                    break;

                case 'uploading':
                    $( '#filePicker2' ).addClass( 'element-invisible' );
                    $progress.show();
                    $('#uploader').find('.mark').fadeIn(300);
                    $upload.text( '暂停上传' );
                    break;

                case 'paused':
                    $progress.show();
                    $upload.text( '继续上传' );
                    break;

                case 'confirm':
                    $progress.hide();
                    $('#uploader').find('.mark').fadeOut(300);
                    $( '#filePicker2' ).removeClass( 'element-invisible' );
                    $upload.text( '开始上传' );

                    stats = uploader.getStats();
                    if ( stats.successNum && !stats.uploadFailNum ) {
                        setState( 'finish' );
                        return;
                    }
                    break;
                case 'finish':
                    stats = uploader.getStats();
                    if ( stats.successNum ) {
                        //alert( '上传成功' );
                    } else {
                        // 没有成功的图片，重设
                        state = 'done';
                        location.reload();
                        
                    }
                    break;
            }

            updateStatus();
        }

        uploader.onUploadProgress = function( file, percentage ) {
            var $li = $('#'+file.id),
                $percent = $li.find('.progress span');

            $percent.css( 'width', percentage * 100 + '%' );
            percentages[ file.id ][ 1 ] = percentage;
            updateTotalProgress();
        };

        uploader.onFileQueued = function( file ) {
            fileCount++;
            fileSize += file.size;

            if ( fileCount === 1 ) {
                $placeHolder.addClass( 'element-invisible' );
                $statusBar.show();
            }

            addFile( file );
            setState( 'ready' );
            updateTotalProgress();
        };

        uploader.onFileDequeued = function( file ) {
            fileCount--;
            fileSize -= file.size;

            if ( !fileCount ) {
                setState( 'pedding' );
            }

            removeFile( file );
            updateTotalProgress();

        };

        uploader.on( 'all', function( type ) {
            var stats;
			
			var $uploadBg = $('<div class="uploader-bg"><div class="bg-content"><i class="fa fa-fw fa-4x fa-spinner fa-pulse"></i><span>图片上传中...</span></div></div>');
			
            switch( type ) {
                case 'uploadFinished':
				    $wrap.find('.uploader-bg').remove();
                    setState( 'confirm' );
                    break;

                case 'startUpload':
                    setState( 'uploading' );
					$wrap[0].appendChild($uploadBg[0]);
                    break;

                case 'stopUpload':
                    setState( 'paused' );
                    break;

            }
        });
		uploader.on('error', function(reason) {
			switch (reason) {
				case 'Q_TYPE_DENIED':
					jqBaseapp.popup("类型错误", "2");
					break;
				case 'F_DUPLICATE':
					jqBaseapp.popup("你已经选择过该图片了", "2");
					break;
				case 'Q_EXCEED_NUM_LIMIT':
					jqBaseapp.popup("最多上传10张图片", "2");
					break;
			}
		});
        $upload.on('click', function() {
            if ( $(this).hasClass( 'disabled' ) ) {
                return false;
            }

            if ( state === 'ready' ) {
                uploader.upload();
            } else if ( state === 'paused' ) {
                uploader.upload();
            } else if ( state === 'uploading' ) {
                uploader.stop();
            }
        });

        $info.on( 'click', '.retry', function() {
            uploader.retry();
        } );

        $info.on( 'click', '.ignore', function() {
            alert( 'todo' );
        } );

        $upload.addClass( 'state-' + state );
        updateTotalProgress();
        
          //文件存储到数组中@自定义
		uploader.on('uploadSuccess', function(file, response) {

			if (response.ret == "1") {
				jqBaseapp.popup(response.msg, "2");
				$('#'+file.id).remove();
			} else if(typeof(response.ret)=="undefined"){
				jqBaseapp.popup("文件服务出错", "2");
				$('#'+file.id).remove();
			}else {
				var nowDate = new Date().format("yyyy-MM-dd hh:mm:ss"),
					picName = (file.name).replace("." + file.ext, ""),
					wuFileId = file.id, //上传文件的ID标识
					fileUrl = typeof(response.url) == "undefined" ? "" : response.url, //原始文件路径  
					fUrl = typeof(response.fileUrl) == "undefined" ? "" : response.fileUrl, //文件路径   
					fileID = typeof(response.id) == "undefined" ? "" : response.id, //文件服务ID
					fileName = typeof(response.fileName) == "undefined" ? "" : response.fileName,
					     //资源名称 (带后缀)
					//jpgUrl = typeof(response.datas.jpg.url) == "undefined" ? "" : response.datas.jpg.url,
					//资源预览地址，doc的预览地址为swf格式，视频的预览地址就是flv地址，文档的预览地址
					thumb_Url = typeof(response.thumbnailUrl) == "undefined" ? response.url : response.thumbnailUrl,
					//文件后缀
					fileSuffix = typeof(response.fileSuffix) == "undefined" ? "" : response.fileSuffix,
					uploadTime = nowDate,
					address = "",
					lat = "", //纬度
					lng = "", //经度
					make = "", //品牌
					model = "", //器材
					focalLength = "", //焦距
					shutterSpeedValue = "", //快门
					exposureBiasValue = "", //曝光补偿
					isoSpeedRatings = "", //ISO
					apertureValue = "", //光圈
					lensModel = ""; //镜头
				var exifInfo = "";
				if (typeof(response.datas.exifInfo) != "undefined" && typeof(response.datas.exifInfo.content) != "undefined" && response.datas.exifInfo.content.length != "2") {
					var exifInfo = eval("(" + response.datas.exifInfo.content + ")");
					make = typeof(exifInfo.Make) == "undefined" ? "" : exifInfo.Make;
					model = typeof(exifInfo.Model) == "undefined" ? "" : exifInfo.Model;
					exposureBiasValue = typeof(exifInfo.Exposure_Bias_Value) == "undefined" ? "" : exifInfo.Exposure_Bias_Value; //曝光补偿
					isoSpeedRatings = typeof(exifInfo.ISO_Speed_Ratings) == "undefined" ? "" : exifInfo.ISO_Speed_Ratings; //ISO
					focalLength = typeof(exifInfo.Focal_Length) == "undefined" ? "" : exifInfo.Focal_Length;
					shutterSpeedValue = typeof(exifInfo.Exposure_Time) == "undefined" ? "" : exifInfo.Exposure_Time;
					apertureValue = typeof(exifInfo['F-Number']) == "undefined" ? "" : exifInfo['F-Number'];
					lensModel = typeof(exifInfo['Lens_Model']) == "undefined" ? "" : exifInfo['Lens_Model'];
					uploadTime = typeof(exifInfo.Date_Time) == "undefined" ? nowDate : exifInfo.Date_Time.replace(":", "-").replace(":", "-");
					lat = typeof(exifInfo['GPS_Latitude']) == "undefined" ? "" : decodeURI(exifInfo['GPS_Latitude']);
					lng = typeof(exifInfo['GPS_Longitude']) == "undefined" ? "" : decodeURI(exifInfo['GPS_Longitude']);
				}

				//处理缩略图信息
				for (var thumbnailUrl in response.datas) {
					var thumb = response.datas[thumbnailUrl];
					//看是取什么类型的缩略图，这里取140x140
					if (thumb.type == "140x140") {
						thumb_Url = thumb.url;
					}
					// else if (response.fileSuffix != "gif" && thumb.type == "600x600_m") {
					//     fUrl = thumb.url;
					// } 	
					else {
						fUrl = response.fileUrl;
					}
				}

				var  obj_pic =   {
					wuFileId: wuFileId,
					raw: fileUrl,
					fileId: fileID,
					name: fileName,
					thumbnail_url: thumb_Url,
					type: "IMAGE",
					description: "",
					url: fUrl,
					uploadTime: uploadTime,
					address: "",
					tags: "",
					friend: "",
					make: make,
					exposureBiasValue: exposureBiasValue,
					isoSpeedRatings: isoSpeedRatings,
					model: model,
					focalLength: focalLength,
					shutterSpeedValue: shutterSpeedValue,
					apertureValue: apertureValue,
					lensModel: lensModel,
					lat: lat,
					lng: lng
				};                                                   
				baseMode.arr_images.push(obj_pic);  
			}


		});
    
})( jQuery );