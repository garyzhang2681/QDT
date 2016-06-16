/// <reference path="../../extjs/ext-all.js" />


//usage: cq.query('xtype')[0]
cq = Ext.ComponentQuery;



Ext.onReady(function () {
    Ext.Loader.setConfig({
        enabled: true,
          paths: {
            'Ext.ux': '../../extjs/src/ux',
            'Asz.util': '../../Content/js/extjs/util',
            'Asz.ux': '../../Content/js/extjs/ux',
            'QDT.util': '../../QDT/app/util',
            'QDT': '../../QDT/app',
            'Asz': '../../Content/js/extjs'
        }
    });

    Ext.require([
            'Asz.util.Config',
            'Asz.util.UserProfile',
            'Asz.ux.Button',
            'Asz.ux.LocalCombo',
            'Asz.ux.RemoteCombo',
            'Asz.ux.SearchCombo',
            'Asz.ux.BusinessCombo',
            'Asz.ux.EmployeeCombo',
            'Asz.ux.ChangePasswordWindow',
            'Asz.ux.MessageBox',
            'Asz.ux.ExceptionBoard',
            'Asz.ux.ClearButton',
            'Asz.ux.MultipleAttachments',
            'Ext.ux.data.PagingMemoryProxy',
            'Ext.ux.SlidingPager',
            'Ext.ux.PreviewPlugin',
            'Ext.ux.RowExpander',
            'Ext.ux.form.SearchField',
            'Ext.state.*',
            'QDT.util.Renderer',
            'QDT.util.Util',
            'QDT.ux.*'
        ]);


    Ext.application({
        appFolder: '../../QDT/app',
        name: 'QDT',
     
        controllers: [
        'repository.StaticData',
        'll.Main',
        'll.Category',
        'll.Lesson',
        'll.Training'
    ],
        launch: function () {


            //URL to a 1x1 transparent gif image used by Ext to create inline icons with CSS background images. In older versions of IE, this defaults to "http://sencha.com/s.gif" and you should change this to a URL on your server. For other browsers it uses an inline data URL.
            Ext.BLANK_IMAGE_URL = '../../Content/img/s.gif';

            // setup the state provider, all state information will be saved to a cookie
            Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));

            Ext.app.REMOTING_API.timeout = 300000;

            //Ext.app.REMOTING_API is provided by js ~/Direct/Api of Direct.Mvc
            Ext.direct.Manager.addProvider(Ext.app.REMOTING_API);

            Ext.direct.Manager.on('exception', function (event) {
                Ext.widget('exceptionboard', {
                    exceptionEvent: event
                });
            });
            //to fix a bugg of tooltip in ExtJS 4.2
            delete Ext.tip.Tip.prototype.minWidth;
            Ext.QuickTips.init();


            Profile.updateVersionDate();

            //count of requests that should be completed before launchApplication method is called
            var PENDING_REQUEST = 1;

            //load language data from server
            QDT.GetLangData(function (result) {
                if (result.success) {
                    Profile.setLangData(result.data);
                    launchReady();
                } else {
                    Ext.Msg.alert('Error', 'System Failed Loading Language Data');
                }
            });

            var launchReady = function () {
                PENDING_REQUEST -= 1;
                if (PENDING_REQUEST === 0) {
                    launchApplication();
                }
            };

            var launchApplication = function () {
                Ext.widget('ll-viewport');
            };


        }
    });

});


