Ext.define('QDT.view.inspection.InspectionEditor', {
    extend: 'Ext.window.Window',
    alias: 'widget.inspection-inspectioneditor',
    selected_inspections: '',
    selected_serials:'',
    width: 300,
    modal: true,
    resizable: false,
    edit_by: null,
    edit_by_name: null,
    initComponent: function () {
        var me = this;
        me.title = Profile.getText('EditInspection'),

        me.items = [{
            xtype: 'form',
            layout: 'anchor',
            api: { submit: DpInspection.EditInspection },
            defaults: {
                margin: '5 5 5 5',
                   labelWidth: 58
            },
            labelWidth: 75,
            frame: true,
            items: [{
                xtype: 'displayfield',
                fieldLabel: Profile.getText('Editor'),
                value: me.edit_by_name
            }, {
                xtype: 'textfield',
                name: 'edit_by',
                value: me.edit_by,
                hidden: true,
                submitValue: true
            }, {
                xtype: 'combobox',
                name: 'oper_num',
                fieldLabel: Profile.getText('oper_num'),
                displayField: 'oper_num',
                valueField: 'oper_num',
                anchor: '100%',
                editable: false,
                listeners: {
                    afterrender: function (cmp, boundEl, value, eOpts) {
                        DpInspection.CheckSameItem(me.selected_serials, function (result) {
                            if (result.success) {
                                operStore = Ext.create('Ext.data.Store', {
                                    fields: [{
                                        name: 'oper_num',
                                        mapping: 'oper_num'
                                    }],
                                    data: result.ops
                                });
                                me.down('[name=oper_num]').bindStore(operStore);
                            } else {
                                My.Msg.warning(result.errorMessage);
                            }
                        });
                    }
                }
            }, {
                xtype: 'combobox',
                name: 'inspection_location',
                fieldLabel: Profile.getText('inspection_location'),
                store: Ext.create('QDT.store.inspection.InspectionLocations').load({
                    params: {
                        language: Profile.getLang(),
                        view_all: false
                    }
                }),
                displayField: 'name',
                valueField: 'inspection_location_id',
                anchor: '100%',
                editable: false
            }, {
                xtype: 'textfield',
                name: 'selected_inspections',
                hidden: true,
                value: me.selected_inspections,
                submitValue: true
            }],

            buttons: [{
                xtype: 'button',
                text: Profile.getText('Submit'),
                iconCls: 'submit',
                margin: '0 5 5 0',
                handler: function () {
                    me.down('form').submit({
                        waitMsg: '正在保存结果...',
                        success: function (form, action) {
                            me.close();
                            if (action.result.success) {
                                My.Msg.warning('保存结果成功！');
                            } else {
                                My.Msg.warning('保存结果失败');
                            }
                            cq.query('inspection-maingrid')[0].store.reload();
                        },
                        failure: function (form, action) {
                            My.Msg.info(Profile.getText('Error'), action.result.errorMessage);
                        }
                    });
                }
            }, {
                xtype: 'button',
                text: Profile.getText('Close'),
                margin: '0 5 5 ',
                iconCls: 'cancel',
                handler: function () {
                    me.close();
                }
            }]

        }];


        me.callParent();
    }
});