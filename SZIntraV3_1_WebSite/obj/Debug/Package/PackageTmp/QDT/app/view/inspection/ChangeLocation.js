Ext.define('QDT.view.inspection.ChangeLocation', {
    extend: 'Ext.window.Window',
    alias: 'widget.inspection-changeloaction',
    selected_inspections: '',
    width: 300,
    modal: true,
    resizable: false,
    change_by: null,
    change_by_name: null,

    initComponent: function () {
        var me = this;
        me.title = Profile.getText('ChangeLocation');

        me.items = [{
            xtype: 'form',
            layout: 'anchor',
            api: { submit: DpInspection.ChangeInspectionLocation },
            labelWidth: 75,
            frame: true,
            defaults: {
                margin: '5 5 5 5'
            },
            items: [{
                xtype: 'displayfield',
                fieldLabel: Profile.getText('Editor'),
                value: me.change_by_name
            }, {
                xtype: 'textfield',
                name: 'change_by',
                value: me.change_by,
                hidden: true,
                submitValue: true
            },{
                xtype: 'combobox',
                name: 'inspection_location',
                fieldLabel: Profile.getText('inspection_location'),
                labelWidth: 58,
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