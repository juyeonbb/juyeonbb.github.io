let front = (function () {

    let event = {};
    let fn = {};

    let $dim, $body, lastFocusedElement = null;

    event.commonHandlers = function () {
        // 접근성 Events
        $(document).on('keydown', '.form-radio, .form-check', handleFormAccessibility); // 웹접근성 - INPUT (RADIO & CHECKBOX)

        $(document).on('click', '._skip a', skipNav); // SKIP NAV

        $(document).on('click', '.section-filter[role="radiogroup"] [role="radio"]', function (e) {
            const $radio = $(e.currentTarget);
            if ($radio.attr('aria-checked') === 'true') return;

            const $group = $radio.closest('.section-filter[role="radiogroup"]');

            $group.find('[role="radio"]')
                .attr('aria-checked', 'false')
                .closest('.item')
                .removeClass('on');

            $radio
                .attr('aria-checked', 'true')
                .closest('.item')
                .addClass('on');
        });

        // 좋아요 버튼
        $(document).on('click', '._btnLike', toggleLike);

        // tooltip
        initTooltip();

        // footer (관련사이트)
        $('._footerDropdownButton').on('click', function (e) {
            e.stopPropagation();
            $('._footerDropdown').addClass('active');
        });

        $('._footerDropdownCloseButton').on('click', function (e) {
            e.stopPropagation();
            $('._footerDropdown').removeClass('active');
        });

        // 드롭다운 버튼 클릭 (토글)
        $(document).off('click.dropdown', '._dropdownBtn');
        $(document).on('click.dropdown', '._dropdownBtn', function (e) {
            e.stopPropagation();
            fn.toggleDropdown($(this));
        });

        // 드롭다운 외부 클릭 시 닫기
        $(document).off('click.dropdownOut');
        $(document).on('click.dropdownOut', function (e) {
            if (!$(e.target).closest('._dropdown').length) {
                fn.closeAllDropdowns();
            }
        });

        // 드롭다운 메뉴 내 항목 선택 시 닫기
        $(document).off('click.dropdownItem', '._dropdownItem');
        $(document).on('click.dropdownItem', '._dropdownItem', function (e) {
            const $item = $(this);
            const $dropdown = $item.closest('._dropdown');

            if ($item.hasClass('_zoomItem')) {
                e.preventDefault();
                const zoom = $item.data('zoom');
                fn.zoom.apply(zoom);
                fn.zoom.syncUI($dropdown, zoom);
            }

            fn.closeDropdown($dropdown);
        });

        // 키보드 접근성 처리 (Enter/Space로 드롭다운 항목 선택)
        $(document).off('keydown.dropdownItem', '._dropdownItem');
        $(document).on('keydown.dropdownItem', '._dropdownItem', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                $(this).trigger('click');
            }
        });

        // 키보드 접근성 처리 (ESC로 드롭다운 닫기)
        $(document).off('keydown.dropdownWrap', '._dropdown');
        $(document).on('keydown.dropdownWrap', '._dropdown', function (e) {
            if (e.key === 'Escape') {
                e.preventDefault();
                fn.closeDropdown($(this));
                $(this).find('._dropdownBtn').focus();
            }
        });

        // 화면 크기 조정
        (function () {
            const saved = fn.zoom.restore();

            $('._zoomDropdown').each(function () {
                fn.zoom.syncUI($(this), saved);
            });

            // $(document).off('click.zoom', '._zoomDropdown ._zoomItem');
            $(document).on('click.zoom', '._zoomDropdown ._zoomItem', function (e) {
                e.preventDefault();

                const $item = $(this);
                const $wrap = $item.closest('._zoomDropdown');
                const zoom = $item.data('zoom');

                fn.zoom.apply(zoom);
                fn.zoom.syncUI($wrap, zoom);
            });

            $(window).off('resize.zoom');
            $(window).on('resize.zoom', debounce(function () {
                const current = Number(localStorage.getItem('frontDisplayZoom') || '1');
                fn.zoom.apply(current);
            }, 200));
        })();

        // 상세검색 토글
        $(document).on('click', '._btnSearchDetail', function () {
            const $btn = $(this);
            const target = $btn.attr('aria-controls');
            const $panel = $('.' + target);

            const isOpen = $btn.attr('aria-expanded') === 'true';

            $btn.attr('aria-expanded', String(!isOpen));
            $panel.prop('hidden', isOpen);
        });
    };

    function handleFormAccessibility(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            let input = $(this).find('input');
            input.prop('checked', input.attr('type') === 'checkbox' ? !input.prop('checked') : true).trigger('change');
        }
    }

    function skipNav(e) {
        e.preventDefault();
        $(this).hide();
        $('html, body').animate({scrollTop: $('._header').outerHeight()}, 300);
        $('.container').focus();
    }

    function toggleLike() {
        let isActive = $(this).hasClass('on');

        $(this).toggleClass('on', !isActive);
        $(this).find('.sr-only').text(isActive ? '좋아요 해제됨' : '좋아요 선택됨');
    }

    // Input - file -------------------------------------------
    $(document).off('click.fileUI', '.form-file-btn');
    $(document).on('click.fileUI', '.form-file-btn', function () {
        const target = $(this).data('file-target');
        const $input = $(target);
        if ($input.length) $input.trigger('click');
    });

    $(document).off('change.fileUI', '.form-file-input');
    $(document).on('change.fileUI', '.form-file-input', function () {
        const file = this.files && this.files[0];
        const name = file ? file.name : '선택된 파일 없음';

        $(this)
            .closest('.form-file-row')
            .find('.form-file-name')
            .val(name);
    });
    // --------------------------------------------------------

    // Accordion ----------------------------------------------
    $(document).off('click.accordion', '.accordion .btn-accordion');
    $(document).on('click.accordion', '.accordion .btn-accordion', function (e) {
        e.preventDefault();

        const $btn = $(this);
        const $container = $btn.closest('.accordion');
        const type = $container.data('type') || 'singleOpen';

        const $item = $btn.closest('.accordion-item');
        const isExpanded = $btn.attr('aria-expanded') === 'true';

        if (type !== 'multiOpen' && !isExpanded) {
            $container.find('.btn-accordion').attr('aria-expanded', 'false').removeClass('active');
            $container.find('.accordion-item').removeClass('active');
        }

        $btn.attr('aria-expanded', (!isExpanded).toString()).toggleClass('active', !isExpanded);
        $item.toggleClass('active', !isExpanded);
    });
    // --------------------------------------------------------

    // Tab ----------------------------------------------------
    event.tabHandlers = function () {
        $(document).off('click.tabs', '._tabContainer [role="tab"]');
        $(document).on('click.tabs', '._tabContainer [role="tab"]', function (e) {
            e.preventDefault();
            const $tab = $(this);
            const $container = $tab.closest('._tabContainer');
            activateTab($container, $tab);
        });

        $(document).off('keydown.tabs', '._tabContainer [role="tab"]');
        $(document).on('keydown.tabs', '._tabContainer [role="tab"]', function (e) {
            const $currentTab = $(this);
            const $container = $currentTab.closest('._tabContainer');

            const $tabs = $container.find('[role="tab"]');
            const idx = $tabs.index($currentTab);

            let nextIdx = null;

            switch (e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    nextIdx = (idx + 1) % $tabs.length;
                    $tabs.eq(nextIdx).focus();
                    break;

                case 'ArrowLeft':
                    e.preventDefault();
                    nextIdx = (idx - 1 + $tabs.length) % $tabs.length;
                    $tabs.eq(nextIdx).focus();
                    break;

                case 'Home':
                    e.preventDefault();
                    $tabs.first().focus();
                    break;

                case 'End':
                    e.preventDefault();
                    $tabs.last().focus();
                    break;

                case 'Enter':
                case ' ':
                    e.preventDefault();
                    activateTab($container, $currentTab);
                    break;
            }
        });

        function activateTab($container, $tab) {
            const targetId = $tab.attr('aria-controls');
            if (!targetId) return;

            const $tabs = $container.find('[role="tab"]');
            const $panels = $container.find('[role="tabpanel"]');
            const $targetPanel = $('#' + targetId);

            $tabs.attr('aria-selected', 'false').closest('.item').removeClass('on');

            $panels.attr('hidden', true).removeClass('on');

            $tab.attr('aria-selected', 'true').closest('.item').addClass('on');

            $targetPanel.removeAttr('hidden').addClass('on');
        }
    };
    // --------------------------------------------------------

    // Popup --------------------------------------------------
    event.popupHandlers = function () {
        $(document).off('click.popup', '._popupTrigger');
        $(document).on('click.popup', '._popupTrigger', function (e) {
            e.preventDefault();
            lastFocusedElement = document.activeElement;

            const target = $(this).data('trigger'); // popup1, popup2 ...
            fn.openPopup(target, this); // trigger element 전달
        });

        $(document).off('click.popup', '._popupClose');
        $(document).on('click.popup', '._popupClose', function (e) {
            e.preventDefault();
            fn.closePopup();
        });

        // dim 클릭 시 닫기
        // $(document).off('click.popup', '._dim');
        // $(document).on('click.popup', '._dim', function () {
        //     fn.closePopup();
        // });
    };

    fn.openPopup = function (target, triggerEl) {
        const $popup = $(`._popup[data-popup="${target}"]`);
        if (!$popup.length) return;

        const $content = $popup.find('.popup-content').first();

        $popup.data('triggerEl', triggerEl || null);

        $dim.fadeIn(200);
        $popup.fadeIn(200, function () {
            $body.addClass('scrOff');

            $popup.attr('role', 'dialog');

            const $first = $popup.find('._popupClose, a, button, input, select, textarea, [tabindex="0"]').filter(':visible').first();
            if ($first.length) $first.focus();
            else $content.attr('tabindex', '-1').focus();

            if (window.common && typeof common.focusTrap === 'function') {
                common.focusTrap($content[0]);
            }
        });

        $content.off('keydown.popupEsc').on('keydown.popupEsc', function (e) {
            if (e.key === 'Escape' || e.key === 'Esc') {
                e.preventDefault();
                fn.closePopup();
            }
        });

        $popup.off('mousedown.popupOutside').on('mousedown.popupOutside', function (e) {
            if (!$(e.target).closest('.popup-content').length) {
                const $focusReturn = $popup.find('._popupClose, a, button, input, select, textarea, [tabindex="0"]').filter(':visible').first();
                if ($focusReturn.length) $focusReturn.focus();
                else $content.focus();
            }
        });

        $('#wrap').attr('inert', '');
    };

    fn.closePopup = function () {
        const $visiblePopup = $('._popup:visible').last();
        if (!$visiblePopup.length) return;

        const triggerEl = $visiblePopup.data('triggerEl');

        $visiblePopup.fadeOut(200, function () {
            $visiblePopup.find('.popup-content').off('keydown.popupEsc');
            $visiblePopup.off('mousedown.popupOutside');

            if ($('._popup:visible').length === 0) {
                $dim.fadeOut(200);
                $body.removeClass('scrOff');
                $('#wrap').removeAttr('inert');
            }

            if (triggerEl && typeof triggerEl.focus === 'function') {
                triggerEl.focus();
            } else {
                lastFocusedElement?.focus();
            }
        });
    };
    // --------------------------------------------------------

    // Zoom ---------------------------------------------------
    fn.zoom = (function () {
        const STORAGE_KEY = 'frontDisplayZoom';

        function apply(zoomValue) {
            const zoom = Number(zoomValue);
            if (!Number.isFinite(zoom) || zoom <= 0) return;

            document.body.style.zoom = String(zoom);
            localStorage.setItem(STORAGE_KEY, String(zoom));

            const $wrap = $('#wrap');
            if (window.innerWidth >= 1024 && zoom > 1) $wrap.addClass('scaled-layout');
            else $wrap.removeClass('scaled-layout');
        }

        function restore() {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) apply(saved);
            return saved || '1';
        }

        function syncUI($zoomWrap, zoom) {
            const $items = $zoomWrap.find('._zoomItem');
            $items.removeClass('on');

            const $matched = $items.filter(function () {
                return String($(this).data('zoom')) === String(zoom);
            }).first();

            const $active = $matched.length ? $matched : $items.filter('[data-zoom="1"]').first();
            $active.addClass('on');

            // $zoomWrap.find('._zoomLabel').text($active.text().trim());
        }

        return { apply, restore, syncUI };
    })();
    // --------------------------------------------------------

    // debounce  ----------------------------------------------
    function debounce(func, wait) {
        let timeout;
        return function () {
            clearTimeout(timeout);
            timeout = setTimeout(func, wait);
        };
    }
    // --------------------------------------------------------

    // tooltip ------------------------------------------------
    function initTooltip() {
        const buttons = document.querySelectorAll('._btnTooltip');

        buttons.forEach((button) => {
            const tooltip = button.nextElementSibling;

            if (!tooltip || !tooltip.classList.contains('_tooltip')) return;

            const popperInstance = Popper.createPopper(button, tooltip, {
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 8],
                        },
                    },
                ],
            });

            function show() {
                tooltip.setAttribute('data-show', '');

                popperInstance.setOptions((options) => ({
                    ...options,
                    modifiers: [
                        ...options.modifiers,
                        {name: 'eventListeners', enabled: true},
                    ],
                }));

                popperInstance.update();
            }

            function hide() {
                tooltip.removeAttribute('data-show');

                popperInstance.setOptions((options) => ({
                    ...options,
                    modifiers: [
                        ...options.modifiers,
                        {name: 'eventListeners', enabled: false},
                    ],
                }));
            }

            const showEvents = ['click', 'focus'];

            showEvents.forEach((eventName) => {
                button.addEventListener(eventName, (e) => {
                    e.stopPropagation();
                    show();
                });
            });

            document.addEventListener('click', (e) => {
                if (!button.contains(e.target) && !tooltip.contains(e.target)) {
                    hide();
                }
            });

            button.addEventListener('blur', hide);
        });
    }
    // --------------------------------------------------------

    // Dropdown
    fn.openDropdown = function ($dropdown) {
        fn.closeAllDropdowns($dropdown);
        $dropdown.addClass('active');

        const $menu = $dropdown.find('._dropdownMenu');
        $dropdown.find('._dropdownBtn').attr('aria-expanded', 'true');

        $menu.removeAttr('hidden').attr('aria-hidden', 'false').removeAttr('inert').addClass('show');
    };

    fn.closeDropdown = function ($dropdown) {
        const $btn = $dropdown.find('._dropdownBtn');
        const $menu = $dropdown.find('._dropdownMenu');

        if ($.contains($menu[0], document.activeElement)) {
            $btn.focus();
        }

        $dropdown.removeClass('active');
        $btn.attr('aria-expanded', 'false');
        $menu.removeClass('show').attr('aria-hidden', 'true').attr('hidden', 'hidden');
        $menu.attr('inert', '');
    };

    fn.toggleDropdown = function ($button) {
        const $dropdown = $button.closest('._dropdown');
        if ($dropdown.hasClass('active')) {
            fn.closeDropdown($dropdown);
        } else {
            fn.openDropdown($dropdown);
            $dropdown.find('._dropdownMenu [role="menuitem"]').first().focus();
        }
    };

    fn.closeAllDropdowns = function ($excludeDropdown = null) {
        $('._dropdown.active').each(function () {
            if ($(this).get(0) !== ($excludeDropdown && $excludeDropdown.get(0))) {
                fn.closeDropdown($(this));
            }
        });
    };

    let init = function () {
        $dim = $('._dim');
        $body = $('body');
        event.commonHandlers();
        event.popupHandlers();
        event.tabHandlers();
    };

    return {
        init,
        fn,
    };
})();

$(document).ready(front.init);