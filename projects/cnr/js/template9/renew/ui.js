
$(window).on('scroll',function (){

	// footer top
	var _sc = $(document).scrollTop()

	if(_sc >= 10){
		$('aside.detail-top').fadeIn();
	}else{
		$('aside.detail-top').fadeOut();
	}

})


function headerClick(){
	$('.user-name-btn').removeClass('active');
	$('.user-name .sub-menu').hide();
}

function footerMobileClick(){

	$('.container').removeClass('overlay');
	$('.footer-mobile-menu-box').hide();

}

$(document).on('click','header .mobile-btn',function (){
	if($('header').hasClass('nav-open')){

		$('header').removeClass('nav-open');

	}else{

		$('header').addClass('nav-open');

	}
});

function submenuToggle(){

	$('.user-name-btn').toggleClass('active');
	$('.sub-menu').toggle();
}



// 셀렉트박스 선택
$('.sbox .set').on('click',function (){

	var _sbox = $(this).parent('.sbox');

	if(_sbox.hasClass('on')){
		_sbox.removeClass('on');
	}else{
		$('.sbox').removeClass('on')
		_sbox.addClass('on');
	}


	// 모바일용
	var _mobile = _sbox.data('select');
	$('article.sub-select-menu-mobile[data-select=' + _mobile +']').addClass('on');
});



// 일반 셀렉트박스 항목 선택
$('.sbox ul a').on('click',function (){
	var _sbox = $(this).parents('.sbox');
	_sbox.find('a.set .txt').text($(this).text())
	_sbox.removeClass('on');

	_sbox.find('a.set').removeClass('on');
	$(this).addClass('on');
})


// 모바일용 셀렉트박스 닫기
$('.sub-select-menu-mobile .close-btn').on('click',function (){
	$(this).parents('.sub-select-menu-mobile').removeClass('on');
})

// 모바일용 셀렉트박스 항목 선택
$('.sub-select-menu-mobile ul a').on('click',function (){
	var _mobile = $(this).parents('.sub-select-menu-mobile').data('select');
	var _sbox = $('.sbox[data-select=' + _mobile +']');
	_sbox.find('a.set .txt').text($(this).text())
	$(this).parents('.sub-select-menu-mobile').removeClass('on');

	$('.sub-select-menu-mobile ul a').removeClass('on');
	$(this).addClass('on');
})


$(document).ready(function (){

	$('.search-form input').on('focus',function (){
		$('.search-toggle-menu').show();
	})


	$('body').on('click',function (){
		if($(event.target).parents('.search-form').length){
		}else{
			$('.search-toggle-menu').hide();
		}
	})

})


function popupClose(name){

	$('.container').removeClass('overlay');
	$('article.popup-'+name+'').hide();

}

function popupOpen(name){

	$('.container').addClass('overlay');
	$('article.popup-'+name+'').show();


}


function scrollDisable(){
	$('html, body').addClass('scrollHidden').on('scroll touchmove mousewheel', function(e){
		e.preventDefault();
	});
	$('html').css('overflow', "hidden");

}
function scrollAble(){
	$('html, body').removeClass('scrollHidden');
	$('html').css('overflow', "visible");

}



function menuToggle(){

	$('article.footer-mobile-menu .menu-btn').removeClass('on')


	if($('.footer-mobile-menu-box').is(':visible')){

		$('article.footer-mobile-menu').removeClass('on');
		$('article.footer-mobile-menu .menu-btn.menu').removeClass('on')
		$('.container').removeClass('overlay');
		$('.footer-mobile-menu-box').hide();
		scrollAble();


	}else{
		$('article.footer-mobile-menu').addClass('on');
		$('article.footer-mobile-menu .menu-btn.menu').addClass('on')
		$('.container').addClass('overlay');
		$('.footer-mobile-menu-box').show();
		scrollDisable();

	}
}


function searchToggle(){

	$('.footer-mobile-my-box').hide();

	menuToggleChk();
	$('article.footer-mobile-menu .menu-btn.menu').removeClass('on')
	$('article.footer-mobile-menu .menu-btn.home').removeClass('on')
	$('article.footer-mobile-menu .menu-btn.my').removeClass('on')

	if($('header .search-form').is(':visible')){

		if($('article.footer-mobile-menu .menu-btn.search').hasClass('on')){
			$('article.footer-mobile-menu .menu-btn.search').removeClass('on')
			$('header .search-form').hide();
			scrollAble();
		}else{
			$('article.footer-mobile-menu .menu-btn.search').addClass('on')
			$('header .search-form').show();
			scrollDisable();
		}
	}else{
		$('article.footer-mobile-menu .menu-btn.search').addClass('on')
		$('header .search-form').show();
		scrollDisable();
	}
}




function menuToggleChk(){

	if($('.footer-mobile-menu-box').is(':visible')){
		$('.container').removeClass('overlay');
		$('.footer-mobile-menu-box').hide();
	}
}

function myToggle(){

	$('header .search-form').hide();

	menuToggleChk();
	$('article.footer-mobile-menu .menu-btn.menu').removeClass('on')
	$('article.footer-mobile-menu .menu-btn.home').removeClass('on')
	$('article.footer-mobile-menu .menu-btn.search').removeClass('on')

	if($('.footer-mobile-my-box').is(':visible')){

		if($('article.footer-mobile-menu .menu-btn.my').hasClass('on')){
			$('article.footer-mobile-menu .menu-btn.my').removeClass('on')
			$('.footer-mobile-my-box').hide();
			scrollAble();
		}else{
			$('article.footer-mobile-menu .menu-btn.my').addClass('on')
			$('.footer-mobile-my-box').show();
			scrollDisable();
		}

	}else{

		$('article.footer-mobile-menu .menu-btn.my').addClass('on')
		$('.footer-mobile-my-box').show();
		scrollDisable();
	}
}


var popup;
function termsPop(){
	popup = $.dialog({
		title: false,
		boxMaxWidth :'600px',
		boxWidth : '100%',
		useBootstrap: false,
		content: 'url:popup_terms.html',
		draggable: true,
		closeIcon: true,
		closeIconClass: 'btn-popup-clse'
	});
}

function termsPop2(){
	popup = $.dialog({
		title: false,
		boxMaxWidth :'600px',
		boxWidth : '100%',
		useBootstrap: false,
		content: 'url:popup_terms2.html',
		draggable: true,
		closeIcon: true,
		closeIconClass: 'btn-popup-clse'
	});
}

function termsPop3(){
	popup = $.dialog({
		title: false,
		boxMaxWidth :'600px',
		boxWidth : '100%',
		useBootstrap: false,
		content: 'url:popup_terms3.html',
		draggable: true,
		closeIcon: true,
		closeIconClass: 'btn-popup-clse'
	});
}

function termsPop4(){
	popup = $.dialog({
		title: false,
		boxMaxWidth :'600px',
		boxWidth : '100%',
		useBootstrap: false,
		content: 'url:popup_terms4.html',
		draggable: true,
		closeIcon: true,
		closeIconClass: 'btn-popup-clse'
	});
}


function termsPop5(){
	popup = $.dialog({
		title: false,
		boxMaxWidth :'600px',
		boxWidth : '100%',
		useBootstrap: false,
		content: 'url:popup_terms5.html',
		draggable: true,
		closeIcon: true,
		closeIconClass: 'btn-popup-clse'
	});
}


function pwChangePop(){
	popup = $.dialog({
		title: false,
		boxMaxWidth :'600px',
		boxWidth : '100%',
		useBootstrap: false,
		content: 'url:popup_pw_change.html',
		draggable: true,
		closeIcon: true,
		closeIconClass: 'btn-popup-clse'
	});
}

function replyPop(){
	popup = $.dialog({
		title: false,
		boxMaxWidth :'600px',
		boxWidth : '100%',
		useBootstrap: false,
		content: 'url:popup_reply.html',
		draggable: true,
		closeIcon: true,
		closeIconClass: 'btn-popup-clse'
	});
}



function confirmPop(){
	popup = $.dialog({
		title: false,
		boxMaxWidth :'450px',
		boxWidth : '100%',
		useBootstrap: false,
		content: 'url:popup_confirm.html',
		draggable: true,
		closeIcon: true,
		closeIconClass: 'btn-popup-clse'
	});

}



// 메인 호버 이벤트
$('.video-list .video-box.type-state').on('mouseenter',function (){

	var _process = $(this).find('.state-process');

	if(_process.length){

		var _per = _process.find('input[name=process-per]').val();

		_process.find('.process-circle').remove();
		_process.append('<div class="process-circle"></div>');

		console.log(_per)

		$('.process-circle').circleProgress({
			value: _per,
			size: 70,
			fill: {color: '#F68B1F'}
		}).on('circle-animation-progress', function(event, progress) {
			$(this).find('strong').html(Math.round(100 * progress) + '<i>%</i>');
		});

	}


})


