/**
 * block event
 * */
$('a[href="#"]').on( 'click', function( event ) {
  event.preventDefault();
});
/**
 * ******************************************************************
 * */

/**
 * scroll Top
 * */
function scrollGoTop() {
  $('html, body').animate( { scrollTop: '0' }, 600);
}
/**
 * ******************************************************************
 * */

/**
 * Tab
 * */
$('._tabContainer').each(function() {
  let $tabs = $(this).find('._tab > .item:not(.disabled)');
  let $tabPanels = $(this).find('._tabContent > .tab-panel');

  $tabs.on('click', function() {
    if (!$(this).hasClass('on')) {
      $tabs.removeClass('on');
      $(this).addClass('on');

      $tabPanels.hide();
      let index = $(this).index();
      $tabPanels.eq(index).show();
    }
  });
});

$('._tabContainerInner').each(function() {
  let $tabs = $(this).find('._tabInner > .item:not(.disabled)');
  let $tabPanels = $(this).find('._tabContentInner > .tab-panel');

  $tabs.on('click', function() {
    if (!$(this).hasClass('on')) {
      $tabs.removeClass('on');
      $(this).addClass('on');

      $tabPanels.hide();
      let index = $(this).index();
      $tabPanels.eq(index).show();
    }
  });
});
/**
 * ******************************************************************
 * */

/**
 * Popup
 * */
const dim = $('._dim');
const popupTrigger = $('._popupTrigger');
const popupClose = $('._popupClose');

popupTrigger.on('click', function () {
  const target = $(this).data('trigger');
  openPopup(target);
});

popupClose.on('click', function () {
  closePopup();
});

function openPopup(target) {
  const thisPopup = $(`._popup[data-popup=${target}]`);
  dim.fadeIn(200, function () {
    thisPopup.fadeIn(200, function () {
      thisPopup.find('.btn-popup-close').focus();
      $('body').addClass('scrOff');
    });
  });
}

function closePopup() {
  const visiblePopup = $('._popup:visible');
  visiblePopup.fadeOut(200, function () {
    dim.fadeOut(200);
    $('body').removeClass('scrOff');
  });
}

$('.popup .popup-content').each(function () {
  if($('.popup .popup-content').children('.popup-footer').length) {
    $(this).addClass('popup-content-dim')
  }
})
/**
 * ******************************************************************
 * */

/**
 * 좋아요 버튼
 * */
$('.btn-heart').each(function () {
  $(this).on('click', function () {
    if (!$(this).hasClass('on')) {
      $(this).addClass('on')
    } else {
      $(this).removeClass('on')
    }
  })
})
/**
 * ******************************************************************
 * */

/**
 * Check Device
 * */
const viewPC = window.matchMedia('(min-width: 1301px)')
isPC(viewPC)
viewPC.addListener(isPC)

const viewTablet = window.matchMedia('(min-width: 940px) and (max-width: 1300px)')
isTablet(viewTablet)
viewTablet.addListener(isTablet)

const viewMobile = window.matchMedia('(max-width: 939px)')
isMobile(viewMobile)
viewMobile.addListener(isMobile)

function isPC (e) {
  if (e.matches) {
    $('body').removeClass('view-mobile').removeClass('view-tablet').addClass('view-pc');
  }
}

function isTablet (e) {
  if (e.matches) {
    $('body').removeClass('view-mobile').removeClass('view-pc').addClass('view-tablet');
  }
}

function isMobile (e) {
  if (e.matches) {
    $('body').removeClass('view-tablet').removeClass('view-pc').addClass('view-mobile');
  }
}
/**
 * ******************************************************************
 * */

/**
 * LNB
 * */
$('._lnb .has-depth ._menuToggle').on('click', function () {
  let $parentMenu = $(this).closest('.menu');

  if ($parentMenu.hasClass('show')) {
    $parentMenu.find('.sub-menu-list').slideUp(function () {
      $parentMenu.removeClass('show');
    });
  } else {
    $parentMenu.find('.sub-menu-list').slideDown(function () {
      $parentMenu.addClass('show');
    });
  }
})
/**
 * ******************************************************************
 * */

/**
 * Count txt
 * */
function countChar(val,target) {
  let len =val.value.length;
  let targetItem = $(`.${target}`);

  targetItem.text(len);
}
/**
 * ******************************************************************
 * */

/**
 * Header UI
 * */

// header scroll event
function handleHeaderBehavior() {
  let header = $('._header');
  let body = $('body');
  let headerTopHeight = header.height();
  let isFixed = localStorage.getItem('isHeaderFixed') === 'true';

  function fixHeader() {
    // console.log('PC fixed')
    body.removeClass('unfixed').addClass('fixed');
    isFixed = true;
    localStorage.setItem('isHeaderFixed', 'true');
  }

  function unfixHeader() {
    // console.log('PC unfixed')
    isFixed = false;
    body.removeClass('fixed').addClass('unfixed');
    localStorage.setItem('isHeaderFixed', 'false');
  }

  function checkHeaderPosition() {
    if ($(window).scrollTop() > headerTopHeight) {
      fixHeader();
    } else {
      if (isFixed) {
        unfixHeader();
      }
    }
  }

  checkHeaderPosition();

  $(window).scroll(function() {
    checkHeaderPosition();
  });
}

handleHeaderBehavior();

$(window).resize(function() {
  handleHeaderBehavior();
});

// search button event
$('._btnTopSearch').on('click', function(e) {
  e.stopPropagation();
  $(this).addClass('show');
});

$('._closeThisBox').on('click', function(e) {
  e.stopPropagation();
  $('._btnTopSearch').removeClass('show');
});

// gnb event
$('._btnGnbMenu').on('click', function () {
  if($(this).hasClass('on')) {
    $(this).removeClass('on');
    $('._gnb').removeClass('show');

    if(!$('body').hasClass('view-pc')) {
      $('body').removeClass('scrOff');
    }
  } else {
    $(this).addClass('on');
    $('._gnb').addClass('show');
    if(!$('body').hasClass('view-pc')) {
      $('body').addClass('scrOff');
    }
  }
})
/**
 * ******************************************************************
 * */
/**
 * Main Tooltip UI
 * */
$('._help').on('click', function () {
  $('body').addClass('dimmed')
  $('.info-dim').addClass('open')

  let quickMenuHeight = $('.quick-menu .menu').outerHeight(true) + 10
  $('.quick-tooltip-info').css('height',`${quickMenuHeight}px`);
})

$('._helpClose').on('click', function () {
  $('body').removeClass('dimmed')
  $('.info-dim').removeClass('open')
})
/**
 * ******************************************************************
 * */
/**
 * Skip Navigation UI
 * */
let $header = $('._header');
let $skipLink = $('#skip a');
let $headerHeight = $header.outerHeight();

$skipLink.on('click', function () {
  if($('.main-contents').length) {
    let linkHash = this.hash;
    let dummyHeight = '';
    dummyHeight = $('#content').offset().top - $headerHeight;
    $('html, body').animate({scrollTop: dummyHeight}, 300);
    setTimeout( function(){ $('._boxSearch .form-search').focus();}, 50 );
  } else {
    setTimeout( function(){ $('.breadcrumb .item:first-child a').focus();}, 50 );
  }
})
/**
 * ******************************************************************
 * */
/**
 * form check, form radio
 * */
$('.form-check, .form-radio').on('keydown', function(event) {
  if (event.key === 'Enter') {
    const input = $(this).find('input');
    input.prop('checked', !input.prop('checked'));
  }
});
/**
 * ******************************************************************
 * */