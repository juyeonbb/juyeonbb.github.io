/**
 * block event
 * */
$('a[href="#"]').on('click', function (event) {
    event.preventDefault();
});

/**
 * ******************************************************************
 * */

/**
 * scroll Top
 * */
function scrollGoTop() {
    $('html, body').animate({scrollTop: '0'}, 600);
}

/**
 * ******************************************************************
 * */

/**
 * Tab
 * */
$('._tabContainer').each(function () {
    let $tabs = $(this).find('._tab > .item:not(.disabled)');
    let $tabPanels = $(this).find('._tabContent > .tab-panel');

    $tabs.on('click', function () {
        if (!$(this).hasClass('on')) {
            $tabs.removeClass('on');
            $(this).addClass('on');

            $tabPanels.hide();
            let index = $(this).index();
            $tabPanels.eq(index).show();
        }
    });
});

$('._tabContainerInner').each(function () {
    let $tabs = $(this).find('._tabInner > .item:not(.disabled)');
    let $tabPanels = $(this).find('._tabContentInner > .tab-panel');

    $tabs.on('click', function () {
        if (!$(this).hasClass('on')) {
            $tabs.removeClass('on');
            $(this).addClass('on');

            $tabPanels.hide();
            let index = $(this).index();
            $tabPanels.eq(index).show();
        }
    });
});

$('._tabs a').on('click', function () {
    $(this).parent().addClass('on').siblings().removeClass('on');
})
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
    if ($('.popup .popup-content').children('.popup-footer').length) {
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
 * header UI
 * */
$('._btnMenu').each(function () {
    $(this).on('click', function () {
        if (!$(this).hasClass('on')) {
            $(this).addClass('on')
            $('._gnb').addClass('show')
        } else {
            $(this).removeClass('on')
            $('._gnb').removeClass('show')
        }
    })
})

$('._menu .item a').mouseenter(function () {
    $('._gnb').addClass('show')
})

$('.header').mouseleave(function () {
    if($('._gnb').hasClass('show')) {
        $('._gnb').removeClass('show');
        $('._btnMenu').removeClass('on');
    }
})
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
function countChar(val, target) {
    let len = val.value.length;
    let targetItem = $(`.${target}`);

    targetItem.text(len);
}

/**
 * ******************************************************************
 * */

/**
 * Dropdown
 * */
$('._dropdown .caption').on('click', function (e) {
    const $dropdown = $(this).parent();
    if ($dropdown.hasClass('open')) {
        $dropdown.removeClass('open');
    } else {
        $('._dropdown').removeClass('open');
        $dropdown.addClass('open');
    }
    e.stopPropagation();
});

$(document).on('click', function () {
    $('._dropdown').removeClass('open');
});
/**
 * ******************************************************************
 * */

/**
 * Accordion
 * */
$('._accordion .item-head').on('click', function() {
    let $currentItem = $(this).parent('.item');
    let $currentBody = $currentItem.find('.item-body');

    $currentBody.slideToggle();
    $currentItem.toggleClass('show');

    $('._accordion .item').not($currentItem).removeClass('show').find('.item-body').slideUp();
});
/**
 * ******************************************************************
 * */

/**
 * LNB
 * */
$('._lnb').each(function () {
    const $lnb = $(this)

    $lnb.find('._menuToggle').on('click', function () {
        let $parentMenu = $(this).closest('.menu', $lnb);

        if ($parentMenu.hasClass('show')) {
            $parentMenu.find('.sub-menu-list').slideUp(function () {
                $parentMenu.removeClass('show');
            });
        } else {
            $parentMenu.find('.sub-menu-list').slideDown(function () {
                $parentMenu.addClass('show');
            });
        }
    });
});
/**
 * ******************************************************************
 * */

/**
 * AOS
 * */
AOS.init();
/**
 * ******************************************************************
 * */