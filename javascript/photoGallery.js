
function picSwiper (g,n,t,options) {
/*	this.options = {
		gallery: true,
		comment: true,
		clicklarge: true,
	};*/
	this.loaded(g);
	this.begin(g,n,t);
};

picSwiper.prototype = {
	loaded: function(g){
		/*评论区滚动条*/
		rScroll = new IScroll(g + ' #wrapper', {
			scrollbars: true,
			mouseWheel: true,
			interactiveScrollbars: true,
			shrinkScrollbars: 'scale',
			fadeScrollbars: true
		});
		/*图片简介滚动条*/
		$(g + ' .wrapper-text').each(function(i) {
			textScroll = new IScroll(this, {
				scrollbars: true,
				mouseWheel: true,
				interactiveScrollbars: true,
				shrinkScrollbars: 'scale',
				fadeScrollbars: false
			});
		});
		/*图片简介是否为空*/
		$(g + ' .movie-text').each(function(i){
			var a = $(this).children('h1')[0];
			if($(a).html() === ''){
				$(this).css('background','none');
			}
		});
	},
	begin: function(g,n,t) {
		var top = g + ' .gallery-top';
		var mtext = top + ' .movie-text';
		var galleryTop = new Swiper(top, {
			initialSlide :n-1,
			nextButton: top + ' .swiper-button-next',
			prevButton: top + ' .swiper-button-prev',
			spaceBetween: 10,
			preloadImages: false,
			lazyLoading: true,
			keyboardControl : true,
			//mousewheelControl : true,
			onInit: function(){
				var lazy = top + ' .swiper-slide .swiper-lazy';
				var totalnum = g + ' .total-number';
				var currentnum = g + ' .current-number';
				var i=$(lazy).size();
				$(totalnum).html(i);
				$(currentnum).html(n + "/");
				detectEq();
			},
			onSlideChangeEnd: function(galleryTop){
				changePages();
			},
			onTap: function(galleryTop,event){
				var m = $(mtext);
				var h = $(g + ' .handle-tab-wrap');
				var d = $(g + ' .close');
				var p = $(g + ' .swiper-button-white');
				if(event.target.className.match('swiper-button-white') == null){
					if (document.body.scrollWidth < 640 || document.body.scrollWidth == 640){
						$(h).css('bottom') == '-45px' ? $(h).css('bottom','0px') : $(h).css('bottom','-45px');
						$(m).css('bottom') == '-200px' ? $(m).css('bottom','40px') : $(m).css('bottom','-200px');
					} else {
						$(h).css('top') == '10px' ? $(h).css('top','-100px') : $(h).css('top','10px');
						$(m).css('bottom') == '-200px' ? $(m).css('bottom','0px') : $(m).css('bottom','-200px');
					};
					if(navigator.userAgent.match(/Android/i) || (navigator.userAgent.indexOf('iPhone') != -1) || (navigator.userAgent.indexOf('iPod') != -1) || (navigator.userAgent.indexOf('iPad') != -1)) {
						$(p).css('display','none');
					} else if(document.body.scrollWidth > 768){
						$(p).css('display') == 'block' ? $(p).css('display','none') : $(p).css('display','block');
					};
					$(d).css('display') == 'block' ? $(d).css('display','none') : $(d).css('display','block');
				};
				closeDropdown();
			},
			onSliderMove: function(galleryTop,event){
				var m = $(mtext);
				tapToggle(m)
				closeDropdown();
			},
			onSetTransition: function(galleryTop, transition){
				var m = $(mtext);
				tapToggle(m);
			}
		});

		/*设备检测*/
		function detectEq(){
			var p = $(g + ' .swiper-button-white');
			if(navigator.userAgent.match(/Android/i) || (navigator.userAgent.indexOf('iPhone') != -1) || (navigator.userAgent.indexOf('iPod') != -1) || (navigator.userAgent.indexOf('iPad') != -1)) {
//			if (document.body.scrollWidth < 640 || document.body.scrollWidth == 640){
				$('.wrapper').css({'overflow':'hidden','height':'100%'});
				$('.swiper-container').css({'z-index':'0'})
				$('body').css({'background':'#000'});
				$(p).css('display','none');
			} else {
				$('body').css('overflow','hidden');
			}
		}

		function changePages(){
			var j = $(top + " .swiper-slide-active").index() + 1; 
			$(g + " .current-number").html(j + "/");
		};

		/*左右切换箭头点击事件*/
		$(g + ' .swiper-button-white').bind('click',function(){
			var m = $(mtext);
			tapToggle(m);
		});
		
		/*喜欢-心形效果*/
		$(g + ' .like').click(function(){
			closeDropdown();
			if(this.getAttribute('title') === '喜欢'){
				this.setAttribute('title','取消喜欢');
				this.innerHTML = '<i class="icon-m fa fa-fw fa-heart font-alert no-heart"><span></span><span></span></i>';
			}else{
				this.setAttribute('title','喜欢');
				this.innerHTML = '<i class="icon-m fa fa-fw fa-heart-o red-heart"><span></span><span></span></i>';
			}
		});	
		
		function tapToggle(m){
			var h = $(g + ' .handle-tab-wrap');
			var d = $(g + ' .close');
			var p = $(g + ' .swiper-button-white');
			if (document.body.scrollWidth < 640 || document.body.scrollWidth == 640){
				$(h).css('bottom') == '-45px' ? $(h).css('bottom','-45px') : $(h).css('bottom','0px');
				$(m).css('bottom') == '-200px' ? $(m).css('bottom','-200px') : $(m).css('bottom','40px');
			} else {
				$(h).css('top') == '10px' ? $(h).css('top','10px') : $(h).css('top','-100px');
				$(m).css('bottom') == '-200px' ? $(m).css('bottom','-200px') : $(m).css('bottom','0px');
			};
			if (document.body.scrollWidth > 768){
				$(p).css('display') == 'block' ? $(p).css('display','block') : $(p).css('display','none');
			} else {
				$(p).css('display','none');
			};
			$(d).css('display') == 'block' ? $(d).css('display','block') : $(d).css('display','none');
		};
		
		/*图片信息和分享*/
		$(g + ' .handle-tab-info').bind('click',function(){
			$(g + ' .handle-tab-share').removeClass('show');
			$(this).toggleClass("show");
			var dd = $(this).next('.info-dropdown');
			dd.slideToggle('normal');
			$(g + ' .share-dropdown').hide();
		});
		$(g + ' .handle-tab-share').bind('click',function(){
			$(g + ' .handle-tab-info').removeClass('show');
			$(this).toggleClass("show");
			var dd = $(this).next('.share-dropdown');
			dd.slideToggle('normal');
			$(g + ' .info-dropdown').hide();
		});
		
		if (document.body.scrollWidth < 640 || document.body.scrollWidth == 640){
			$(g + ' .comment_list').bind('click',function(){
				/*小屏下评论列表的显示*/
				deActiveIcon();
				$(g + ' .down').hide();
				$(g + ' .album').css('left','-500px');
				$(g + ' .figure-side').attr('id','out');
				$(g + ' .image-head-back').show();
				$(g + ' .figure-side .figure-side-hd').show();
				$(g + ' .photo_layer').css('top','0px');
			});
		} else {
			$(g + ' .comment_list').bind('click',function(){
				/*大屏下评论右侧弹出*/
				deActiveIcon();
				if($(g + ' .figure-side').attr('id') == 'out'){
					$(this).children().removeClass('show');
					closeComment();
				} else {
					resizeSwiper();
					$(this).children().addClass('show');
					$(g + ' .down').hide();
					$(g + ' .photo_layer').css('top','0');
					$(g + ' .figure-side').attr('id','out');
	/*				$(g + ' .photo_layer').on('click',function(event){
						$(g + ' .photo_layer').removeAttr('style');
						$(g + ' .figure-side').removeAttr('id');
						event.stopPropagation();
					});
	*/
					$(g + ' .figure-side').on('click',function(event){
						event.stopPropagation();
					});
				}
			});
		}
		
		/*小屏下返回观看图片*/
		$(g + ' .image-head-back .back').bind('click',function(){
			if (document.body.scrollWidth < 640 || document.body.scrollWidth == 640){
				$(g + ' .image-head-back').hide();
				$(g + ' .album').removeAttr('style');
				$(g + ' .figure-side .figure-side-hd').hide();
				$(g + ' .photo_layer').attr('style','');
				$(g + ' .figure-side').removeAttr('id');
			} else {
				closeComment();
			}
		});
		
		/*上拉菜单收起*/
		function closeDropdown(){
			$(g + ' .down').hide();
			deActiveIcon();
		};
		
		function deActiveIcon(){
			$(g + ' .handle-tab-share').removeClass('show');
			$(g + ' .handle-tab-info').removeClass('show');
		}
		
		/*右侧评论弹出，图片swiper宽度重置*/
		function resizeSwiper(){
			var width = parseInt($(document.body).outerWidth(true)) - 400 + 'px';
			$(g + ' .handle-tab-wrap').css('right','400px');
			$(g + ' .image-head').css('width',width);
			$(top).css({'width':width,'margin-left':'0'});
			galleryTop.onResize();
		}
		
		function closeComment(){
			$(g + ' .down').hide();
			$(g + ' .handle-item').removeClass('show');
			$(g + ' .photo_layer').removeAttr('style');
			$(g + ' .figure-side').removeAttr('id');
			$(g + ' .image-head').removeAttr('style');
			$(g + ' .handle-tab-wrap').removeAttr('style');
			$(top).removeAttr('style');
			galleryTop.onResize();
			event.stopPropagation();
		}

		/*关闭*/
		/*ESC关闭*/
		$(document).keyup(function(event){
			switch(event.keyCode) {
				case 27:
				$(g + ' .close').click();
			}
		});  
		/*图片按钮关闭*/
		$(g + ' .close').bind('click',function(e){
			closeDropdown();
			$(g).hide();
			$(g + ' .handle-tab li').unbind('click');
			$(g + ' .icon-comment-m').parent().parent().unbind('click');
			$(g + ' .drop').unbind('click');
			$(g + ' .handle-tab-info').unbind('click');
			$(g + ' .handle-tab-share').unbind('click');
			$(g + ' .gallery-top').unbind('onTap').removeAttr('style');
			$(g + ' .image-head').removeAttr('style');
			$(g + ' .swiper-wrapper').removeAttr('style');
			$(g + ' .dropdown').hide();
			$(g + ' .close').removeAttr('style');
			$(g + ' .handle-tab-wrap').removeAttr('style');
			$(g + ' .swiper-button-white').removeAttr('style');
			$(g + ' .movie-text').removeAttr('style');
			$(g + ' .photo_layer').removeAttr('style');
			$(g + ' .figure-side').removeAttr('id');
			$(g + ' .like').unbind('click');
			$(g + ' .like').html('<i class="icon-m fa fa-fw fa-heart-o"></i>');
			galleryTop.onResize();
			galleryTop.destroy(false);
			$('body').removeAttr('style');
			$('.wrapper').removeAttr('style');
			if(rScroll){ rScroll.destroy();};
			if(textScroll){ textScroll.destroy();};
			document.body.removeEventListener('touchmove', preventDefault ,false);		
			$(document).scrollTop(t);
		});
		
		function preventDefault(e) { e.preventDefault(); };  
		document.body.addEventListener('touchmove', preventDefault ,false);	
	
	}
};
