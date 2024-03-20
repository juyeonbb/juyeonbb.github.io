/*
    visual
* */
let mainSlider = new Swiper('._mainSlider', {
    centeredSlides: true,
    effect: 'fade',
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false
    },
    pagination: {
        el: '.main-slider-wrapper .page-num',
        type: 'fraction',
        currentClass: 'current',
        totalClass: 'total',
        renderFraction: function (currentClass, totalClass) {
            return '<span class="' + currentClass + '"></span><span class="' + totalClass + '"></span>';
        },
    },
    scrollbar: {
        el: '.main-slider-wrapper .swiper-scrollbar',
        draggable: false,
    },
});

$('._btnSlideState').on('click', function () {
    if (!$(this).hasClass('paused')) {
        mainSlider.autoplay.pause();
        $(this).addClass('paused').html(`<i class="ico ico-m-play"></i><span class="sr-only">재생</span>`);
    } else {
        mainSlider.autoplay.resume();
        $(this).removeClass('paused').html(`<i class="ico ico-m-stop"></i><span class="sr-only">멈춤</span>`);
    }
})
/*
    ********************************************************
* */

/*
    main > tab
* */
if ($('.main-contents').length) {
    $('.tabs').each(function () {
        $(this).on('click', 'a', function () {
            $(this).parent().addClass('on').siblings().removeClass('on')
        })
    })
}
/*
    ********************************************************
* */

/*
    Pick For U Slider
* */
let pickSlider = new Swiper('.pick-slider', {
    slidesPerView: 'auto',
    spaceBetween: 30,
    // touchRatio: 0,
    navigation: {
        prevEl: '.section-pick-for-u .btn-arrow-prev',
        nextEl: '.section-pick-for-u .btn-arrow-next'
    },
    breakpoints: {
        //tablet
        940: {
            slidesPerView: 2,
            spaceBetween: 40,
        },
        // pc
        1300: {
            slidesPerView: 3,
        },
    },
});
/*
    ********************************************************
* */

/* recent Slider */
const progressCircle = $('.recent-slider-wrapper .rolling');
const activeSlideLinks = [
    'http://naver.com',
    'http://google.com',
    'http://kakao.com',
    'http://naver.com',
    'http://naver.com',
    'http://google.com',
    'http://kakao.com'
]

// 5개 초과일 경우만 slide 동작
let options = {};
let recentSliderSlides = $('.recent-slider .swiper-slide').length;

if(recentSliderSlides > 5) {
    $('.section-recent').removeClass('stopped')
    options = {
        spaceBetween: 0,
        slidesPerView: 5,
        centeredSlides: true,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.recent-slider-wrapper .btn-nav-next',
            prevEl: '.recent-slider-wrapper .btn-nav-prev'
        },
        on: {
            autoplayTimeLeft(s, time, progress) {
                progressCircle.css('--progress', `calc(1 - ${progress})`);
            },
            slideChange: function () {
                // scroll UI
                let activeIndex = this.realIndex;
                let totalSlides = this.slides.length;
                let scrollbar = document.querySelector('.section-recent .swiper-scrollbar');
                let scrollbarDrag = document.querySelector('.section-recent .swiper-scrollbar-drag');
                let scrollbarWidth = scrollbar.clientWidth;
                let dragPosition = (activeIndex / (totalSlides - 1)) * (scrollbarWidth - scrollbarDrag.clientWidth);
                scrollbarDrag.style.transform = 'translate3d(' + dragPosition + 'px, 0, 0)';

                // links on progress
                $('.recent-slider-wrapper .progress').attr('onclick', `location.href="${activeSlideLinks[this.realIndex]}"`);
            }
        }
    };
    let recentSlider = new Swiper('.recent-slider', options);
} else {
    $('.section-recent').addClass('stopped')
    options = {
        spaceBetween: 0,
        slidesPerView: 5,
        centeredSlides: true,
        loop: false,
        touchRatio: 0,
        on: {
            slideChange: function () {
                // links on progress
                $('.recent-slider-wrapper .progress').attr('onclick', `location.href="${activeSlideLinks[this.realIndex]}"`);
            }
        }
    };
    let recentSlider = new Swiper('.recent-slider', options);
    recentSlider.slideTo(2)
}