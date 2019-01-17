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
                $('html,body').stop().animate({scrollTop: anchorElement.offset().top - topMenuHeight + 1}, 'slow');
            }
        });
    });

// hamburger

    $('.hamburger, .drop-down').click(function(e){
        $('.hamburger').toggleClass('round');
        $('.drop-down').toggleClass('down');
    });
    
    function clear_form() {
        $("input[type='text'], input[type='tel']").val("");
        $("textarea").val("");
    }
    Site.clearForm = clear_form;

    var emailCount = 0;

    function email_validate(x) {
        var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
        if (pattern.test(x.val())) {
            x.removeClass('error');
            emailCount = 0;
        }
        else if (x.val() == 0) {
            x.removeClass('error');
            emailCount = 0;
        }
        else {
            x.addClass('error');
            emailCount = 1;
        }
        console.log(emailCount);
    };

    $('input[name="email"]').blur(function () {
        email_validate($(this));
    });

    $('input[name="email"]').keypress(function (e) {
        if (e.keyCode == 13) {
            email_validate($(this));
        }
    });

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
        var order = $(this).find('input[name="order"]').val();
        var name = $(this).find('input[name="name"]').val();
        var phone = $(this).find('input[name="phone"]').val();
        var index = phone.indexOf('_');
        var indexstring = phone.indexOf('е');
        var email = $(this).find('input[name="email"]').val();
        var formName = $(this).find('input[name="hidden"]').val();
        var comment1 = $(this).find('textarea[name="comment"]').val();
        var comment2 = $(this).find('input[name="comment"]').val();
        var certificate = $(this).find('select[name="certificate"]').find(':selected').html();
        if (phone.length >= 6 && index == -1 && emailCount == 0 && indexstring == -1) {
            $.ajax({
                type: "POST",
                url: "/phpmailer/mail.php",
                data: {
                    "name": name,
                    "phone": phone,
                    "email": email,
                    "comment1": comment1,
                    "comment2": comment2,
                    "certificate": certificate,
                    "formName": formName
                },
                success: function () {
                    /*  clear_form();
                     $('.modal').fadeOut();
                     if (order == 1) {
                     opening($('#modalThanksOrder'));
                     }
                     else if (order == 'cert') {
                     opening($('#modalThanksLetter'));
                     }
                     else {
                     opening($('#modalThanks'));
                     }
                     $('input[name="name"], input[name="phone"]').removeClass('error');*/
                    yaCounter33205628.reachGoal("order");
                    window.location.href = '/thanks2';
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


    $('#requestPhone').keyup(function () {
        var $this = $(this);
        validatePhone($this)
    });

    $('.service__name').click(function (event) {
        $(".service__body").hide();
        $(this).toggleClass("active");
        var parent = $(this).parent(".service__item");
        parent.children(".service__body").slideToggle();
        event.stopPropagation();
    });

});