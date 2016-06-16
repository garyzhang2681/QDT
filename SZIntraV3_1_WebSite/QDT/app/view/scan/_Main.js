Ext.define('QDT.view.scan.Main', {
    extend: 'Ext.window.Window',
    alias: 'widget.scan-main',

    requires: [

    ],

    constrainHeader: true,
    autoShow: true,
    closable:false,
    y: 50,
    width: 875,
    height: 560,
    layout: 'border',

    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            title: Profile.getText('ScanSystem'),
            items: [
                {
                    xtype: 'tabpanel',
                    region: 'center',
                    itemId: 'tab-container',
                    activeTab: 0,
                    defaults: {
                        layout: 'fit'
                    },
                    items: [
                        {
                            xtype: 'gridpanel',
                            itemId: 'scan-history',
                            autoScroll: true,
                            title: Profile.getText('ScanHistory'),
                            store: Ext.create('QDT.store.scan.ScanHistory', {
                                autoLoad: true,
                                autoDestory: true
                            }),
                            columns: [
                                {
                                    dataIndex: 'scan_type',
                                    text: Profile.getText('type'),
                                    width: 60
                                },
                                {
                                    dataIndex: 'employee_name',
                                    text: Profile.getText('employee_name'),
                                    width: 90
                                },
                                {
                                    dataIndex: 'machine_number',
                                    text: Profile.getText('machine_number'),
                                    width: 70
                                },
                                {
                                    dataIndex: 'job',
                                    text: Profile.getText('job'),
                                    width: 80
                                },
                                {
                                    dataIndex: 'suffix',
                                    text: Profile.getText('suffix'),
                                    width: 40
                                },
                                {
                                    dataIndex: 'oper_num',
                                    text: Profile.getText('oper_num'),
                                    width: 60
                                },
                                {
                                    dataIndex: 'start_time',
                                    text: Profile.getText('start_time'),
                                    renderer: Ext.util.Format.dateRenderer('h:i'),
                                    width: 60
                                },
                                {
                                    dataIndex: 'end_time',
                                    text: Profile.getText('end_time'),
                                    renderer: Ext.util.Format.dateRenderer('h:i'),
                                    width: 60
                                },
                                {
                                    dataIndex: 'secs',
                                    text: Profile.getText('WorkTime'),
                                    width: 60
                                },
                                {
                                    dataIndex: 'qty_work_on',
                                    text: Profile.getText('quantity'),
                                    width: 60
                                }
                            ]
                        },
                        {
                            xtype: 'gridpanel',
                            itemId: 'op-history',
                            title: '工序历史',
                            columns: [
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'string',
                                    text: 'String'
                                },
                                {
                                    xtype: 'numbercolumn',
                                    dataIndex: 'number',
                                    text: 'Number'
                                },
                                {
                                    xtype: 'datecolumn',
                                    dataIndex: 'date',
                                    text: 'Date'
                                },
                                {
                                    xtype: 'booleancolumn',
                                    dataIndex: 'bool',
                                    text: 'Boolean'
                                }
                            ]
                        },
                        {
                            xtype: 'scan.mycurrentwork',
                            itemId: 'my-work',
                            store: Ext.create('QDT.store.scan.MyCurrentWork', {
                                autoDestory: true,
                                listeners: {
                                    beforeload: function () {
                                        var employeeId = me.down('[name=employee_id]').getValue();
                                        Ext.apply(this.getProxy().extraParams, {
                                            employee_id: employeeId
                                        });
                                    }
                                }
                            })
                        }
                    ]
                },
                {
                    xtype: 'form',
                    itemId: 'transaction-form',
                    region: 'east',
                    width: 220,
                    bodyBorder: false,
                    frame: true,
                    bodyPadding: 2,
                    api: { submit: 'DpScan.ScanSubmit' },
                    titleCollapse: false,
                    pollForChanges: false,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    fieldDefaults: {
                        labelWidth: 60,
                        anchor: '95%'
                    },
                    items: [
                        {
                            xtype: 'fieldset',
                            title: Profile.getText('EmployeeInformation'),
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: Profile.getText('local_id'),
                                    name: 'local_id',
                                    itemId: 'local_id',
                                    anchor: '80%'
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: Profile.getText('employee_name'),
                                    name: 'name',
                                    itemId: 'name'
                                },
                                {
                                    xtype: 'hidden',
                                    name: 'is_in_shift',
                                    itemId: 'is_in_shift'
                                },
                                {
                                    xtype: 'hidden',
                                    name: 'employee_id',
                                    itemId: 'employee_id',
                                    submitValue: true
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: '设备信息',
                            items: [
                                {
                                    xtype: 'textfield',
                                    fieldLabel: Profile.getText('machine_number'),
                                    name: 'machine_number',
                                    itemId: 'machine_number',
                                    anchor: '80%'
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: Profile.getText('type'),
                                    name: 'machine_type',
                                    itemId: 'machine_type'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: '工序信息',
                            items: [
                                {
                                    xtype: 'combobox',
                                    name: 'scan_type',
                                    fieldLabel: Profile.getText('type'),
                                    store: Ext.create('QDT.store.scan.ScanTypes'),
                                    displayField: 'description',
                                    valueField: 'scan_type'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: Profile.getText('job'),
                                    name: 'job',
                                    itemId: 'job'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: Profile.getText('suffix'),
                                    name: 'suffix',
                                    itemId: 'suffix',
                                    value: 0,
                                    anchor: '60%'
                                },
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: Profile.getText('item'),
                                    name: 'item',
                                    itemId: 'item'
                                },
                                {
                                    xtype: 'combobox',
                                    name: 'scan_type',
                                    fieldLabel: Profile.getText('oper_num'),
                                    name: 'oper_num',
                                    editable: false,
                                    forceSelection: true,
                                    store: Ext.create('Ext.data.DirectStore', {
                                        fields: ['oper_num'],
                                        paramOrder: ['job', 'suffix'],
                                        directFn: 'DpScan.GetJobOperationNumbers',
                                        root: 'data',
                                        listeners: {
                                            beforeload: function () {
                                                var store = this;
                                                var form = me.down('form'),
                                                    job = form.getValues().job,
                                                    suffix = form.getValues().suffix;
                                                Ext.applyIf(store.getProxy().extraParams, {
                                                    job: job,
                                                    suffix: suffix
                                                });
                                            }
                                        }
                                    }),
                                    displayField: 'oper_num'
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: Profile.getText('quantity'),
                                    name: 'qty',
                                    itemId: 'qty',
                                    anchor: '80%'
                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    scale: 'medium',
                                    name: 'reset',
                                    flex: 1,
                                    margin: 5,
                                    itemId: 'reset',
                                    text: Profile.getText('Reset')
                                },
                                {
                                    xtype: 'button',
                                    scale: 'medium',
                                    name: 'submit',
                                    flex: 1,
                                    margin: 5,
                                    text: Profile.getText('Submit'),
                                    handler: function () {
                                        this.up('form').getForm().submit({
                                            success: function (form, action) {

                                            },
                                            failure: function (form, action) {

                                                My.Msg.warning(action.result.erroeMessage);
                                            }
                                        });
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    region: 'south',
                    layout: 'hbox',
                    title: '',
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
                                {
                                    xtype: 'button',
                                    text: Profile.getText('BatchTeamWork')
                                },
                                {
                                    xtype: 'button',
                                    name: 'item',
                                    itemId: 'item',
                                    text: '项目'
                                },
                                {
                                    xtype: 'button',
                                    name: 'learn',
                                    itemId: 'learn',
                                    text: Profile.getText('Learn')
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});