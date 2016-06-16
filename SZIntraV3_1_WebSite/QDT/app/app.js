Ext.direct.Manager.addProvider(Ext.app.REMOTING_API);

Ext.BLANK_IMAGE_URL = '../../Content/img/s.gif';
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


Ext.override(Ext.data.Connection, {
    timeout: 120000
});

//TODO: ?? how to use wildcard * loading
Ext.require([
    'Asz.util.UserProfile',
    'Asz.util.ModuleSwitcher',
     'Asz.util.Config',
    'Asz.ux.Button',
    'Asz.ux.LocalCombo',
    'Asz.ux.RemoteCombo',
    'Asz.ux.SearchCombo',
    'Asz.ux.WorkTypeCombo',
    'Asz.ux.BusinessCombo',
    'Asz.ux.EmployeeCombo',
    'Asz.ux.NativeUserCombo',
    'Asz.ux.WorkingGroupCombo',
    'Asz.ux.ItemCombo',
    'Asz.ux.SerialLotCombo',
    'Asz.ux.ItemOpGroup',
    'Asz.ux.MultipleTextFields',
    'Asz.ux.MultipleAttachments',
    'Asz.ux.ChangePasswordWindow',
    'Asz.ux.CellComponent',
    'Asz.ux.RadioGroupColumn',
    'Asz.ux.MessageBox',
    'Asz.ux.UserValidation',
    'Asz.ux.PagingToolbarResizer',
    'Asz.ux.ClearButton',
    'Asz.ux.LiveSearchGridPanel',

    'Ext.ux.data.PagingMemoryProxy',
    'Ext.ux.SlidingPager',
    'Ext.ux.PreviewPlugin',
    'Ext.ux.RowExpander',
    'Ext.ux.form.SearchField',
    'Ext.ux.statusbar.StatusBar',
    'Ext.state.*',
    'Ext.ux.statusbar.StatusBar',

    'QDT.util.Renderer',
    'QDT.util.Util',
    'QDT.ux.*',
    'Ext.chart.*'

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
        if (!Profile.getUser()) {
            Ext.create('Asz.ux.LoginWindow').show();
        } else {
            var user = Profile.getUser();
            QDT.GetPermission(function (result) {
                Profile.setPermission(result.data);
                buildApplication();
            });
        }
    };

    var showDrTips = function () {
        var view = cq.query('dr')[0].getView();

        var tip = Ext.create('Ext.tip.ToolTip', {
            // The overall target element.
            target: view.el,
            // Each grid row causes its own separate show and hide.
            delegate: view.itemSelector,
            // Moving within the row should not hide the tip.
            trackMouse: true,
            // Render immediately so that tip.body can be referenced prior to the first show.
            renderTo: Ext.getBody(),
            listeners: {
                // Change content dynamically depending on which element triggered the show.
                beforeshow: function updateTipBody(tip) {
                    var dr_num = view.getRecord(tip.triggerElement).get('dr.dr_num');
                    QDT.GetUnfinishedActionOwners(dr_num, function (result) {

                        if (result.success) {
                            var actionOwners = result.actionOwners;
                            if (actionOwners.length != 0) {
                                tip.update('未完成的action负责人: "' + actionOwners + '"');
                            } else {
                                tip.update('没有未完成的action');
                            }
                            //                            Ext.Array.each(actionOwners, function (discrepancy) {
                            //                                drDetailForm.down('[name=discrepancy_list]').insert(++index, Ext.create('Ext.form.field.Display', {
                            //                                    value: index + ',   ' + discrepancy.description
                            //                                }));
                            //                            });

                        } else {
                            My.Msg.warning(result.errorMessage);
                        }
                    });

                }
            }
        });
    }

    var buildApplication = function () {
        Ext.application({
            appFolder: '../../QDT/app',
            name: 'QDT',
            controllers: [
                'QDT.controller.repository.StaticData',
                'DR',
                'IRD',
                'QDT.controller.skill.SkillCode',
                'QDT.controller.tq.PersonSkill',
                'QDT.controller.tq.MyTraining',
                'QDT.controller.tq.CertificationBase',
                'QDT.controller.tq.MyCertification',
                'QDT.controller.tq.Main',
                'QDT.controller.tq.SkillTraining',
                'QDT.controller.tq.ProcessApproval',
                'QDT.controller.tq.SkillTrainingApprover',
                'QDT.controller.tq.CreateSkillTraining',
                'QDT.controller.tq.UpdateSkillTrainingApprover',
                'QDT.controller.tq.RequestStamper',
                'QDT.controller.ll.Category',
                'QDT.controller.op.OperationManagement',
                'QDT.controller.ll.Lesson',
                'QDT.controller.ll.Main',
                'QDT.controller.ll.Training',
                'QDT.controller.ll.WorkingGroup',
                'QDT.controller.rig.RIG',
                'QDT.controller.rig.VendorManagement',
                'QDT.controller.cc.Cc',
                'QDT.controller.permission.PermissionManagement',
                'QDT.controller.tq.ScrappedRecord'
            ],

            splashscreen: {},

            init: function () {
                splashscreen = Ext.getBody().mask('loading application', '');
            },
            launch: function () {

                //to fix a bug of tooltip in ExtJS 4.2
                delete Ext.tip.Tip.prototype.minWidth;
                Ext.QuickTips.init();

                Ext.state.Manager.setProvider(new Ext.state.CookieProvider());



                var page = Ext.create('Ext.container.Viewport', {
                    layout: 'border',
                    split: true,
                    items: [{
                        region: 'north',
                        items: [{
                            xtype: 'toolbar',
                            border: true,
                            items: [{
                                xtype: 'tbtext',
                                text: 'GE Aviation',
                                style: {
                                    'font-weight': 'bold'
                                }
                            }, {
                                xtype: 'tbtext',
                                text: 'We invent the future of flight, lift people up and bring them home safely.'
                            }, '->', {
                                xtype: 'splitbutton',
                                text: Profile.getText('SwitchLanguage'),
                                iconCls: Profile.getLang() === 'cn' ? 'china_flag' : 'usa_flag',
                                menu: {
                                    items: [{
                                        text: 'English',
                                        iconCls: 'usa_flag',
                                        handler: function () {
                                            Profile.changeLanguage('en');
                                            window.location.reload();
                                        }
                                    }, {
                                        text: 'Chinese',
                                        iconCls: 'china_flag',
                                        handler: function () {
                                            Profile.changeLanguage('cn');
                                            window.location.reload();
                                        }
                                    }]
                                }
                            }, {
                                text: Profile.getText('ChangePassword'),
                                iconCls: 'keys',
                                handler: function () {
                                    var changePasswordWindow = Ext.create('Asz.ux.ChangePasswordWindow');
                                    changePasswordWindow.show();
                                }
                            }, '-', {
                                xtype: 'tbtext',
                                text: Profile.getText('Welcome') + ', ' + Profile.getUserName()
                            }, {
                                text: Profile.getText('LogOut'),
                                iconCls: 'logout',
                                handler: function () {
                                    QDT.UserLogout(function (result) {
                                        if (result.success) {
                                            Profile.logOut();
                                            window.location.reload();
                                        } else {
                                            Ext.Msg.alert(Profile.getText('Error'), result.errorMessage);
                                        }
                                    });

                                }
                            }]
                        }]
                    }, {
                        region: 'west', //menu
                        xtype: 'panel',
                        split: true,
                        title: Profile.getText('Menu'),
                        width: 190,
                        collapsible: true,
                        collapsed: false,
                        layout: 'fit',
                        items: [{
                            xtype: 'treepanel',
                            rootVisible: false,
                            useArrows: true,
                            store: Ext.create('Ext.data.TreeStore', {
                                root: { expanded: true },
                                fields: [
                                    'iconCls',
                                    'id',
                                    'text',
                                    'componentAlias',
                                    'expanded',
                                    'leaf'
                                ],
                                proxy: {
                                    type: 'direct',
                                    directFn: 'QDT.GetTreeMenu',
                                    paramOrder: ['node', 'usersso']
                                },
                                listeners: {
                                    beforeload: function () {

                                    }
                                }
                            }),
                            listeners: {
                                itemclick: onItemClick
                            }

                        }]
                    }, {
                        id: 'center',
                        region: 'center',
                        xtype: 'panel',
                        border: false,
                        layout: 'fit'
                    }]
                });

                var switcher = Ext.create('Asz.util.ModuleSwitcher');
                //                switcher.show('dr', InsertCard);
                //                showDrTips();

                page.doLayout(); // without doLayout, can not see the north part after publish

                //replace current component in center panel with new component
                function InsertCard(cmp, containter_id) {

                    var container = Ext.getCmp('center');
                    container.removeAll(true);

                    container.add(cmp);
                    container.doLayout();



                }


                //tree menu click event.
                function onItemClick(me, record, item, index) {
                    var id = record.data.id,
                        widgetName = record.get('componentAlias') || '';
                    if (!Ext.isDefined(id)) {
                        return false;
                    }
                    if (widgetName.length > 0) {

                        var module = Ext.create(widgetName);


                        InsertCard(module);

                        if (id == 'dr') {

                            showDrTips();

                        }
                    }
                    //                    var switcher = Ext.create('Asz.util.ModuleSwitcher');
                    //                    switch (id) {
                    //                        case 'dr':
                    //                            //  alert('aa');
                    //                            //   console.log('aa');

                    //                            switcher.show('dr', InsertCard);
                    //                            showDrTips();

                    //                            break;
                    //                        case 2:
                    //                            break;
                    //                        case 'ird':
                    //                            //   alert('bb');
                    //                            //    console.log('bb');
                    //                            switcher.show('ird', InsertCard)
                    //                            break;
                    //                        case 'complaint':
                    //                            //  o.showCC();
                    //                            break;
                    //                        case 'tq':
                    //                            //  o.showTQ();
                    //                            break;
                    //                        case 'lessons':
                    //                            //   o.showLL();
                    //                            break;
                    //                        case 'scan':
                    //                            window.open('http://' + window.location.host + '/Scan/Index');
                    //                            break;
                    //                        case 'admin':
                    //                            //   o.showAdmin();
                    //                            break;
                    //                    }
                }

                Ext.getBody().unmask();
            }
        });
    };



});






