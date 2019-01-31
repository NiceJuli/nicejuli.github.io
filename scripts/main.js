var Site = Site || {};

if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {
            },
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                        ? this
                        : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

$(document).ready(function () {

    $('input[name="phone"]').mask('+7 (999) 999 99 99');

    function parseUrl(url) {
        var a = document.createElement('a');
        a.href = url;
        return a;
    }

// scrolled menu

    var lastId,
        topMenu = $("#top-menu"),
        topMenuHeight = topMenu.outerHeight() + 40,
        menuItems = topMenu.find("a"),
        scrollTop,
        scrollItems = menuItems.map(function () {
            var item = $(parseUrl($(this).attr("href")).hash);
            if (item.length) {
                return item;
            }
        });

    menuItems.click(function (e) {
        var href = parseUrl($(this).attr("href")).hash,
            hrefElement = $(href),
            offsetTop = hrefElement.length ? $(href).offset().top : 0;
        if (hrefElement.length) {
            e.preventDefault();
        }
        $('html, body').stop().animate({
            scrollTop: offsetTop - topMenuHeight + 1
        }, 300);

    });



    $(window).scroll(function () {
        var windowTop = $(window).scrollTop(),
            element = $('#topmenu');
        if (windowTop >= 1) {
            element.addClass('header_fix');
        }
        else {
            element.removeClass('header_fix');
        }

            var fromTop = $(this).scrollTop() + topMenuHeight;
            var cur = scrollItems.map(function () {
                if ($(this).offset().top < fromTop)
                    return this;
            });
            cur = cur[cur.length - 1];
            var id = cur && cur.length ? cur[0].id : "";

            if (lastId !== id) {
                lastId = id;
                menuItems.parent().removeClass("active");
                $("[href*=\\#" + id + "]", topMenu).parent().addClass("active");
            }
    });

//anchors menu

    $(function () {
        $('.anchor').on('click', function (e) {
            var anchor = parseUrl($(this).attr("href")).hash,
                anchorElement = $(anchor);
            if (anchorElement.length) {
                e.preventDefault();
                if (screen.width < 1001) {
                    topMenuHeight = 0;
                } else {
                    topMenuHeight = topMenu.outerHeight() + 40
                }
                $('html,body').stop().animate({scrollTop: anchorElement.offset().top - topMenuHeight + 1}, 'slow');
            }
        });
    });

// hamburger

    $('.hamburger, .menu-mobile').click(function(e){
        $('.hamburger').toggleClass('hamburger_opened');
        $('.menu-mobile').toggleClass('menu-mobile_opened');
    });
    
    function clear_form() {
        $("input[type='text'], input[type='tel']").val("");
        $("textarea").val("");
    }

    Site.clearForm = clear_form;

    $('input[name="phone"]').blur(function () {
        var phone = $(this).val();
        var index = phone.indexOf('_');
        if (phone.length >= 6 && index == -1) {
            $(this).removeClass('error');
        }
        else if (phone == 0) {
            $(this).removeClass('error');
        }
        else {
            $(this).addClass('error');
        }
    });

    $('.formSubmit').submit(function () {
        var name = $(this).find('input[name="name"]').val();
        var phone = $(this).find('input[name="phone"]').val();
        var question = $(this).find('textarea').val();
        var index = phone.indexOf('_');
        var indexstring = phone.indexOf('е');
        if (phone.length >= 6 && index == -1 && indexstring == -1) {
            console.log(name, phone, question);
            clear_form();
            $.ajax({
                type: "POST",
                url: "/phpmailer/mail.php",
                data: {
                    "name": name,
                    "phone": phone,
                    "question": question
                },
                success: function () {
                    window.location.href = '/thanks';
                }
            });
        }
        else {
            $(this).find('input[name="phone"]').addClass('error');

        }
        return false;
    });

    function validatePhone(item) {

        var phone = item.val();
        var number = phone.substr(phone.indexOf("(")+1, 1);

        if(number == 8 || number == 7) {
            var oldNumber;
            if (number == 8) {
                oldNumber = '(8';
            } else if (number == 7) {
                oldNumber = '(7';
            }

            item.val(phone.replace(oldNumber, '('));
            item.trigger('paste')

        }
    }


    $('input[name="phone"]').keyup(function () {
        var $this = $(this);
        validatePhone($this)
    });

    $('.service__name').click(function (event) {
        $(this).toggleClass("active");
        var parent = $(this).parent(".service__item");
        parent.children(".service__body").slideToggle();
        event.stopPropagation();
    });

});