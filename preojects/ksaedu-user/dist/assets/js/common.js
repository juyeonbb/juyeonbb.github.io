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
  let $tabs = $(this).find('._tab .item');
  let $tabPanels = $(this).find('.tab-content .tab-panel');

  $tabs.on('click',function() {
    // 현재 선택된 탭 표시
    $tabs.removeClass('on');
    $(this).addClass('on');

    // 해당 탭 패널 표시
    $tabPanels.hide();
    let index = $(this).index();
    $tabPanels.eq(index).show();
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
    thisPopup.fadeIn(200);
    $('body').addClass('scrOff');
  });
}

function closePopup() {
  const visiblePopup = $('._popup:visible');
  visiblePopup.fadeOut(200, function () {
    dim.fadeOut(200);
    $('body').removeClass('scrOff');
  });
}
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
