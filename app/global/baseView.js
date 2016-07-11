define([
    '$',
    'resizeImages',
    'descript',
    'adaptivejs/utils',
    'adaptivejs/defaults',
    'settings',
    'global/includes/header/header-context',
    'global/includes/footer/footer-context',
    'global/includes/left-sidebar/left-sidebar-context',
    'dust!global/base',
    'text!../../static/icons/sprite.svg'
],
function($, ResizeImages, Descript, Utils, Defaults, Settings, header, footer, leftSidebar, baseTemplate, iconSprite) {
    var descript;

    /**
     * Grab the default cache breaker variable from the Mobify Config
     */
    if (ResizeImages && Settings) {
        ResizeImages.defaults.cacheBreaker = Settings.cacheBreaker;
    }

    /**
     *  Grabs the images which you would like to run through
     *  imageResizer and sends them away. Can be setup
     *  with more profiles for different types of images
     *  if needed.
     */
    var resizeImages = function() {
        var $imgs = $('img');
        var defaultOpts = {
            projectName: Defaults.projectName
        };

        ResizeImages.resize($imgs, defaultOpts);

        return $imgs;
    };

    return {
        template: baseTemplate,
        includes: {
            header: header,
            footer: footer,
            leftSidebar: leftSidebar
        },
        /**
        * preProcess receives a context as a paramater and should return
        * that context with any modifications the user needs. This runs
        * before keys in `context` are executed
        */
        preProcess: function(context) {
            // Transforms should take place here rather then within `context`.

            // An example of a DOM transform:
            $('head').find('meta[name="viewport"]').remove();
            $('style, link[rel="stylesheet"]').remove();

            // Use Descript to manipulate the desktop scripts. Please see
            // https://github.com/mobify/descript for detailed documentation.
            // descript = Descript.init();

            if (context.templateName === 'cart') {
                descript = Descript.init({
                    preserve: {
                        // Removed 'pageProduct' from below as it was causing You May Also Like under Cart to break
                        contains: ['"Stores":', '{"cookieValues":', 'if(useNonDefaultKeyboard', '{"products":', 'facet_url', '/*{"subcategories"', 'var temp_image = elem.getAttribute', 'document.write(sourceCodeMsg)']
                    }
                });
            } else {
                descript = Descript.init({
                    preserve: {
                        // Removed 'pageProduct' from below as it was causing You May Also Like under Cart to break
                        contains: ['"Stores":', '{"cookieValues":', 'if(useNonDefaultKeyboard', '{"products":', 'facet_url', '/*{"subcategories"', 'var temp_image = elem.getAttribute', '"pageProduct"', 'document.write(sourceCodeMsg)']
                    }
                });
            }


            descript.add('urgentscript', {
                src: ['jiffy.js', 'head.load.min.js', 'certonaResxUtils.js', 'eluminate.js', 'validator.js']
            });

            descript.remove({
                contains: ['className += "desktop"', 'sourceCodeMsg']
            });

            return context;
        },

        /**
        * postProcess receives a context as a paramater and should return
        * that context with any modifications the user needs. This runs
        * after keys in `context` are executed
        */
        postProcess: function(context) {
            // Transforms should take place here rather then within `context`.

            // Uncomment the following line to use Mobify's image resizer:
            // resizeImages();

            // Add the current `t-template-name` class to the body
            var $body = $('body');
            $body.last().addClass('t-' + context.templateName);

            // The desktop site outputs email fields as either type=text or type=email
            // based on what useNonDefaultKeyboard returns, so we need to override it
            // to always be true and output type=email
            window.useNonDefaultKeyboard = function() {return true;};

            return context;
        },
        context: {
            templateName: 'base',
            html: function() {
                return $('html');
            },
            head: function() {
                return $('head');
            },
            body: function() {
                return $('body');
            },
            desktopScripts: function() {
                return descript.get('default');
            },
            urgentScript: function() {
                return descript.get('urgentscript');
            },
            hiddenForm: function() {
                return $('form.hidden');
            },
            iconSprite: iconSprite,
            hiddenViewForm: function() {
                return $('#gwt_view_name').parent();
            },
            perzContentBoxg: function() {
                return $('#perzContentBoxg1, #perzContentBoxg2');
            },
            bvRatingDependency: function() {
                return $('#gwt_show_bv_rating_on_cat_page');
            },
            productInfoDependency: function() {
                return $('#gwt_product_info_panel_strings');
            },
            sourceCode: function() {
                return $('#display_source_code');
            }
        }
    };

});
