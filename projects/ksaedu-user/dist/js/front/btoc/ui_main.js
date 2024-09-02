/*
    visual
* */
// let menuSlider = new Swiper('.menu-slider', {
//     slidesPerView: 3,
//     // touchRatio: 0,
//     loop: true,
//     navigation: {
//         prevEl: '.menu-slider-wrapper .btn-arrow-prev',
//         nextEl: '.menu-slider-wrapper .btn-arrow-next'
//     },
//     breakpoints: {
//         //tablet
//         940: {
//             slidesPerView: 6,
//         },
//         // pc
//         1300: {
//             slidesPerView: 8,
//         },
//     },
// });
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

$('._mainTab').each(function () {
    $(this).on('click', '.item', function () {
        $(this).addClass('active').siblings().removeClass('active')
    })
})

/*
    ********************************************************
* */

/*
    오늘의 추천 slider
* */
let activeSlideIndex = 0;
let visualInterval;
let isStop = false;
let duTime = 5000;
let windowWidth = window.innerWidth;
let prevWidth = windowWidth;
let gap = windowWidth > 940 ? 1.16 : 1.08;

let visualSlider = $('.visual-slider-wrapper');
let visualSliderContents = visualSlider.find('.slide-contents');
let visualSliderItem = visualSlider.find('.slide-item');
let visualSliderInfoItem = visualSlider.find('._slideInfo .item');
let visualSliderLength = visualSliderItem.length;
let visualSliderPrevButton = visualSlider.find('.btn-prev');
let visualSliderNextButton = visualSlider.find('.btn-next');
let visualSliderProgressBar = visualSlider.find('.progressbar .bar');
let visualSliderPagingTotal = visualSlider.find('.page-num .total');
let visualSliderPagingCurrent = visualSlider.find('.page-num .current');

// 초기
function initializeVisualSlide() {
    setVisualSlide(activeSlideIndex)
    setVisualSliderInfo(activeSlideIndex)
    setVisualSliderPaging(activeSlideIndex)
    setVisualSliderProgress()

    if (visualInterval == null) {
        visualInterval = setInterval(function () {
            if (!isStop) {
                visualSliderNextButton.trigger('click');
            }
        }, duTime);
    }
}

// move next
function visualSliderMoveNext() {
    if (!visualSliderContents.attr('style')) {
        // update activeSlideIndex
        if (activeSlideIndex < visualSliderLength - 1) {
            activeSlideIndex++;
        } else {
            activeSlideIndex = 0;
        }

        // update visualSliderInfoItem
        setVisualSliderInfo(activeSlideIndex)

        // update
        let sliderWidth = $('.slide-item:last-child').outerWidth();
        sliderWidth = sliderWidth * gap;

        isStop = false;

        setVisualSliderProgress()

        clearInterval(visualInterval);

        $(this).closest('.visual-slider-wrapper').find('.slide-item.active').next('.slide-item').addClass('active');
        $(this).closest('.visual-slider-wrapper').find('.slide-item.active:first').removeClass('active').addClass('prev');
        $(this).closest('.visual-slider-wrapper').find('.slide-contents').css({
            'transform': 'matrix(1, 0, 0, 1, ' + (-sliderWidth) + ', 0)',
            'transition-duration': '1000ms'
        }).addClass('moving');

        $('.slide-item:first-child').clone().appendTo('.slide-contents').removeClass('prev');

        setVisualSliderPaging(activeSlideIndex)

        setTimeout(function () {
            $('.visual-slider-wrapper .slide-item.prev').remove();
            visualSliderContents.removeAttr('style');

            visualInterval = setInterval(function () {
                if (isStop) {
                    clearInterval(visualInterval);
                } else {
                    visualSliderNextButton.trigger('click');
                }
            }, duTime);
            $('.visual-slider-wrapper .slide-contents').removeClass('moving');
        }, 1000);
    }
}

// move prev
function visualSliderMovePrev() {
    if (!visualSliderContents.attr('style')) {
        // update activeSlideIndex
        if (activeSlideIndex > 0) {
            activeSlideIndex--;
        } else {
            activeSlideIndex = visualSliderLength - 1;
        }

        // update visualSliderInfoItem
        setVisualSliderInfo(activeSlideIndex)

        // update
        let sliderWidth = $('.slide-item:last-child').outerWidth();
        sliderWidth = sliderWidth * gap;

        isStop = false;

        setVisualSliderProgress()

        clearInterval(visualInterval);

        $(this).closest('.visual-slider-wrapper').find('.slide-item:last-child').clone().prependTo('.slide-contents').addClass('prev');
        $(this).closest('.visual-slider-wrapper').find('.slide-contents').css({
            'transform': 'matrix(1, 0, 0, 1, ' + (-sliderWidth) + ', 0)'
        }).addClass('moving');

        setTimeout(function () {
            visualSliderContents.css({
                'transform': 'matrix(1, 0, 0, 1, 0, 0)',
                'transition-duration': '1000ms'
            });
            visualSlider.find('.slide-item.active').prev('.slide-item').addClass('active').removeClass('prev');
            visualSlider.find('.slide-item.active:last').removeClass('active');

            setVisualSliderPaging(activeSlideIndex)

        }, 100);

        setTimeout(function () {
            $('.visual-slider-wrapper .slide-contents .slide-item:last-child').remove();
            visualSliderContents.removeAttr('style');

            visualInterval = setInterval(function () {
                if (isStop) {
                    clearInterval(visualInterval);
                } else {
                    let sliderWidth = $('.slide-item:last-child').outerWidth();
                    sliderWidth = sliderWidth * gap;
                    visualSliderNextButton.trigger('click');
                }
            }, duTime);
            $('.visual-slider-wrapper .slide-contents').removeClass('moving');
        }, 1000);
    }
}

// paging
function setVisualSliderPaging(idx) {
    visualSliderPagingTotal.text(visualSliderLength)
    visualSliderPagingCurrent.text(idx + 1);
}

// progress bar
function setVisualSliderProgress() {
    visualSliderProgressBar.css({
        'width': 0
    });
    visualSliderProgressBar.stop().animate({
        'width': '100%'
    }, duTime);
}

// set slide info
function setVisualSliderInfo(idx) {
    visualSliderInfoItem.eq(idx).addClass('active').siblings().removeClass('active');
}

// set slide info
function setVisualSlide(idx) {
    visualSliderItem.eq(idx).addClass('active');
}

visualSliderNextButton.on('click', visualSliderMoveNext);
visualSliderPrevButton.on('click', visualSliderMovePrev);

window.onresize = function () {
    let windowWidth = window.innerWidth;
    if (prevWidth > 940) {
        if (windowWidth < 940) {
            prevWidth = windowWidth;
            gap = 1.08;
            initializeVisualSlide()
        }
    } else if (prevWidth < 940) {
        if (windowWidth > 940) {
            prevWidth = windowWidth;
            gap = 1.16;
            initializeVisualSlide()
        }
    }
}

$(window).on('load', function () {
    initializeVisualSlide();
});
/*
    ********************************************************
* */


/*
    Banner slider
* */
const progressCircle = $('.banner-slider .progress .rolling');
// const bannerLinks = ['http://naver.com', 'http://google.com', 'http://kakao.com', 'http://naver.com', 'http://google.com', 'http://kakao.com']

let bannerSlider = new Swiper('.banner-slider', {
    centeredSlides: true,
    effect: 'fade',
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false
    },
    pagination: {
        el: '.banner-slider .page-num',
        type: 'fraction',
        currentClass: 'current',
        totalClass: 'total',
        renderFraction: function (currentClass, totalClass) {
            return '<span class="' + currentClass + '"></span><span class="' + totalClass + '"></span>';
        },
    },
    navigation: {
        prevEl: '.banner-slider .btn-arrow-prev',
        nextEl: '.banner-slider .btn-arrow-next'
    },
    on: {
        autoplayTimeLeft(s, time, progress) {
            progressCircle.css('--progress', `calc(1 - ${progress})`);
        },
        // slideChange: function () {
        //     $('.banner-slider-wrapper .view-detail a').attr('href', `${bannerLinks[this.realIndex]}`);
        // }
    },
});

$('._btnSlideState').on('click', function () {
    if (!$(this).hasClass('paused')) {
        bannerSlider.autoplay.pause();
        $(this).addClass('paused').html(`<i class="ico ico-play"></i><span class="sr-only">재생</span>`);
    } else {
        bannerSlider.autoplay.resume();
        $(this).removeClass('paused').html(`<i class="ico ico-stop"></i><span class="sr-only">멈춤</span>`);
    }
})
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

/*
    기업맞춤교육 Slider
* */
/*
************************************************************************************************
* */
const $sliderWrapper = $('._educationSliderPC .swiper-wrapper');
const $slides = $('._educationSliderPC .swiper-slide');
const slidesPerGroup = 4;
let currentIndex = 0;
let slideInterval;
let slideIsStop = false;

function startSlideInterval() {
    slideInterval = setInterval(function () {
        initSlider();
    }, 4000);
}

function stopSlideInterval() {
    clearInterval(slideInterval);
}

function updatePageNumbers() {
    const totalGroups = Math.ceil($slides.length / slidesPerGroup);
    const currentGroupIndex = Math.floor(currentIndex / slidesPerGroup) + 1;

    $('.education-slider-wrapper.pc .page-num .current').text(currentGroupIndex);
    $('.education-slider-wrapper.pc .page-num .total').text(totalGroups);
}

function updateProgress() {
    const totalGroups = Math.ceil($slides.length / slidesPerGroup);
    const currentGroupIndex = Math.floor(currentIndex / slidesPerGroup) + 1;

    const progress = $('.education-slider-wrapper.pc .swiper-scrollbar');
    const progressBar = $('.education-slider-wrapper.pc .bar');
    const scrollbarWidth = progress.width();

    const barPosition = ((currentGroupIndex - 1) / (totalGroups - 1)) * (scrollbarWidth - progressBar.width());

    progressBar.css('transform', 'translate3d(' + barPosition + 'px, 0, 0)');
}

function nextSlide() {
    stopSlideInterval();

    let nextGroupIndex = Math.floor(currentIndex / slidesPerGroup) + 1;
    const nextIndex = nextGroupIndex * (slidesPerGroup);

    if (nextIndex >= $slides.length) {
        currentIndex = 0;
        nextGroupIndex = 0;
    } else {
        currentIndex = nextIndex;
    }

    $slides.removeClass('swiper-slide-active');
    $slides.eq(currentIndex).addClass('swiper-slide-active');

    const newPosition = -nextGroupIndex * 1000 + 'px';
    $sliderWrapper.css('transform', 'translateX(' + newPosition + ')');

    updatePageNumbers();
    updateProgress();

    startSlideInterval();
}

function prevSlide() {
    stopSlideInterval();

    const currentGroupIndex = Math.floor(currentIndex / slidesPerGroup);
    let prevGroupIndex;

    if (currentGroupIndex - 1 < 0) {
        prevGroupIndex = Math.ceil($slides.length / slidesPerGroup) - 1;
    } else {
        prevGroupIndex = currentGroupIndex - 1;
    }

    const prevIndex = prevGroupIndex * slidesPerGroup;
    currentIndex = prevIndex < 0 ? $slides.length - 1 : prevIndex;

    $slides.removeClass('swiper-slide-active');
    $slides.eq(currentIndex).addClass('swiper-slide-active');

    const newPosition = -prevGroupIndex * 1000 + 'px';
    $sliderWrapper.css('transform', 'translateX(' + newPosition + ')');

    updatePageNumbers();
    updateProgress();

    startSlideInterval();
}

function setSlider() {
    updatePageNumbers()
    updateProgress()
}

function initSlider() {
    currentIndex = (currentIndex + 1) % $slides.length;

    $slides.removeClass('swiper-slide-active');
    $slides.eq(currentIndex).addClass('swiper-slide-active');

    const groupIndex = Math.floor(currentIndex / slidesPerGroup);

    if ((currentIndex + 1) % slidesPerGroup === 1) {
        const newPosition = -groupIndex * 1000 + 'px';
        $sliderWrapper.css('transform', 'translateX(' + newPosition + ')');
    }

    updateProgress();
    updatePageNumbers();
}

setSlider()
startSlideInterval()

$('.education-slider-wrapper.pc .btn-arrow-prev').on('click', prevSlide)
$('.education-slider-wrapper.pc .btn-arrow-next').on('click', nextSlide)

$slides.on('click', function(){
    stopSlideInterval();
    $(this).addClass('swiper-slide-active').siblings().removeClass('swiper-slide-active')
    startSlideInterval();
})

let educationSliderMobile = new Swiper('._educationSliderMobile', {
    slidesPerView: 'auto',
    spaceBetween: 0,
    loop: true,
    loopFillGroupBlank: false,
    autoplay: {
        delay: 6000,
        disableOnInteraction: false
    },
    pagination: {
        el: '.education-slider-wrapper.mobile .page-num',
        type: 'fraction',
        currentClass: 'current',
        totalClass: 'total',
        renderFraction: function (currentClass, totalClass) {
            return '<span class="' + currentClass + '"></span><span class="' + totalClass + '"></span>';
        },
    },
    navigation: {
        prevEl: '.education-slider-wrapper.mobile .btn-arrow-prev',
        nextEl: '.education-slider-wrapper.mobile .btn-arrow-next'
    },
    scrollbar: {
        el: '.education-slider-wrapper.mobile .swiper-scrollbar',
        draggable: true,
    },
    breakpoints: {
        //tablet
        940: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            loopFillGroupBlank: true,
            spaceBetween: 20,
        },
    },
});

function setEducationSliderMobile() {
    educationSliderMobile = new Swiper('._educationSliderMobile', {
        slidesPerView: 'auto',
        spaceBetween: 0,
        loop: true,
        loopFillGroupBlank: false,
        observer: true,
        observeParents: true,
        autoplay: {
            delay: 6000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.education-slider-wrapper.mobile .page-num',
            type: 'fraction',
            currentClass: 'current',
            totalClass: 'total',
            renderFraction: function (currentClass, totalClass) {
                return '<span class="' + currentClass + '"></span><span class="' + totalClass + '"></span>';
            },
        },
        navigation: {
            prevEl: '.education-slider-wrapper.mobile .btn-arrow-prev',
            nextEl: '.education-slider-wrapper.mobile .btn-arrow-next'
        },
        scrollbar: {
            el: '.education-slider-wrapper.mobile .swiper-scrollbar',
            draggable: true,
        },
        breakpoints: {
            //tablet
            940: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                loopFillGroupBlank: true,
                spaceBetween: 20,
            },
        },
    });
}

// function init() {
//     educationSliderMobile.destroy();
//     setTimeout(setEducationSliderMobile,1500)
// }

window.onresize = function () {
    let windowWidth = window.innerWidth;
    if (prevWidth > 940) {
        if (windowWidth < 940) {
            prevWidth = windowWidth;
            // console.log('mobile')
            // init()
        }
    } else if (prevWidth < 940) {
        if (windowWidth > 940) {
            prevWidth = windowWidth;
            // console.log('tablet')
            // init()
        }
    }
}

/*
    ********************************************************
* */

/*
    Seminar Slider
* */
let seminarSlider = new Swiper('.seminar-slider', {
    slidesPerView: 'auto',
    spaceBetween: 30,
    slidesPerGroup: 1,
    // touchRatio: 0,
    observer: true,
    observeParents: true,
    navigation: {
        prevEl: '.seminar-slider-wrapper .btn-arrow-prev',
        nextEl: '.seminar-slider-wrapper .btn-arrow-next'
    },
    breakpoints: {
        //tablet
        940: {
            slidesPerView: 3,
            spaceBetween: 25,
            slidesPerGroup: 3,
        },
        // pc
        1300: {
            slidesPerView: 4,
            spaceBetween: 40,
            slidesPerGroup: 4,
        },
    },
});
/*
    ********************************************************
* */

/* s search box -- 2024.01.09 추가 */
$('._btnListToggle').on('click', function () {
    $('._boxSearchList').slideToggle(200);
    $('._boxSearch').toggleClass('open');
})
/* e search box */