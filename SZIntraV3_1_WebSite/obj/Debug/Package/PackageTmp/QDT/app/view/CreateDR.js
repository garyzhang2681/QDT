
Ext.define('QDT.view.CreateDR', {
    extend: 'Ext.window.Window',
    title: Profile.getText('CreateDR'),
    alias: 'widget.createdr',
    modal: true,
    width: 820,
    height: 470,
    layout: {
        type: 'fit'
    },
    creator: Profile.getUser(),
    isUpdate: '',
    drNum: '',

    initComponent: function () {
        var me = this;

        if (me.isUpdate) {
            me.title = Profile.getText('EditDR');
        }

        var createForm = Ext.widget('form', {
            width: '100%',
            height: 410,
            //   style : { overflow: 'auto', overflowY: 'hidden' },
            //  autoScroll: true,
            overflowY: 'auto',
            frame: false,
            border: false,
            layout: 'hbox',
            api: me.isUpdate ? { submit: QDT.UpdateDR} : { submit: QDT.CreateDR },

            defaults: {
                xtype: 'panel',
                frame: false,
                border: false,
                flex: 1,

                layout: 'anchor',
                margin: '10 0 10 5'
            },
            fieldDefaults: {
                anchor: '90%',
                labelWidth: 120
            },
//            tbar: [{
//                xtype: 'attachmentbutton',
//                iconCls: 'attachment',
//                itemId: 'view-attachment',
//                text: Profile.getText('attachment'),
//                tooltip: Profile.getText('txtViewAttachment'),
//                refType: 'dr',
//                generateId: false
//            }],
            items: [{
                items: [{
                    xtype: 'displayfield',
                    fieldLabel: '*******',
                    name: 'note',
                    value: '请先输入工卡号',
                    hidden: me.isUpdate ? true : false
                }, {
                    xtype: 'displayfield',
                    fieldLabel: Profile.getText('dr_num'),
                    name: 'dr_num',
                    value: me.drNum,
                    submitValue: true,
                    hidden: me.isUpdate ? false : true
                }, {
                    xtype: 'searchcombo',
                    name: 'job',
                    fieldLabel: Profile.getText('job'),
                    store: Ext.create('QDT.store.Jobs', {
                        pageSize: 10
                    }),
                    displayField: 'job',
                    valueField: 'job',
                    pageSize: 10,
                    editable: true,
                    forceSelection: false,
                    listeners: {
                        blur: function (combo) {
                            var job = createForm.down('[name=job]').getValue();
                            var suffix = createForm.down('[name=suffix]').getValue();
                            if (job !== null && suffix !== null) {
                                QDT.GetJobReleasedQuantity(job, suffix, function (result) {
                                    if (result.success == false) {
                                        MessageBox.warning('获取数量错误，请确认工卡号是否输入正确！');
                                    }
                                    else {
                                        createForm.down('[name=quantity]').setValue(result.data);
                                    }

                                });
                            }
                        },
                        select: function (combo, records) {
                            var job = createForm.down('[name=job]').getValue();
                            var suffix = createForm.down('[name=suffix]').getValue();
                            QDT.GetOpsByJob(job, suffix, function (result) {
                                if (result.success === true) {
                                    ops = result.data;
                                    createForm.down('[name=oper_num]').enable(true);
                                    var op_store = Ext.create('Ext.data.Store', {
                                        fields: [{ name: 'oper_num', mapping: 'oper_num'}],
                                        data: ops
                                    });
                                    createForm.down('[name=oper_num]').bindStore(op_store);
                                } else {
                                    createForm.down('[name=oper_num]').enable(false);
                                }
                            });
                        }
                    }
                }, {
                    xtype: 'searchcombo',
                    name: 'discrepancy_item',
                    fieldLabel: Profile.getText('partNum'),
                    store: Ext.create('QDT.store.Items'),
                    displayField: 'item',
                    valueField: 'item',
                    pageSize: 10,
                    editable: true,
                    listeners: {
                        select: function (combo, records) {

                            QDT.SearchItemOwnersByItem(records[0].data.item, function (result) {
                                var n = 'name_' + Profile.getLang();
                                var qe = result.data.qe_owner;
                                var me = result.data.me_owner;
                                var qe_owner = Ext.create('QDT.model.Employee', {
                                    name: qe === null ? '' : result.data.qe_owner.employee[n],
                                    employee_id: qe === null ? '' : result.data.qe_owner.employee.employee_id
                                });
                                var me_owner = Ext.create('QDT.model.Employee', {
                                    name: me === null ? '' : result.data.me_owner.employee[n],
                                    employee_id: me === null ? '' : result.data.me_owner.employee.employee_id
                                });
                                createForm.down('searchcombo[name=dr_qe_owner]').store.removeAll();
                                createForm.down('searchcombo[name=dr_qe_owner]').store.add(qe_owner);
                                createForm.down('searchcombo[name=dr_qe_owner]').select(qe_owner);

                                createForm.down('searchcombo[name=dr_me_owner]').store.removeAll();
                                createForm.down('searchcombo[name=dr_me_owner]').store.add(me_owner);
                                createForm.down('searchcombo[name=dr_me_owner]').select(me_owner);
                            });

                            if (records[0].data.FGorRW !== 'FG') {
                                createForm.down('[name=serialOrLot]').setValue(records[0].data.serialOrLot);
                            }

                        }
                    }
                }, {
                    xtype: 'textfield',
                    name: 'serialOrLot',
                    fieldLabel: 'hidden',
                    hidden: true
                    //identify the field serial_lot belongs to serial or lot 
                }, {
                    xtype: 'numberfield',
                    name: 'suffix',
                    fieldLabel: Profile.getText('suffix'),
                    allowBlank: false,
                    allowDecimals: false,
                    minValue: 0,
                    value: 0,
                    listeners: {
                        blur: function (combo) {
                            var job = createForm.down('[name=job]').getValue();
                            var suffix = createForm.down('[name=suffix]').getValue();
                            if (job !== null && suffix !== null) {
                                QDT.GetJobReleasedQuantity(job, suffix, function (result) {

                                    if (result.success) {
                                        createForm.down('[name=quantity]').setValue(result.data);
                                    }
                                    else {
                                        MessageBox.warning('获取数量错误');
                                    }
                                });
                            }
                        }
                    }
                }, {
                    xtype: 'textfield',
                    name: 'quantity',
                    fieldLabel: Profile.getText('quantity')
                }, {
                    xtype: 'textfield',
                    name: 'serial_lot',
                    fieldLabel: Profile.getText('serial_lot')

                }, {
                    xtype: 'combobox',
                    name: 'oper_num',
                    fieldLabel: Profile.getText('operation_num'),
                    displayField: 'oper_num',
                    valueField: 'oper_num',
                    editable: false
                }, {
                    xtype: 'employeecombo',
                    name: 'dr_qe_owner',
                    fieldLabel: Profile.getText('qe_owner')
                }, {
                    xtype: 'searchcombo',
                    name: 'dr_me_owner',
                    fieldLabel: Profile.getText('me_owner'),
                    store: Ext.create('QDT.store.AuthorizedMes'),
                    displayField: 'name',
                    valueField: 'employee_id',
                    pageSize: 10
                }, {
                    xtype: 'fieldset',
                    anchor: '90%',
                    title: Profile.getText('attachment'),
                    collapsible: true,
                    defaultType: 'textfield',
                    layout: 'anchor',
                    items: [{
                        xtype: 'multipleattachments',
                        nameBase: "attachment#"

                    }],
                    hidden: me.isUpdate
                }]
            }, {
                items: [{
                    xtype: 'remotecombo',
                    name: 'dr_type',
                    fieldLabel: Profile.getText('type'),
                    store: Ext.create('QDT.store.DrTypes'),
                    displayField: 'common_string',
                    valueField: 'id',
                    emptyText: Profile.getText('PleaseSelect')
                }, {
                    xtype: 'remotecombo',
                    name: 'source',
                    fieldLabel: Profile.getText('source'),
                    store: Ext.create('QDT.store.DrSources'),
                    displayField: 'common_string',
                    valueField: 'id',
                    emptyText: Profile.getText('PleaseSelect')
                }, {
                    xtype: 'displayfield',
                    name: 'create_date',
                    fieldLabel: Profile.getText('create_date'),
                    value: Ext.Date.format(new Date(), 'Y-m-d H:i'),
                    renderer: QDT.util.Renderer.dateTimeRenderer
                }, {
                    xtype: 'displayfield',
                    name: 'create_by_name',
                    fieldLabel: Profile.getText('create_by'),
                    value: me.creator['name_' + Profile.getLang()]
                }, {
                    xtype: 'displayfield',
                    name: 'due_date',
                    fieldLabel: Profile.getText('due_date'),
                    value: Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.MONTH, 3), 'Y-m-d'),
                    submitValue: true,
                    renderer: QDT.util.Renderer.dateRenderer
                }, {
                    xtype: 'textarea',
                    name: 'dr_description',
                    fieldLabel: Profile.getText('description')
                }, {
                    xtype: 'fieldset',
                    anchor: '90%',
                    title: Profile.getText('discrepancy_item'),
                    collapsible: true,
                    defaultType: 'textfield',
                    layout: 'anchor',
                    items: [
                    {
                        xtype: 'discrepancy-grid',
                        itemId: 'discrepancy_grid',
                        name: 'discrepancy_grid',
                        anchor: '100%',
                        height: 130,

                        store: Ext.create('QDT.store.dr.Discrepancies')
                    }
                    //                    {
                    //                        xtype: 'multipletextfields',
                    //                        nameBase: "discrepancy_list#",
                    //                        anchor: '100%'
                    //                    }
                    ]
                }, {
                    xtype: 'hidden',
                    name: 'create_by',
                    value: me.creator.user_id
                }]
            }],
            buttons: [{
                iconCls: 'submit',
                text: me.isUpdate ? Profile.getText('Update') : Profile.getText('Submit'),
                handler: function (btn) {
                    var discrepancy_store = me.down('form').down('#discrepancy_grid').store;

                    if (discrepancy_store.getCount() == 0) {
                        My.Msg.info(Profile.getText('Error'), '请输入不符合项');
                    } else {
                        var discrepancy_records = discrepancy_store.getRange(0, discrepancy_store.getCount());
                        var discrepancies = Ext.JSON.encode(QDT.util.Util.getRecordsData(discrepancy_records));
                        createForm.getForm().submit({
                            params: { discrepancies: discrepancies },
                            waitMsg: '正在保存文件...',
                            success: function (form, action) {
                                var msgbox;
                               
                                if (action.result.hasProblem) {
                                    msgbox = My.Msg.info('错误', action.result.errorMessage);
                                } else {
                                    me.close();
                                    if (me.isUpdate) {
                                        msgbox = My.Msg.info(Profile.getText('txtRecordUpdated'), me.drNum + '更新成功！');
                                    } else {
                                        msgbox = My.Msg.info(Profile.getText('txtRecordCreated'), Profile.getText('dr_num') + ':' + action.result.dr_num);
                                    }
                                    cq.query('dr')[0].store.reload();
                                }
                                Ext.Function.defer(function () {
                                    msgbox.zIndexManager.bringToFront(msgbox);
                                }, 100);

                            },
                            failure: function (form, action) {
                                My.Msg.info(Profile.getText('Error'), '操作不成功，请检查输入');
                            }
                        });
                    }

                }
            }]
        });

        me.items = [{
            title: Profile.getText('DRInfo'),
            items: [createForm]
        }];

        me.callParent();
    }
});