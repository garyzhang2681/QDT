Ext.define('QDT.view.inspection.DefaultInspection', {
    extend: 'Ext.form.Panel',
    alias: 'widget.inspection-defaultinspection',
    create_by: null,
    create_by_name: null,
    api: { submit: 'DpInspection.SendDefaultInspection' },
    border: false,
    initComponent: function () {
        var me = this;

        me.items = [{
            xtype: 'form',
            layout: 'anchor',
            frame: true,
            border: false,
            defaults: {
                anchor: '95%',
                labelWidth: 75,
                margin: '5 5 5 5'
            },

            items: [{
                xtype: 'displayfield',
                fieldLabel: Profile.getText('InspectionCreator'),
                value: me.create_by_name
            }, {
                xtype: 'textfield',
                name: 'create_by',
                value: me.create_by,
                hidden: true,
                submitValue: true
            }, {
                xtype: 'combobox',
                fieldLabel: Profile.getText('inspection_type'),
                name: 'inspection_type',
                store: Ext.create('QDT.store.inspection.DefaultInspectionTypes'),
                displayField: 'name',
                valueField: 'inspection_type_id',
                editable: false
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
                editable: false
            }, {
                xtype: 'textarea',
                name: 'serial',
                id: 'serial',
                grow: true,
                fieldLabel: Profile.getText('serial'),
                allowBlank: false,
                listeners: {
                    blur: me.checkSerials,
                    change:me.clearOp,
                    scope: me
                }
            }, {
                xtype: 'combobox',
                name: 'oper_num',
                displayField: 'oper_num',
                valueField: 'oper_num',
                editable: false,
                fieldLabel: Profile.getText('oper_num'),
                allowBlank: false,
                listeners: {
                    blur: me.checkExistInspection,
                    scope: me
                }
            }, {
                xtype: 'textfield',
                name: 'remark',
                fieldLabel: Profile.getText('remark')
            }, {
                xtype: 'displayfield',
                name: 'part_num',
                fieldLabel: Profile.getText('part_num'),
                submitValue: true
            }],
            buttons: [{
                iconCls: 'submit',
                text: Profile.getText('Submit'),
                handler: function () {
                    this.setDisabled(true);
                    if (me.isValid()) {
                        me.submit({
                            success: function (form, action) {
                                if (action.result.success) {
                                    My.Msg.warning('送检成功！');
                                    me.getForm().reset();
                                    cq.query('inspection-maingrid')[0].store.reload();
                                } else {
                                    My.Msg.warning(action.result.errorMessage);
                                }
                                me.down('form').down('button').setDisabled(false);
                            },
                            failure: function (form, action) {
                                My.Msg.warning(action.result.errorMessage);
                                me.down('form').down('button').setDisabled(false);
                            }
                        });
                    }
                }
            }]
        }];

        me.callParent();


    },

    clearOp:function() {
        var me = this,
            op = me.down('[name=oper_num]');
        op.clearValue();
    },

    checkSerials: function () {
        var me = this,
            cmp = me.down('[name=serial]'),
            serials = cmp.getValue(),
            operStore;
        if (serials.length > 0) {
            //                    DpInspection.GetInformationBySerial(cmp.value, function (result) {
            //                        if (result.success) {
            //                            cq.query('inspection-defaultinspection textfield[name=part_num]')[0].setValue(result.item);
            //                        } else {
            //                            My.Msg.warning(result.errorMessage);
            //                        }
            //                    })
            DpInspection.CheckSameItem(serials, function (result) {
                if (result.success) {
                    me.down('[name=part_num]').setValue(result.item);
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
            //TODO  可选工序
        }
    },

    checkExistInspection: function() {
        var me = this,
            cmp = me.down('[name=serial]'),
            serials = cmp.getValue();
        DpInspection.CheckExistInspection(serials, opNum, function(result) {

        });
    }
});