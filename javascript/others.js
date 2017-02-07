$(function () {
	//搜索
	var searchA = $('.search-a');
	var search = searchA.siblings('.search');
	searchA.on('click',function(){
		$(this).css('display','none');
		search.css('display','inline-block');
		return false;
	});
	search.on('click',function(){
		return false;
	});
	$(document).on('click',function(){
		searchA.css('display','inline-block');
		search.css('display','none');
	});
	
	$(document).ready(function(){
		$(".portrait a img").addClass("fadeInDown animated");
	});
});