(function ($) {
    'use strict';

    var DESKTOP_WIDTH = 1280;
    var MENU_CLOSE_DELAY = 1500;
    var closeTimer = null;
    var wasDesktop = isDesktop();

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

    function bindHorizontalWheel() {
        var $el = $('.main-menu .gnb-menu .menu-item.is-pinned .sub-menu');
        if (!$el.length) return;

        $el.off('wheel.horizontal').on('wheel.horizontal', function (e) {
            if (window.innerWidth >= DESKTOP_WIDTH) return;
            if (this.scrollWidth <= this.clientWidth) return;

            e.preventDefault();
            this.scrollLeft += e.originalEvent.deltaY;
        });
    }

    function resetMenuStateForMobile() {
        $('.main-menu .gnb-menu > .menu-item > .menu-link')
            .attr('aria-expanded', 'false');

        $('.main-menu .gnb-menu > .menu-item > .sub-menu')
            .prop('hidden', true);

        $('.main-menu .depth2-item').each(function () {
            var $li = $(this);
            var $depth3 = $li.find('> .depth3-menu');
            if ($depth3.length) $depth3.prop('hidden', true);

            $li.find('> .depth2-link').attr('aria-expanded', 'false');
        });
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
        bindHorizontalWheel();
        initPinnedState();
    });

    // 리사이즈로 desktop/mobile 전환 시 상태 재정렬
    $(window).on('resize', function () {
        clearTimeout(closeTimer);

        var nowDesktop = isDesktop();

        if (wasDesktop && !nowDesktop) {
            resetMenuStateForMobile();
        }

        if (!wasDesktop && nowDesktop) {
            initPinnedState();
        } else {
            initPinnedState();
        }

        bindHorizontalWheel();
        wasDesktop = nowDesktop;
    });

})(jQuery);

// 전체 메뉴
(function ($) {
    $(function () {
        var $body = $('body');
        var $layer = $('._allmenuLayer');
        var $dialog = $('._allmenu');
        var $dim = $('._allMenuDim');
        var $toggleBtn = $('._openAllMenu');

        var lastFocusEl = null;

        function isOpen() {
            return $layer.hasClass('is-open');
        }

        function getFocusable($root) {
            return $root.find('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])').filter(':visible');
        }

        function syncAria(opened) {
            $toggleBtn.attr('aria-expanded', opened ? 'true' : 'false');
            $dialog.attr('aria-hidden', opened ? 'false' : 'true');
        }

        function openAllmenu(opener) {
            if (isOpen()) return;

            lastFocusEl = opener || document.activeElement;

            $layer.addClass('is-open');
            $body.addClass('scrOff');
            $dim.stop(true, true).fadeIn(200);
            $toggleBtn.addClass('is-open');

            syncAria(true);

            var $focusable = getFocusable($dialog);
            ($focusable.first()[0] || $dialog[0]).focus();
        }

        function closeAllmenu() {
            if (!isOpen()) return;

            $layer.removeClass('is-open');
            $body.removeClass('scrOff');
            $dim.stop(true, true).fadeOut(200);
            $toggleBtn.removeClass('is-open');

            syncAria(false);

            if (lastFocusEl && $(lastFocusEl).length) $(lastFocusEl).focus();
        }

        function toggleAllmenu(btnEl) {
            isOpen() ? closeAllmenu() : openAllmenu(btnEl);
        }

        // 토글 버튼
        $toggleBtn.on('click', function (e) {
            toggleAllmenu(this);
        });

        // dim 클릭 닫기
        $dim.on('click', function () {
            closeAllmenu();
        });

        // ESC 닫기 (웹접근성)
        $(document).on('keydown.allmenu', function (e) {
            if (!isOpen()) return;

            if (e.key === 'Escape') {
                e.preventDefault();
                closeAllmenu();
                return;
            }

            if (e.key === 'Tab') {
                var $focusable = getFocusable($dialog);
                if (!$focusable.length) return;

                var first = $focusable.first()[0];
                var last = $focusable.last()[0];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });

        // 모바일 전체메뉴
        $dialog.on('click', '.mo-tab[role="tab"]', function () {
            var $btn = $(this);
            var panelId = $btn.attr('aria-controls');

            $btn
                .addClass('is-active')
                .attr({ 'aria-selected': 'true', tabindex: '0' })
                .siblings('.mo-tab')
                .removeClass('is-active')
                .attr({ 'aria-selected': 'false', tabindex: '-1' });

            $('#' + panelId).prop('hidden', false).siblings('.mo-panel').prop('hidden', true);
        });

        // 탭 키보드 이동
        $dialog.on('keydown', '.mo-left[role="tablist"] .mo-tab', function (e) {
            var $tabs = $dialog.find('.mo-left .mo-tab');
            var idx = $tabs.index(this);

            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                $tabs.eq(Math.min(idx + 1, $tabs.length - 1)).focus().trigger('click');
            }
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                $tabs.eq(Math.max(idx - 1, 0)).focus().trigger('click');
            }
            if (e.key === 'Home') {
                e.preventDefault();
                $tabs.eq(0).focus().trigger('click');
            }
            if (e.key === 'End') {
                e.preventDefault();
                $tabs.eq($tabs.length - 1).focus().trigger('click');
            }
        });

        // 모바일 아코디언
        $dialog.on('click', '._accBtn[aria-controls]', function () {
            var $btn = $(this);
            var panelId = $btn.attr('aria-controls');
            var $panel = $dialog.find('#' + panelId);

            if (!$panel.length) return;

            var opened = $btn.attr('aria-expanded') === 'true';
            var nextOpen = !opened;

            $btn.attr('aria-expanded', String(nextOpen));

            if (nextOpen) {
                $btn.parent('.acc-item-head').addClass('is-open');
                $panel.stop(true, true).slideDown(200);
                $btn.find('.ico').removeClass('ico-acc-plus').addClass('ico-acc-minus');
            } else {
                $btn.parent('.acc-item-head').removeClass('is-open');
                $panel.stop(true, true).slideUp(200);
                $btn.find('.ico').removeClass('ico-acc-minus').addClass('ico-acc-plus');
            }
        });

        // 초기 상태 보정
        $dialog.find('._accBtn[aria-controls]').each(function () {
            var $btn = $(this);
            var panelId = $btn.attr('aria-controls');
            var $panel = $dialog.find('#' + panelId);

            if (!$panel.length) return;

            var expanded = $btn.attr('aria-expanded') === 'true';

            if (expanded) {
                $panel.show();
                $btn.parent('.acc-item-head').addClass('is-open');
                $btn.find('.ico').removeClass('ico-acc-plus').addClass('ico-acc-minus');
            } else {
                $panel.hide();
                $btn.parent('.acc-item-head').removeClass('is-open');
                $btn.find('.ico').removeClass('ico-acc-minus').addClass('ico-acc-plus');
            }
        });

        // 초기 상태
        syncAria(false);
        $dim.hide();
    });
})(jQuery);