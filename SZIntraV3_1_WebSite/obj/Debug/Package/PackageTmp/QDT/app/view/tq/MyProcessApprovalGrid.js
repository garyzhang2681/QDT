Ext.define('QDT.view.tq.MyProcessApprovalGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.tq-myprocessapprovalgrid',
    requires: [
        'QDT.store.tq.MyProcessApprovals',
        'QDT.ux.attachment.ShowButton',
        'Ext.window.MessageBox'
    ],

    initComponent: function () {
        var me = this,
            store = Ext.create('QDT.store.tq.MyProcessApprovals');

        Ext.apply(me, {
            tbar: [
                {
                    xtype: 'attachmentbutton',
                    iconCls: 'attachment',
                    itemId: 'view-attachment',
                    text: Profile.getText('attachment'),
                    rootCt: me,
                    viewerMode: true,
                    generateId: false,
                    disabled: false,
                    refType: 'process'
                }
            ],
            store: store,
            columns: [
                {
                    dataIndex: 'certification_item',
                    text: Profile.getText('certification_item'),
                    width: 120
                }, {
                    dataIndex: 'category',
                    text: Profile.getText('category'),
                    renderer: QDT.util.Renderer.workflowCategory,
                    minWidth: 90,
                    width: 90
                }, {
                    dataIndex: 'business',
                    text: Profile.getText('business'),
                    renderer: QDT.util.Renderer.business,
                    minWidth: 100,
                    flex: 2
                }, {
                    dataIndex: 'requestor',
                    text: Profile.getText('requestor'),
                    renderer: QDT.util.Renderer.username,
                    width: 80
                }, {
                    dataIndex: 'request_for',
                    text: Profile.getText('request_for'),
                    renderer: QDT.util.Renderer.employeeName,
                    width: 80
                }, {
                    dataIndex: 'start_time',
                    text: Profile.getText('start_time'),
                    renderer: QDT.util.Renderer.dateRenderer,
                    width: 80
                }, {
                    dataIndex: 'due_date',
                    text: Profile.getText('due_date'),
                    renderer: QDT.util.Renderer.dateRenderer,
                    width: 80
                }, {
                    dataIndex: 'current_process',
                    text: Profile.getText('current_process'),
                    width: 200,
                    minWidth: 150,
                    flex: 4
                }, {
                    dataIndex: 'process_start_time',
                    text: Profile.getText('process_start_time'),
                    renderer: QDT.util.Renderer.dateTimeRenderer,
                    width: 80
                }, {
                    xtype: 'actioncolumn',
                    width: 70,
                    items: [
                        {
                            iconCls: 'approve',
                            handler: function (view, rowIndex, colIndex, item, e, record, row) {

                                DpTq.HasUnfinishedRecord(record.data.current_process_id, function (result) {
                                    if (result.success) {
                                        if (result.hasUnfinishedRecord) {
                                            My.Msg.alert(Profile.getText('Error'), '员工还有没结束的扫描，请结束后再批准！');
                                        } else {
                                            QDT.util.Util.prompt(Profile.getText('txtYouCanAttachAComment'), function (btn, text) {
                                                if (btn === 'ok') {
                                                    DpTq.ApproveProcess(record.data.current_process_id, text, function (result) {
                                                        if (result.success) {
                                                            store.load();
                                                        } else {
                                                            Ext.Msg.alert(Profile.getText('Error'), result.errorMessage);
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    } else {
                                        My.Msg.alert(Profile.getText('Error'), '执行错误！');
                                    }
                                });


                            }
                        }, {
                            iconCls: 'backward',
                            handler: function (view, rowIndex, colIndex, item, e, record, row) {
                                QDT.util.Util.prompt(Profile.getText('txtYouCanAttachAComment'), function (btn, text) {
                                    if (btn === 'ok') {
                                        DpTq.SendBackProcess(record.data.current_process_id, text, function (result) {
                                            if (result.success) {
                                                store.load();
                                            } else {
                                                QDT.util.Util.showErrorMessage(result.errorMessage);
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    ]
                },
                {
                    text: Profile.getText('attachment'),
                    xtype: 'componentcolumn',

                    renderer: function (record) {
                        return {
                            iconCls: 'attachment',
                            itemId: 'view-attachment-single',
                            xtype: 'attachmentbutton',
                            text: Profile.getText('attachment'),
                            tooltip: Profile.getText('txtViewAttachment'),
                            refType: 'request',
                            rootCt: me,
                            generateId: false

                        }


                    }
                }
            ]
        });


        me.callParent();
    }
});