Ext.define('QDT.view.scan.TransactionInformationPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.scan-transactioninformationpanel',

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            width: 220,
            bodyBorder: false,
            frame: true,
            bodyPadding: 2,
         
            titleCollapse: false,
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
        });

        me.callParent();
    }
});