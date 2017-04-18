//ensure that the global variable Profile constructed after this file is loaded.
Profile = {};
(function () {

    Ext.ns('Asz.util');
    Asz.util.UserProfile = {};
    Profile = Asz.util.UserProfile;


    //private variables
    var _langData = {},
        _permission = {},
        _cookieNames = [
            'user',
            'sso',
            'lang',
            'isRememberUser',
            'debugViersion'
        ];

    Ext.apply(Profile, {
        clearAllCookies: function () {
            Ext.Array.each(_cookieNames, function (name) {
                Ext.util.Cookies.clear(name);
            });
        },

        updateVersionDate: function () {
            var curVersion = '20140212';
            var debugVersion = Ext.util.Cookies.get('debugVersion');
            if (!debugVersion || debugVersion !== curVersion) {
                Profile.clearAllCookies();
                Ext.util.Cookies.set('debugVersion', curVersion);
                window.location.reload();
            }
        },

        //TODO: cookies' expire date
        setUser: function (user) {
            //Should store encoded object instead of object it self, or you'll get only [Object object] while you're trying to get this value.
            Ext.util.Cookies.set('user', Ext.encode(user));
            //If user choose to remember his sso, this value will not be cleaned while user logging out
            Ext.util.Cookies.set('sso', user.sso);

            Profile.setLang(user.lang);
        },

        getUser: function () {
            var user = Ext.util.Cookies.get('user');
            return Ext.decode(user, true);
        },

        getUserSso: function () {
            return Ext.util.Cookies.get('sso');
        },

        getUserName: function () {
            // console.log(this.getLang());
            return Profile.getUser()['name_' + Profile.getLang()];
        },

        logOut: function () {
            Ext.util.Cookies.clear('user');
            if (!Profile.isRememberUser) {
                Ext.util.Cookies.clear('sso');
                Ext.util.Cookies.clear('lang');
            }
        },

        //if 'true', latest user's sso will shown in login window
        isRememberUser: Ext.util.Cookies.get('isRememberUser'),

        doRememberUser: function (isRemember) {
            Ext.util.Cookies.set('isRememberUser', isRemember);
        },

        setLang: function (lang) {
            Ext.util.Cookies.set('lang', lang);
        },

        //use 'en' as default language setting
        getLang: function () {
            return Ext.util.Format.lowercase(Ext.util.Cookies.get('lang') || 'cn');
        },
        //        getLang: function () {
        //            return Ext.util.Cookies.get('lang') || 'cn';
        //        },

        //after loading from server, store user language data to _langData
        setLangData: function (data) {
            _langData = data;
        },

        //return language text by objectName
        getText: function (obj) {
            return _langData[obj];
        },

        //after loading from server, store user permission mappings to _permission
        setPermission: function (permission) {
            _permission = permission;
        },

        //TODO: optimize query efficiency
        //check if the user-widget-action mapping exists in _permission object
        checkWidgetActionPermission: function (widget, action_name) {
            var valid = false;
            for (var i = 0; i < _permission.length && !valid; i++) {
                if (_permission[i].widget === widget && _permission[i].action_name === action_name) {
                    valid = true;
                }
            }
            return valid;
        },

        changeLanguage: function (lang) {
            //lang settings located in: 1. Session; 2. Cookie 'lang'; 3. Cookie 'user->lang'
            var user = Profile.getUser();
            user.lang = lang;
            Profile.setUser(user);
        }

    });





})();