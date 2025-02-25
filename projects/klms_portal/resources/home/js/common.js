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
 * PC header UI
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

function handleScroll() {
    if ($(window).scrollTop() > 0) {
        $('.header-wrap').addClass('scrolling');
    } else {
        $('.header-wrap').removeClass('scrolling');
    }
}

$(window).on('scroll', handleScroll);

$(document).ready(handleScroll);
/**
 * ******************************************************************
 * */

/**
 * Mobile header UI
 * */
let btnMoMenu = $('._btnMoMenu');
let moGnb = $('._moGnb');

$(window).on('resize', debounce(closeMobileGNB, 200));

btnMoMenu.on('click', function () {
    let isActive = $(this).hasClass('on');
    $(this).toggleClass('on', !isActive);
    moGnb.toggleClass('show', !isActive);
    body.toggleClass('scrOff', !isActive);
});

function closeMobileGNB() {
    btnMoMenu.removeClass('on');
    moGnb.removeClass('show');
    body.removeClass('scrOff');
}

$('._moMenu .nav-item .btn-menu-toggle').on('click', function () {
    let $parentMenu = $(this).closest('.item');

    if ($parentMenu.hasClass('show')) {
        $parentMenu.find('.sub-list').slideUp(function () {
            $parentMenu.removeClass('show');
        });
    } else {
        $parentMenu.find('.sub-list').slideDown(function () {
            $parentMenu.addClass('show');
        });
    }
})

$('._moMenu .nav-item .btn-lg-menu-toggle').on('click', function () {
    let $parentMenu = $(this).closest('.nav-item');

    if ($parentMenu.hasClass('show')) {
        $parentMenu.find('.list').slideUp(function () {
            $parentMenu.removeClass('show');
        });
    } else {
        $parentMenu.find('.list').slideDown(function () {
            $parentMenu.addClass('show');
        });
    }
})
/**
 * ******************************************************************
 * */

/**
 * Mobile Search UI
 * */
let body = $('body');
let btnSearch = $('._btnMoSearch');
let searchDim = $('._searchDim');
let searchBox = $('._searchBox');

$('._btnMoSearch').on('click', function () {
    if (!$(this).hasClass('on')) {
        openSearch()
    } else {
        closeSearch()
    }
})

searchDim.on('click', closeSearch)

$(window).on('resize', debounce(closeSearch, 200));

function openSearch() {
    btnSearch.addClass('on');

    searchDim.fadeIn(200, function () {
        searchBox.slideDown(200, function () {
            searchBox.find('input').focus();
            body.addClass('scrOff');
        });
    });
}

function closeSearch() {
    btnSearch.removeClass('on');

    searchBox.slideUp(200, function () {
        searchDim.fadeOut(200);
        body.removeClass('scrOff');
    });
}

function debounce(func, wait) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(func, wait);
    };
}
/**
 * ******************************************************************
 * */

/**
 * 강의실 모바일 메뉴
 * */
$('._classMoMenu').on('click', function () {
    if(!$(this).hasClass('on')) {
        $(this).addClass('on');
        $('._classroomGNB').addClass('show');
    } else {
        closeClassroomGNB()
    }
})

$('.classroom-menu-list .item a').on('click', function () {
    $(this).parent().addClass('on').siblings().removeClass('on')
})

$(window).on('resize', debounce(closeClassroomGNB, 200));

function closeClassroomGNB() {
    $('._classMoMenu').removeClass('on');
    $('._classroomGNB').removeClass('show');
}

/**
 * ******************************************************************
 * */

/**
 * LNB
 * */
$('._lnb ._menuToggle').on('click', function () {
    let $parentMenu = $(this).closest('.menu');
    let $toggleText = $(this).find('.sr-only');

    if ($parentMenu.hasClass('show')) {
        $parentMenu.find('.sub-menu-list').slideUp(function () {
            $parentMenu.removeClass('show');
            $toggleText.text('닫힘');
        });
    } else {
        $parentMenu.find('.sub-menu-list').slideDown(function () {
            $parentMenu.addClass('show');
            $toggleText.text('열림');
        });
    }
});

$('._lnb .menu ._menuToggle:only-child').on('click', function () {
    $('._menuToggle').removeClass('on');
    $(this).addClass('on');
})

/**
 * ******************************************************************
 * */

/**
 * Classroom LNB
 * */
$('._clnb .classroom-menu-list a').on('click', function () {
    $(this).parent().addClass('on').siblings().removeClass('on')
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