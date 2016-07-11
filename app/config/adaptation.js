/**
 * RequireJS paths for the adaptive bundle
 */

require.config({
    'baseUrl': '.',
    'keepBuildDir': true,
    'paths': {
        'buildConfig': '../build/buildConfig',
        'translator': 'global/i18n/translator',
        'includes': 'global/includes/',
        'libs': 'bower_components',
        'package': '../package.json',
        'resizeImages': 'bower_components/imageresize/resizeImages',
        'descript': 'bower_components/descript/dist/descript',
        'baseSelectorLibrary': 'vendor/jquery',
        'svg-icon': 'components/icon/icon'
    },
    'shim': {
        'baseSelectorLibrary': {
            'exports': 'jQuery'
        }
    }
});
