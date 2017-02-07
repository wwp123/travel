$(function(){
	$('.photoGallery').each(function(){
		var _this = $(this);
		var _next = $(this).find('.swiper-button-next');
		var _prev = $(this).find('.swiper-button-prev');
		var _postitem = $(this).parents('.postitem');
		_this.find('.entrance').click(function(){
			_this.find('.gallery').css('display','block');
			$('body').css('overflow','hidden');
			var t = $(document).scrollTop();
	        _this.find('.gallery .close').unbind('click');
			new picSwiper('#'+_this.find('.gallery')[0].id,$(this).parent().parent().index()+1,t,{});
		});
		_next.on('click',function(){
			var t = $(document).scrollTop();
			if(_next.hasClass('swiper-button-disabled') && _postitem.next().length){
				//_next.removeClass('swiper-button-disabled').attr('title','点击进入下一篇');
				$('.gallery').css('display','none');
				_postitem.next().find('.info-box-all').show().find('.info-box-part').hide();
				_postitem.next().find('.gallery').css('display','block');
				new picSwiper('#'+_postitem.next().find('.gallery')[0].id,_postitem.next().find('.entrance').parent().parent().index()+1,t,{});
			}
			if(_postitem.next().length <= 0){
				_next.unbind('click');
			}
		});
		_prev.on('click',function(){
			var t = $(document).scrollTop();
			if(_prev.hasClass('swiper-button-disabled') && _postitem.prev().length){
				$('.gallery').css('display','none');
				_postitem.prev().find('.info-box-all').show().find('.info-box-part').hide();
				_postitem.prev().find('.gallery').css('display','block');
				new picSwiper('#'+_postitem.prev().find('.gallery')[0].id,_postitem.prev().find('.entrance').parent().parent().length,t,{});
			}
			if(_postitem.prev().length <= 0){
				_prev.unbind('click');
			}
		});
	});
})
