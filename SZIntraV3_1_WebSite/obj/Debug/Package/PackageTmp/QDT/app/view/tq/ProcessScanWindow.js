Ext.define('QDT.view.tq.ProcessScanWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.tq-processscanwindow',
    requires: [
        'QDT.store.scan.JobOperations'
    ],
    constrainHeader: true,
    modal: true,
    resizable: false,
    autoShow: true,
    width: 500,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    record: {},

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            defaults: {
                bodyPadding: 10
            },
            items: [{
                xtype: 'form',
                flex: 1,
                itemId: 'process',
                defaults: {
                    xtype: 'displayfield'
                },
                fieldDefaults: {
                    labelWidth: 75
                },
                items: [{
                    name: 'current_process_id',
                    xtype: 'hiddenfield'
                }, {
                    name: 'local_id',
                    fieldLabel: Profile.getText('local_id')
                }, {
                    name: 'employee_id',
                    fieldLabel: Profile.getText('employee_name'),
                    renderer: QDT.util.Renderer.employeeName
                }, {
                    name: 'skill_code',
                    fieldLabel: Profile.getText('skill_code')
                }, {
                    name: 'current_step_name',
                    fieldLabel: Profile.getText('current_step')
                }]
            }, {
                xtype: 'form',
                flex: 1,
                itemId: 'job-operation',
                fieldDefaults: {
                    labelWidth: 75
                },
                items: [{
                    xtype: 'textfield',
                    name: 'job',
                    fieldLabel: Profile.getText('job'),
                    allowBlank: false
                }, {
                    xtype: 'displayfield',
                    name: 'item',
                    fieldLabel: Profile.getText('item')
                }, {
                    xtype: 'combo',
                    fieldLabel: Profile.getText('oper_num'),
                    name: 'oper_num',
                    editable: false,
                    foreceSelection: true,
                    queryMode: 'remote',
                    store: Ext.create('QDT.store.scan.JobOperations'),
                    displayField: 'oper_num',
                    valueField: 'oper_num',
                    allowBlank: false,
                    anchor: '100%'
                }]
            }],
            buttons: [{
                iconCls: 'submit',
                text: Profile.getText('Submit'),
                itemId: 'submit'
            }, {
                iconCls: 'cancel',
                text: Profile.getText('Cancel'),
                itemId: 'cancel'

            }]
        });


        me.callParent();
    }
});