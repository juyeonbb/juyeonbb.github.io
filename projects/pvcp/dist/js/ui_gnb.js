(function ($) {
    'use strict';

    var DESKTOP_WIDTH = 1280;
    var MENU_CLOSE_DELAY = 1500;
    var closeTimer = null;

    function isDesktop() {
        return window.innerWidth >= DESKTOP_WIDTH;
    }

    function getPinnedItem() {
        return $('.main-menu .gnb-menu > .menu-item.is-pinned').first();
    }

    function openSubMenu($item) {
        if (!$item || !$item.length) return;

        $item.find('> .menu-link').attr('aria-expanded', 'true');
        $item.find('> .sub-menu').prop('hidden', false);

        $item.find('.depth2-item').each(function () {
            var $li = $(this);
            var $depth3 = $li.find('> .depth3-menu');
            var hasDepth3 = $depth3.length > 0;

            $li.find('> .depth2-link').attr('aria-expanded', (hasDepth3 && $li.hasClass('is-active')) ? 'true' : 'false');
            if (hasDepth3) $depth3.prop('hidden', !$li.hasClass('is-active'));
        });
    }


    function closeSubMenu($item) {
        if (!$item || !$item.length) return;
        if ($item.hasClass('is-pinned')) return;

        $item.find('> .menu-link').attr('aria-expanded', 'false');
        $item.find('> .sub-menu').prop('hidden', true);

        $item.find('.depth2-item').each(function () {
            var $li = $(this);
            var $depth3 = $li.find('> .depth3-menu');
            var hasDepth3 = $depth3.length > 0;

            $li.find('> .depth2-link').attr('aria-expanded', (hasDepth3 && $li.hasClass('is-active')) ? 'true' : 'false');
            if (hasDepth3) $depth3.prop('hidden', !$li.hasClass('is-active'));
        });
    }


    function closeAllExcept($keepItem) {
        $('.main-menu .gnb-menu > .menu-item').each(function () {
            var $it = $(this);
            if ($keepItem && $keepItem.length && $it[0] === $keepItem[0]) return;
            closeSubMenu($it);
        });
    }

    // function setActiveDepth2($clickedLink) {
    //     var $sub = $clickedLink.closest('.sub-menu');
    //     var $li = $clickedLink.closest('.depth2-item');
    //     var $depth3 = $li.find('> .depth3-menu');
    //     var hasDepth3 = $depth3.length > 0;
    //
    //     $sub.find('.depth2-item').not($li)
    //         .removeClass('is-active')
    //         .find('> .depth3-menu').prop('hidden', true);
    //
    //     $sub.find('.depth2-link').not($clickedLink)
    //         .attr('aria-expanded', 'false');
    //
    //     if (!hasDepth3) return;
    //
    //     var willOpen = $depth3.prop('hidden') === true;
    //
    //     $li.toggleClass('is-active', willOpen);
    //     $clickedLink.attr('aria-expanded', String(willOpen));
    //     $depth3.prop('hidden', !willOpen);
    // }

    function initPinnedState() {
        if (!isDesktop()) return;

        var $pinned = getPinnedItem();
        if ($pinned.length) {
            closeAllExcept($pinned);
            openSubMenu($pinned);
        }
    }

    // -------------------------------------------------
    // Events
    // -------------------------------------------------

    // 1depth: Desktop hover/focus 시 열기
    $(document).on('mouseenter focusin', '.main-menu .gnb-menu > .menu-item > .menu-link', function () {
        if (!isDesktop()) return;

        clearTimeout(closeTimer);

        var $item = $(this).closest('.menu-item');
        closeAllExcept($item);
        openSubMenu($item);
    });

    // sub-menu 영역에 마우스 들어오면 닫힘 타이머 취소
    $(document).on('mouseenter', '.main-menu .sub-menu', function () {
        if (!isDesktop()) return;
        clearTimeout(closeTimer);
    });

    // 1depth: Desktop에서 마우스가 메뉴 아이템에서 빠지면 delay 후 닫고, pinned가 있으면 복귀
    $(document).on('mouseleave', '.main-menu .gnb-menu > .menu-item', function () {
        if (!isDesktop()) return;

        var $item = $(this);

        clearTimeout(closeTimer);
        closeTimer = setTimeout(function () {
            closeSubMenu($item);

            var $pinned = getPinnedItem();
            if ($pinned.length) {
                closeAllExcept($pinned);
                openSubMenu($pinned);
            }
        }, MENU_CLOSE_DELAY);
    });

    // depth2: depth3가 있는 경우에만 토글
    // $(document).on('click', '.main-menu .depth2-link', function (e) {
    //     var $link = $(this);
    //     var $li = $link.closest('.depth2-item');
    //     var hasDepth3 = $li.find('> .depth3-menu').length > 0;
    //
    //     if (hasDepth3) {
    //         e.preventDefault();
    //         setActiveDepth2($link);
    //     }
    // });

    // Mobile: 1depth 클릭으로 sub-menu 토글
    $(document).on('click', '.main-menu .gnb-menu > .menu-item > .menu-link', function (e) {
        if (isDesktop()) return;

        var $item = $(this).closest('.menu-item');
        var $sub = $item.find('> .sub-menu');
        if (!$sub.length) return;

        e.preventDefault();

        var isOpen = $sub.prop('hidden') === false;

        $item.siblings('.menu-item').each(function () {
            $(this).find('> .menu-link').attr('aria-expanded', 'false');
            $(this).find('> .sub-menu').prop('hidden', true);
        });

        if (isOpen) {
            $item.find('> .menu-link').attr('aria-expanded', 'false');
            $sub.prop('hidden', true);
        } else {
            $item.find('> .menu-link').attr('aria-expanded', 'true');
            $sub.prop('hidden', false);
        }
    });

    // main-menu 바깥으로 포커스가 이동하면 닫음
    $(document).on('focusin', function (e) {
        if (!isDesktop()) return;

        var $t = $(e.target);

        if (!$t.closest('.main-menu').length) {
            clearTimeout(closeTimer);

            var $pinned = getPinnedItem();
            if ($pinned.length) {
                closeAllExcept($pinned);
                openSubMenu($pinned);
            } else {
                closeAllExcept(null);
            }
        }
    });

    // 초기 진입 시 pinned 메뉴 열기
    $(function () {
        initPinnedState();
    });

    // 리사이즈로 desktop/mobile 전환 시 상태 재정렬
    $(window).on('resize', function () {
        clearTimeout(closeTimer);
        initPinnedState();
    });

})(jQuery);