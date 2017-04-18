Ext.define('QDT.controller.tq.RequestStamper', {
    extend: 'Ext.app.Controller',
    views: [
        'QDT.view.tq.RequestStamperPanel',
        'QDT.ux.attachment.Browser',
        'QDT.view.tq.RequestStamperMain',
        'QDT.view.tq.StamperList',
        'QDT.view.tq.DeleteStamper'
    ],
    refs: [
        {
            ref: 'requestStamperPanel',
            selector: 'tq-requeststamperpanel'
        },
        {
            ref: 'list',
            selector: 'tq-stamperlist'

        },
        {
            ref: 'DeleteStamper',
            selector: 'tq-deletestamper'

        }
    ],
    stores: ['QDT.store.tq.StamperLists'],

    init: function () {
        var me = this;

        me.control({
            'tq-stamperlist': {
                afterrender: function (cmp) {

                    cmp.store.load();

                },

                selectionchange: function (cmp, selected) {

                    if (selected.length == 1) {
                        var requestId = selected[0].data['request_id'];

                        var requestor = selected[0].data['requestor'];

                        DpTq.GetRefNum(requestId, function(result) {

                            var rowid = Ext.getStore('QDT.store.tq.StamperLists').find('request_id', requestId);

                            cq.query('tq-stamperlist #view-attachment')[rowid].refNum = result.data[0];

                            var currentUserId = Profile.getUser().user_id;

                            if (!(((currentUserId - 173) == 0) || ((currentUserId - 396) == 0) || ((currentUserId - 50) == 0) || ((currentUserId - 49) == 0) || (currentUserId - requestor == 0))) {

                       

                                cq.query('tq-stamperlist #delete')[0].setDisabled(true);

                                cq.query('tq-stamperlist #view-attachment')[rowid].viewerMode = true;
                            }

                        });
                    }

                }

            },
            'tq-stamperlist #clear': {
                click: me.onClearClick,

                scope: me


            },
            'tq-stamperlist #search': {
                click: me.onSearchClick,

                scope: me


            },
            'tq-stamperlist #add': {
                click: me.onAddClick,
                scope: me

            },
            'tq-stamperlist #delete': {
                click: me.onDeleteClick,
                scope: me

            },


            'tq-requeststamperpanel #request_for': {
                select: function (combo, selected) {
                    var record,
                        form = me.getRequestStamperPanel();
                    if (selected.length > 0) {
                        record = selected[0];
                        form.getForm().setValues({
                            sso: record.data.sso,
                            hire_date: record.data.hire_date
                        });
                    }
                }
            },

            'tq-requeststamperpanel #submit': {
                click: function () {
                    var panel = me.getRequestStamperPanel();
                    panel.getForm().submit({
                        success: function (form, action) {
                            //                            var requestId = action.result.data,
                            //                                button = panel.down('#view-attachment');
                            //                            button.setRefNum(requestId);
                            QDT.util.Util.generalCallbackCRUD({ success: true }, 'c');

                            cq.query('tq-stamperlist')[0].store.reload();

                            panel.up('window').close();
                        },
                        failure: function (from, action) {
                            QDT.util.Util.showErrorMessage(Profile.getText(action.result.errorMessage));
                        }
                    });

                }
            },
            'tq-deletestamper #submit': {
                click: function () {

                    var panel = me.getDeleteStamper();
                    panel.getForm().submit({
                        success: function (form, action) {

                            QDT.util.Util.generalCallbackCRUD({ success: true }, 'd');
                            cq.query('tq-stamperlist')[0].store.reload();
                            panel.up('window').close();

                        },
                        failure: function (from, action) {
                            QDT.util.Util.showErrorMessage(Profile.getText(action.result.errorMessage));
                        }


                    });


                }


            }


        });


    },
    onClearClick: function () {
        var me = this;
        var list = me.getList();
        list.down('#search_stamper').getForm().reset();

        list.down('#search_stamper').down('#status').setValue('');


    },
    onSearchClick: function () {

        var me = this;
        var list = me.getList();


        list.getStore().load(
            {
                waitMsg: '查询中...请稍候',
                params: {
                    search_conditions: list.down('#search_stamper').getForm().getValues()
                },
                callback: function (records, operation, success) {
                    if (!success) {
                        My.Msg.warning('请确认输入是否正确！');
                    }
                }


            }
        );


    },
    onAddClick: function () {
        var win = Ext.create('Ext.window.Window', {
            layout: {
                type: 'fit'
            },
            width: 871,
            height: 382,

            items: [
                {
                    xtype: 'tq-requeststamperpanel',
                    title: Profile.getText('workflowCategory_stamper')


                }
            ]
        });
        win.show();

    },

    onDeleteClick: function () {
        var me = this,
        employeeId = me.getList().selModel.getSelection()[0].data.employee_id;
        My.Msg.question('attention', '确定要删除' + QDT.util.Renderer.employeeName(employeeId) + '的印章吗？', function (btn, text) {
            if (btn == 'yes') {
                DpTq.DeleteStamper(employeeId, function (result) {
                    if (result.success) {
                        My.Msg.alert('message', 'Delete ' + QDT.util.Renderer.employeeName(employeeId) + '\' Stamper ' + ' Successfully!');
                    } else {
                        My.Msg.warning('Delete ' + QDT.util.Renderer.employeeName(employeeId) + '\' Stamper ' + ' Failed!');
                    }
                    me.getList().getStore().load();
                });
            } else {
            }
        });
        //        var win = Ext.create('Ext.window.Window', {
        //            layout: {
        //                type: 'fit'
        //            },
        //            items: [{
        //                xtype: 'tq-deletestamper',
        //                title: Profile.getText('Delete')

        //            }]
        //        });
        //        win.show();
    }

});