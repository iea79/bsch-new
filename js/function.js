/*!
 *
 * Evgeniy Ivanov - 2021
 * busforward@gmail.com
 * Skype: ivanov_ea
 *
 */

var app = {
    pageScroll: '',
    lgWidth: 1200,
    mdWidth: 992,
    smWidth: 768,
    resized: false,
    iOS: function () {
        return navigator.userAgent.match( /iPhone|iPad|iPod/i );
    },
    touchDevice: function () {
        return navigator.userAgent.match( /iPhone|iPad|iPod|Android|BlackBerry|Opera Mini|IEMobile/i );
    }
};

function isLgWidth() {
    return $( window ).width() >= app.lgWidth;
} // >= 1200
function isMdWidth() {
    return $( window ).width() >= app.mdWidth && $( window ).width() < app.lgWidth;
} //  >= 992 && < 1200
function isSmWidth() {
    return $( window ).width() >= app.smWidth && $( window ).width() < app.mdWidth;
} // >= 768 && < 992
function isXsWidth() {
    return $( window ).width() < app.smWidth;
} // < 768
function isIOS() {
    return app.iOS();
} // for iPhone iPad iPod
function isTouch() {
    return app.touchDevice();
} // for touch device


$( document ).ready( function () {
    // Хак для клика по ссылке на iOS
    if ( isIOS() ) {
        $( function () {
            $( document ).on( 'touchend', 'a', $.noop )
        } );
    }

    // Запрет "отскока" страницы при клике по пустой ссылке с href="#"
    $( '[href="#"]' ).click( function ( event ) {
        event.preventDefault();
    } );

    // Inputmask.js
    // $('[name=tel]').inputmask("+9(999)999 99 99",{ showMaskOnHover: false });
    // formSubmit();

    initHomeSlider();
    toggleDropdownUserMenu();
    toggleProgramSteps();


    checkOnResize();

    $('.select').select2({
        placeholder: $(this).data('placeholder'),
        minimumResultsForSearch: Infinity
    });

    $('.lkCourseAside__parent > a').each(function(i, el) {
        let content = $(el).find('.lkCourseAside__tooltip').html();
        $(el).tooltipster({
            content: $(content),
            position: 'right',
            // trigger: 'click'
        });
    });


} );

$( window ).resize( function () {
    var windowWidth = $( window ).width();
    // Запрещаем выполнение скриптов при смене только высоты вьюпорта (фикс для скролла в IOS и Android >=v.5)
    if ( app.resized == windowWidth ) {
        return;
    }
    app.resized = windowWidth;

    checkOnResize();
} );

function checkOnResize() {
    repalceHeaderElem();
    replaceProgramsElem();
    initParthnersSlider();
    initCampusSliders();
    initReviewSliders();
    initRecommendSliders();
    replaceCourseActionbar();
    replaceRecommendButton();
    lkCoursesProgress();
    replaceNameInCourseMessageFromMobile();
    lkCoursesProgress();
    replaceRecommendButton();
}

// Stiky menu // Липкое меню. При прокрутке к элементу #header добавляется класс .stiky который и стилизуем
function stikyMenu() {
    let HeaderTop = $( 'header' ).offset().top + $( '.home' ).innerHeight();
    let currentTop = $( window ).scrollTop();

    setNavbarPosition();

    $( window ).scroll( function () {
        setNavbarPosition();
    } );

    function setNavbarPosition() {
        currentTop = $( window ).scrollTop();

        if ( currentTop > HeaderTop ) {
            $( 'header' ).addClass( 'stiky' );
        } else {
            $( 'header' ).removeClass( 'stiky' );
        }

        $( '.navbar__link' ).each( function () {
            let section = $( this ).attr( 'href' );

            if ( $( 'section' ).is( section ) ) {
                let offset = $( section ).offset().top;

                if ( offset <= currentTop && offset + $( section ).innerHeight() > currentTop ) {
                    $( this ).addClass( 'active' );
                } else {
                    $( this ).removeClass( 'active' );
                }
            }
        } );
    }
}

function initHomeSlider() {
    const playSpeed = 7; // in second

    $( '.homeSlider' ).slick( {
        dots: false,
        infinite: true,
        fade: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: playSpeed * 1000,
        pauseOnHover: false,
        pauseOnFocus: false,
        draggable: false,
        arrows: true,
        nextArrow: $( '.homeSlider__next' ),
        prevArrow: $( '.homeSlider__prev' ),
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: '.homeThumbs',
        responsive: [ {
            breakpoint: 768,
            settings: {
                autoplay: true,
                arrows: false,
                draggable: true,
            }
        } ]
    } );

    $( '.homeThumbs' ).slick( {
        dots: false,
        infinite: true,
        pauseOnHover: false,
        pauseOnFocus: false,
        arrows: false,
        draggable: false,
        slidesToShow: 2,
        slidesToScroll: 1,
        asNavFor: '.homeSlider',
        focusOnSelect: true,
        responsive: [ {
            breakpoint: 768,
            settings: {
                draggable: true,
            }
        } ]
    } );

    $( '.homeThumbs__progress span' ).css( 'animationDuration', playSpeed * 1.05 + 's' );
}

function initParthnersSlider() {
    const slider = $( '.parthnersLine__list:not(.slick-initialized)' );

    slider.slick( {
        dots: true,
        infinite: false,
        arrows: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [ {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
            }
        } ]
    } );
    // if (condition) {
    //
    // } else {
    //
    // }
}

function openLightboxModal() {
    let modal = $( '#lightboxModal' ),
        slider = $( '.lightboxSlider' ),
        toggl = $( '[data-target="#lightboxModal"]' );


    toggl.on( 'click', function ( e ) {
        e.preventDefault();
        let images = $( this ).closest( '.campusSlider' ).find( 'a' ),
            index = $( this ).parent().attr( 'data-slick-index' );

        images.each( ( i, item ) => {
            slider.append( `
                <div class="lightboxSlider__item">
                    <img src="${item.href}" />
                    <div class="lightboxSlider__title">${item.title}</div>
                </div>
                ` );
        } );

        console.log( index );

        slider.slick( {
            dots: false,
            infinite: false,
            speed: 500,
            arrows: true,
            nextArrow: $( '.lightboxSlider__next' ),
            prevArrow: $( '.lightboxSlider__prev' ),
        } );

        slider.slick( 'slickGoTo', index );

        modal.modal( 'show' );

    } );

    modal.on( 'hidden.bs.modal', () => {
        slider.slick( 'destroy' );
        slider.html( '' );
    } );

}
openLightboxModal();

function toggleCoursePageNavbar() {
    let toggl = $( '.lkCourseAside__toggle' ),
        body = $( '.lkCoursePage' );

    toggl.on( 'click', () => {
        body.toggleClass( 'nav_hidden' );
    } )
}
toggleCoursePageNavbar();

function initCampusSliders() {
    const sliders = $( '.campusSlider:not(.slick-initialized)' );

    sliders.each( function ( i, slider ) {
        $( slider ).slick( {
            dots: true,
            infinite: false,
            // speed: 300,
            arrows: false,
            // nextArrow: '<button class="slick-next"></button>',
            // prevArrow: '<button class="slick-prev"></button>',
            slidesToShow: 2,
            slidesToScroll: 1,
            focusOnSelect: true,
            responsive: [ {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                }
            } ]
        } );
    } );
}

function toggleVideoModal() {
    let modal = document.querySelector( '#videoModal' ),
        video;

    $( modal ).on( 'show.bs.modal', () => {
        video = modal.querySelector( 'video' );
        video.play();
    } );

    $( modal ).on( 'hide.bs.modal', () => {
        video = modal.querySelector( 'video' );
        video.pause();
    } );
}
toggleVideoModal();

function initReviewSliders() {
    const slider = $( '.programReview__list:not(.slick-initialized)' ),
        sliderMob = $( '.programReview__list.slick-initialized' );

    if ( isXsWidth() ) {
        slider.slick( {
            dots: true,
            arrows: false,
        } );
    } else {
        sliderMob.slick( 'destroy' );
    }

}

function collapsed() {
    $( '[data-collapsed-toggle]' ).on( 'click', function () {
        const wrap = $( this ).closest( '[data-collapsed-wrap]' ),
            body = wrap.find( '[data-collapsed-body]' );

            $('[data-collapsed-body]').not(wrap).removeClass('open');

        body.toggleClass( 'open' );
    } );
}
collapsed();

function accordion() {
    $( '[data-accordion-toggle]' ).on( 'click', function () {
        const wrap = $( this ).closest( '[data-accordion-wrap]' ),
            body = wrap.find( '[data-accordion-body]' );

        $( '[data-accordion-body]' ).not( body ).removeClass( 'open' );
        body.toggleClass( 'open' );
    } );
}
accordion();

function toggleProgramSteps() {
    let list = $('.programSteps__list'),
        item = $('.programSteps__item'),
        label = $('.programSteps__action span'),
        labelText = label.text(),
        toggle = $('.js-programm-toggle');

    // if (isXsWidth()) {
    //     toggle = $('.js-programm-toggle');
    // }

    toggle.on('click', function() {
        toggleVisible();
    });

    function toggleVisible() {
        list.toggleClass('open');
        item.toggleClass('show');
        if (list.hasClass('open')) {
            label.text('Скрыть программу');
        } else {
            label.text(labelText);
            $('html').animate({
                scrollTop: $(".programSteps.section").offset().top
            }, 500);
        }
    }
}


function openMobileNav() {
    let wrapp = $( 'nav' );

    $( '.navbar__toggle' ).on( 'click', function () {
        wrapp.toggleClass( 'open' );
        $( 'body' ).toggleClass( 'modal-open' );

        if ( wrapp.hasClass( 'open' ) ) {
            $( 'body' ).append( '<div class="nav__overlay" />' );
        } else {
            $( '.nav__overlay' ).remove();
        }
    } );
    $( 'body' ).on( 'click', '.nav__overlay', function () {
        disableStateOpen();
    } );

    $( window ).resize( function () {
        if ( !isXsWidth() ) {
            disableStateOpen();
        }
    } );

    function disableStateOpen() {
        $( '.nav__overlay' ).remove();
        wrapp.removeClass( 'open' );
        $( 'body' ).removeClass( 'modal-open' );
    }
}
openMobileNav();

function initLkAdvSlider() {
    $( '.lkAdvSlider' ).slick( {
        dots: true,
        infinite: false,
        arrows: false,
    } );
}
initLkAdvSlider();

function repalceHeaderElem() {
    const loginBtn = $( '.header .btn' );
    if ( isXsWidth() ) {
        loginBtn.appendTo( '.header__nav' );
    } else {
        loginBtn.appendTo( '.header__login' );
    }
}

function replaceProgramsElem() {
    const descr = $( '.programsList__text' );

    descr.each( function ( index, el ) {
        const wrap = $( el ).closest( '.programsList__item' ),
            name = wrap.find( '.programsList__name' ),
            head = wrap.find( '.programsList__head' );

        if ( isXsWidth() ) {
            $( el ).insertAfter( name );
        } else {
            $( el ).appendTo( head );
        }
    } );
}

// Scroll to ID // Плавный скролл к элементу при нажатии на ссылку. В ссылке указываем ID элемента
function srollToId() {
    $( '[data-scroll-to]' ).click( function () {
        let scrolled = $( this ).attr( 'href' );
        if ( $( scrolled ).length != 0 ) {
            $( 'html, body' ).animate( {
                scrollTop: $( scrolled ).offset().top
            }, 500 );
        }
        return false;
    } );
}

function srollToTop() {
    $( '.lkToTop' ).on( 'click', function () {
        $( 'html, body' ).animate( {
            scrollTop: 0
        }, 500 );
    } );
}
srollToTop();

function toggleTabs() {
    let toggle = $( '[data-tab]' );
    toggle.on( 'click', ( e ) => {
        let self = e.target;
        $( '[data-tab]' ).removeClass( 'active' );
        $( self ).addClass( 'active' );
        $( '[data-plate]' ).removeClass( 'active' );
        $( '[data-plate=' + self.dataset.tab + ']' ).addClass( 'active' );
    } );
}
toggleTabs();

function onVisible( selector, callback, repeat = false ) {

    let options = {
        threshold: [ 0.5 ]
    };
    let observer = new IntersectionObserver( onEntry, options );
    let elements = document.querySelectorAll( selector );

    for ( let elm of elements ) {
        observer.observe( elm );
    }

    function onEntry( entry ) {
        entry.forEach( change => {
            let elem = change.target;
            // console.log(change);
            // console.log(elem.innerHTML);
            if ( change.isIntersecting ) {
                if ( !elem.classList.contains( 'show' ) || repeat ) {
                    elem.classList.add( 'show' );
                    callback( elem );
                }
            }
        } );
    }
}

onVisible( '.programsInfo__number', function ( e ) {
    animateNumber( e, e.innerHTML );
} );

function animateNumber( elem, final, duration = 1000 ) {
    let start = 0;
    // console.log('init');
    setInterval( function () {
        if ( final > start ) {
            elem.innerHTML = start++;
        }
    }, duration / final );
}

// Проверка направления прокрутки вверх/вниз
function checkDirectionScroll() {
    var tempScrollTop, currentScrollTop = 0;

    $( window ).scroll( function () {
        currentScrollTop = $( window ).scrollTop();

        if ( tempScrollTop < currentScrollTop ) {
            app.pageScroll = "down";
        } else if ( tempScrollTop > currentScrollTop ) {
            app.pageScroll = "up";
        }
        tempScrollTop = currentScrollTop;

    } );
}
checkDirectionScroll();

// Видео youtube для страницы
function uploadYoutubeVideo() {
    if ( $( ".js-youtube" ) ) {

        $( ".js-youtube" ).each( function () {
            // Зная идентификатор видео на YouTube, легко можно найти его миниатюру
            $( this ).css( 'background-image', 'url(http://i.ytimg.com/vi/' + this.id + '/sddefault.jpg)' );

            // Добавляем иконку Play поверх миниатюры, чтобы было похоже на видеоплеер
            $( this ).append( $( '<img src="img/play.svg" alt="Play" class="video__play">' ) );

        } );

        $( '.video__play, .video__prev' ).on( 'click', function () {
            // создаем iframe со включенной опцией autoplay
            let wrapp = $( this ).closest( '.js-youtube' ),
                videoId = wrapp.attr( 'id' ),
                iframe_url = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&autohide=1";

            if ( $( this ).data( 'params' ) ) iframe_url += '&' + $( this ).data( 'params' );

            // Высота и ширина iframe должны быть такими же, как и у родительского блока
            let iframe = $( '<iframe/>', {
                'frameborder': '0',
                'src': iframe_url,
                'allow': "autoplay"
            } )

            // Заменяем миниатюру HTML5 плеером с YouTube
            $( this ).closest( '.video__wrapper' ).append( iframe );

        } );
    }
};

function mapInit() {
    try {
        ymaps.ready( init );
    } catch ( e ) {}

    function init() {
        let center = [ 55.76, 37.64 ];

        var myMap = new ymaps.Map( "map", {
                center: center,
                zoom: 10
            } ),

            myPlacemark = new ymaps.Placemark( center, {
                // Свойства.
                balloonContent: 'Собственный значок метки'
            }, {
                iconImageHref: 'img/map-marker.svg',
                iconImageSize: [ 39, 39 ],
                iconImageOffset: [ -15, -15 ]
            } );

        myMap.geoObjects
            .add( myPlacemark );
    }

}
mapInit();


function initRecommendSliders() {
    const slider = $( '.lkRecommend__slider:not(.slick-initialized)' ),
        sliderMob = $( '.lkRecommend__slider.slick-initialized' );

    if ( isXsWidth() ) {
        slider.slick( {
            dots: true,
            arrows: false,
        } );
    } else {
        sliderMob.slick( 'destroy' );
    }

}

function replaceCourseActionbar() {
    const bar = $( '.coursNav' );
    if ( isXsWidth() ) {
        bar.insertAfter( '.header' );
    } else {
        bar.insertAfter( '.header__left' );
    }
}

function replaceNameInCourseMessageFromMobile() {
    $('.lkCoursMessage__row').each(function(index, el) {
        let name = $(el).find('.lkCoursMessage__name'),
        left = $(el).find('.lkCoursMessage__left'),
        text = $(el).find('.lkCoursMessage__txt');

        if (isXsWidth()) {
            name.appendTo(left);
        } else {
            name.prependTo(text);
        }
    });
}

function toggleDropdownUserMenu() {
    const menu = $('.header__menu');

    $('.header__userImg').on('click', () => {
        menu.fadeToggle();
    });

    menu.on('mouseleave', () => {
        menu.fadeToggle();
    });

}

function replaceRecommendButton() {

    $( '.lkRecommend__plate' ).each( function ( i, el ) {

        if ( isXsWidth() ) {
            $( el ).find( '.btn' ).appendTo( el );

        } else {
            $( el ).find( el ).insertAfter( '.lkRecommend__buttonBox' );
        }
    } );
}


function lkCoursesProgress() {
    const progress = $( '.lkCourses__progress' );
    if ( isXsWidth() ) {
        progress.appendTo( '.lkProgress__bar' );
    } else {
        progress.appendTo( '.lkCourses__head' );
    }
}

function teachersDescriptionCollapse() {
    if (!isXsWidth()) {
        let lh = +$('.teachers__desc').css('lineHeight').replace('px', ''),
        max = +(lh * 11).toFixed();
        console.log(max);
        $('.teachers__desc').each(function(index, el) {
            let hei = $(el).innerHeight(),
            parent = $(el).parent();
            if (hei > max) {
                $(el)
                .toggleClass('collapsed')
                .css('height', max);
                parent.append('<span class="teachers__collapse">Подробнее</span>');
            }
        });

        $('body').on('click', '.teachers__collapse', function() {
            let parent = $(this).parent();
            parent.toggleClass('open');
            if (parent.hasClass('open')) {
                $(this).html('Скрыть');
            } else {
                $(this).html('Подробнее');
            }

        });
    }
}
teachersDescriptionCollapse();
//
// Деление чисел на разряды Например из строки 10000 получаем 10 000
// Использование: thousandSeparator(1000) или используем переменную.
// function thousandSeparator(str) {
//     var parts = (str + '').split('.'),
//         main = parts[0],
//         len = main.length,
//         output = '',
//         i = len - 1;

//     while(i >= 0) {
//         output = main.charAt(i) + output;
//         if ((len - i) % 3 === 0 && i > 0) {
//             output = ' ' + output;
//         }
//         --i;
//     }

//     if (parts.length > 1) {
//         output += '.' + parts[1];
//     }
//     return output;
// };


// Хак для яндекс карт втавленных через iframe
// Страуктура:
//<div class="map__wrap" id="map-wrap">
//  <iframe style="pointer-events: none;" src="https://yandex.ru/map-widget/v1/-/CBqXzGXSOB" width="1083" height="707" frameborder="0" allowfullscreen="true"></iframe>
//</div>
// Обязательное свойство в style которое и переключет скрипт
// document.addEventListener('click', function(e) {
//     var map = document.querySelector('#map-wrap iframe')
//     if(e.target.id === 'map-wrap') {
//         map.style.pointerEvents = 'all'
//     } else {
//         map.style.pointerEvents = 'none'
//     }
// })

// Простая проверка форм на заполненность и отправка аяксом
// function formSubmit() {
//     $("[type=submit]").on('click', function (e){
//         e.preventDefault();
//         var form = $(this).closest('.form');
//         var url = form.attr('action');
//         var form_data = form.serialize();
//         var field = form.find('[required]');
//         // console.log(form_data);

//         empty = 0;

//         field.each(function() {
//             if ($(this).val() == "") {
//                 $(this).addClass('invalid');
//                 // return false;
//                 empty++;
//             } else {
//                 $(this).removeClass('invalid');
//                 $(this).addClass('valid');
//             }
//         });

//         // console.log(empty);

//         if (empty > 0) {
//             return false;
//         } else {
//             $.ajax({
//                 url: url,
//                 type: "POST",
//                 dataType: "html",
//                 data: form_data,
//                 success: function (response) {
//                     // $('#success').modal('show');
//                     // console.log('success');
//                     console.log(response);
//                     // console.log(data);
//                     // document.location.href = "success.html";
//                 },
//                 error: function (response) {
//                     // $('#success').modal('show');
//                     // console.log('error');
//                     console.log(response);
//                 }
//             });
//         }

//     });

//     $('[required]').on('blur', function() {
//         if ($(this).val() != '') {
//             $(this).removeClass('invalid');
//         }
//     });

//     $('.form__privacy input').on('change', function(event) {
//         event.preventDefault();
//         var btn = $(this).closest('.form').find('.btn');
//         if ($(this).prop('checked')) {
//             btn.removeAttr('disabled');
//             // console.log('checked');
//         } else {
//             btn.attr('disabled', true);
//         }
//     });
// }


// Проверка на возможность ввода только русских букв, цифр, тире и пробелов
// $('#u_l_name').on('keypress keyup', function () {
//     var that = this;
//
//     setTimeout(function () {
//         if (that.value.match(/[ -]/) && that.value.length == 1) {
//             that.value = '';
//         }
//
//         if (that.value.match(/-+/g)) {
//             that.value = that.value.replace(/-+/g, '-');
//         }
//
//         if (that.value.match(/ +/g)) {
//             that.value = that.value.replace(/ +/g, ' ');
//         }
//
//         var res = /[^а-яА-Я -]/g.exec(that.value);
//
//         if (res) {
//             removeErrorMsg('#u_l_name');
//             $('#u_l_name').after('<div class="j-required-error b-check__errors">Измените язык ввода на русский</div>');
//         }
//         else {
//             removeErrorMsg('#u_l_name');
//         }
//
//         that.value = that.value.replace(res, '');
//     }, 0);
// });
