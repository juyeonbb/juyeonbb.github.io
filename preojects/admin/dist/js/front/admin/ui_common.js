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

$('.popup .popup-content').each(function () {
  if($('.popup .popup-content').children('.popup-footer').length) {
    $(this).addClass('popup-content-dim')
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