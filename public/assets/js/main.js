/* ============ Main JS ============ */

(function ($) {
    "use strict";

    var windowOn = $(window);

    // 01. PreLoader Js
    $(window).on("load", function (event) {
        $(".preloader").delay(500).fadeOut(500);
    });
    $(document).ready(function() {

        var header = $(".header"),
            stickyHeader = $(".primary-header");

        function menuSticky(w) {
            if (w.matches) {
                
                $(window).on("scroll", function () {
                    var scroll = $(window).scrollTop();
                    if (scroll >= 110) {
                        stickyHeader.addClass("fixed");
                    } else {
                        stickyHeader.removeClass("fixed");
                    }
                });
                if ($(".header").length > 0) {    
                    var  headerHeight = document.querySelector(".header"),
                        setHeaderHeight = headerHeight.offsetHeight;	
                    header.each(function () {
                        $(this).css({
                            'height' : setHeaderHeight + 'px'
                        });
                    });
                }
            }
        }

        var minWidth = window.matchMedia("(min-width: 992px)");
        if (header.hasClass("sticky-active")) {
            menuSticky(minWidth);
        }

        //Mobile Menu Js
        $(".mobile-menu-items").meanmenu({
            meanMenuContainer: ".side-menu-wrap",
            meanScreenWidth: "991",
            meanMenuCloseSize: "30px",
            meanRemoveAttrs: true,
            meanExpand: ['<i class="fa-solid fa-caret-down"></i>'],
        });

        // Mobile Sidemenu
        $(".mobile-side-menu-toggle").on("click", function () {
            $(".mobile-side-menu, .mobile-side-menu-overlay").toggleClass("is-open");
        });

        $(".mobile-side-menu-close, .mobile-side-menu-overlay").on("click", function () {
            $(".mobile-side-menu, .mobile-side-menu-overlay").removeClass("is-open");
        });

        // Popup Search Box
        $(function () {
            $("#popup-search-box").removeClass("toggled");

            $(".dl-search-icon").on("click", function (e) {
                e.stopPropagation();
                $("#popup-search-box").toggleClass("toggled");
                $("#popup-search").focus();
            });

            $("#popup-search-box input").on("click", function (e) {
                e.stopPropagation();
            });

            $("#popup-search-box, body").on("click", function () {
                $("#popup-search-box").removeClass("toggled");
            });
        });

        // Popup Sidebox
        function sideBox() {
            $("body").removeClass("open-sidebar");
            $(document).on("click", ".sidebar-trigger", function (e) {
                e.preventDefault();
                $("body").toggleClass("open-sidebar");
            });
            $(document).on("click", ".sidebar-trigger.close, #sidebar-overlay", function (e) {
                e.preventDefault();
                $("body.open-sidebar").removeClass("open-sidebar");
            });
        }

        sideBox();

        // Venobox Video
        new VenoBox({
            selector: ".video-popup, .img-popup",
            bgcolor: "transparent",
            numeration: true,
            infinigall: true,
            spinner: "plane",
        });

        // Data Background
        $("[data-background").each(function () {
            $(this).css("background-image", "url( " + $(this).attr("data-background") + "  )");
        });

        /* Odometer */
        $(".odometer").waypoint(
            function () {
                var odo = $(".odometer");
                odo.each(function () {
                    var countNumber = $(this).attr("data-count");
                    $(this).html(countNumber);
                });
            },
            {
                offset: "80%",
                triggerOnce: true,
            }
        );

        // Wow JS Active
        new WOW().init();

        // Nice Select Js
        $("select").niceSelect();

        //Pie Chart
        $('.piechart').waypoint(
            function () {
                $('.piechart').easyPieChart({
                    scaleColor: "transparent",
                    lineWidth: 5,
                    lineCap: 'round',
                    trackColor: "#ddd",
                    size: 110,
                    rotate: 0,
                    animate: 1000,
                    onStep: function (value) {
                        this.$el.find('span').text(Math.round(value));
                    },
                    onStop: function (value, to) {
                        this.$el.find('span').text(Math.round(to));
                    }
                });
            }, {
                offset: "80%",
                triggerOnce: true
            }
        );

        // Custom Cursor
        $("body").append('<div class="mt-cursor"></div>');
        var cursor = $(".mt-cursor"),
            linksCursor = $("a, .swiper-nav, button, .cursor-effect"),
            crossCursor = $(".cross-cursor");

        $(window).on("mousemove", function (e) {
            cursor.css({
                transform: "translate(" + (e.clientX - 15) + "px," + (e.clientY - 15) + "px)",
                visibility: "inherit",
            });
        });

        // Isotope
        $(".filter-items").imagesLoaded(function () {
            // Add isotope click function
            $(".project-filter-list .filter-item").on("click", function () {
                $(".project-filter-list .filter-item").removeClass("active");
                $(this).addClass("active");

                var selector = $(this).attr("data-filter");
                $(".filter-items").isotope({
                    filter: selector,
                    animationOptions: {
                        duration: 750,
                        easing: "linear",
                        queue: false,
                    },
                });
                return false;
            });

            $(".filter-items").isotope({
                itemSelector: ".single-item",
                percentPosition: true,
            });
        });

        // Price range slider
        var priceRange = $("#price-range"),
            priceOutput = $("#price-output span");
            priceOutput.html(priceRange.val());
            priceRange.on("change input", function () {
            priceOutput.html($(this).val());
        });

        // Sponsor Carousel
        var swiperSponsor = new Swiper(".sponsor-carousel", {
            slidesPerView: 45,
            spaceBetween: 50,
            slidesPerGroup: 1,
            loop: true,
            autoplay: true,
            grabCursor: true,
            speed: 400,
            breakpoints: {
                320: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                    spaceBetween: 25,
                },
                767: {
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 5,
                    slidesPerGroup: 1,
                },
            },
        });

        // Project Carousel
        var swiperProject = new Swiper(".project-carousel", {
            slidesPerView: 3,
            spaceBetween: 25,
            slidesPerGroup: 1,
            loop: true,
            autoplay: true,
            grabCursor: true,
            centeredSlides: true,
            centeredSlidesBounds: true,
            speed: 600,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".project-section .swiper-prev",
                prevEl: ".project-section .swiper-next",
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 25,
                },
                767: {
                    slidesPerView: 2,
                    slidesPerGroup: 1,
                    spaceBetween: 30,
                },
                1024: {
                    slidesPerView: 3,
                    slidesPerGroup: 1,
                },
            },
        });

        // Testi Carousel
        var swiperTesti = new Swiper(".testi-carousel", {
            slidesPerView: 1,
            spaceBetween: 25,
            loop: true,
            autoplay: true,
            speed: 600,
            grabCursor: true,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            }
        });

        // Gallary Carousel
        var swiperProject = new Swiper(".gallary-carousel", {
            slidesPerView: 1,
            spaceBetween: 30,
            slidesPerGroup: 1,
            loop: true,
            autoplay: true,
            grabCursor: true,
            speed: 800,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
        });

        // Scroll To Top
        var scrollTop = $("#scrollup");
        $(window).on('scroll', function() {
            var topPos = $(this).scrollTop();
            if (topPos > 100) {
                $('#scrollup').removeClass('hide');
                $('#scrollup').addClass('show');

            } else {
                $('#scrollup').removeClass('show');
                $('#scrollup').addClass('hide');
            }
        });

        $(scrollTop).on("click", function() {
            $('html, body').animate({
                scrollTop: 0
            },0);
            return false;
        });

    });

})(jQuery);
