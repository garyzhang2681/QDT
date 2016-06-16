/// <reference path="../../extjs/ext-all.js" />

Ext.direct.Manager.addProvider(Ext.app.REMOTING_API);

Ext.BLANK_IMAGE_URL = '../../Content/img/s.gif';

Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext.ux': '../../extjs/src/ux',
        'Asz': '../../Content/js/extjs',
        'QDT': '../../QDT/app'
    }
});

Ext.require([
    'Asz.util.UserProfile',
    'Asz.ux.Button',
    'Asz.ux.LocalCombo',
    'Asz.ux.RemoteCombo',
    'Asz.ux.SearchCombo',
    'Asz.ux.EmployeeCombo',
    'Asz.ux.ChangePasswordWindow',
    'Asz.ux.MessageBox',
    'Ext.ux.data.PagingMemoryProxy',
    'Ext.ux.SlidingPager',
    'Ext.ux.PreviewPlugin',
    'Ext.ux.RowExpander',
    'Ext.ux.form.SearchField',
    'Ext.tab.Panel',
    'Ext.tab.Tab',
    'Ext.grid.Panel',
    'Ext.grid.column.Number',
    'Ext.grid.column.Date',
    'Ext.grid.column.Boolean',
    'Ext.grid.View',
    'Ext.form.Panel',
    'Ext.form.FieldSet',
    'Ext.form.field.Display',
    'Ext.form.field.ComboBox',
    'Ext.toolbar.Toolbar',
    'QDT.util.Util',
    'QDT.util.Renderer'

]);



//count of requests that should be completed before launchApplication method is called
var PENDING_REQUEST = 1;

//usage: cq.query('xtype')[0]
var cq = Ext.ComponentQuery;


//wait until all required files and dom ready
Ext.onReady(function () {

    Profile.updateVersionDate();

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
        buildApplication();
    };

    var buildApplication = function () {

        Ext.application({
            appFolder: '../../QDT/app',
            name: 'QDT',
            controllers: [
                'QDT.controller.repository.StaticData',
                'QDT.controller.scan.Main',
                'QDT.controller.tq.ProcessScan'
            ],
            launch: function () {

                //to fix a bug of tooltip in ExtJS 4.2
                delete Ext.tip.Tip.prototype.minWidth;
                Ext.QuickTips.init();


                //                var page = Ext.create('Ext.container.Viewport', {
                //                    renderTo: Ext.getBody(),
                //                    layout: 'fit',
                //                    items: [{
                //                      
                //                        xtype: 'scan_main'
                //                       
                //                    }]
                //                });
                //                page.doLayout(); // without doLayout, can not see the north part after publish

                var page = Ext.widget('scan-mainpanel');

                //TODO: add to utility, to page redirection
                var getUrl = function (config) {

                    //                    if (config.host) { 
                    //                    
                    //                    }
                    //                    return window.location
                }

                Ext.create('Ext.toolbar.Toolbar', {
                    renderTo: Ext.getBody(),
                    items: [
                        {
                            iconCls: 'link',
                            text: Profile.getText('QualityDigitalizationTools'),
                            href: 'http://' + window.location.host + '/'
                        },
                        {
                            iconCls: 'link',
                            text: Profile.getText('InspectionSystem'),
                            href: 'http://' + window.location.host + '/Inspection/Index'
                        }
                    ]
                });

            }
        });
    };
});


