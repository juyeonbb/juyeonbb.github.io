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

/**
 * GNB
 * */
let $gnb = {
  click : function (target, speed) {
    let _self = this,
        $target = $(target);
        _self.speed = speed || 300;

    $target.each(function(){
      if(findChildren($(this))) {
        return;
      }
      $(this).addClass('no-depth');
    });

    function findChildren(obj) {
      return obj.find('> ul').length > 0;
    }

    $target.on('click','a', function(e){
      e.stopPropagation();
      let $this = $(this),
          $depthTarget = $this.next(),
          $siblings = $this.parent().siblings();

      $this.parent('li').find('ul li').removeClass('on');
      $siblings.removeClass('on');
      $siblings.find('ul').slideUp(250);

      if($depthTarget.css('display') == 'none') {
        _self.activeOn($this);
        $depthTarget.slideDown(_self.speed);
      } else {
        $depthTarget.slideUp(_self.speed);
        _self.activeOff($this);
      }

    })

  },
  activeOff : function($target) {
    $target.parent().removeClass('on');
  },
  activeOn : function($target) {
    $target.parent().addClass('on');
  }
};

$(function(){
  $gnb.click('._mainMenu', 300)
});
/**
 * ******************************************************************
 * */

/**
 * select2
 * */
$('._select2').each(function () {
  $(this).select2();
})
/**
 * ******************************************************************
 * */