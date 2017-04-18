Ext.define('QDT.view.inspection.Comment', {
    extend: 'Ext.window.Window',
    alias: 'widget.inspection-comment',
    selected_inspections: '',
    height: 180,
    width: 350,
    modal: true,
    resizable: false,
    add_by: null,
    add_by_name: null,
    initComponent: function () {
        var me = this;
        me.title = Profile.getText('AddComment');
        me.items = [{
            xtype: 'form',
            frame: true,
            layout: 'anchor',
            api: { submit: DpInspection.UpdateInspectionComment },
            defaults: {
                margin: '5 5 5 5',
                 labelWidth: 50
            },
            items: [{
                xtype: 'displayfield',
                fieldLabel: Profile.getText('AddBy'),
                value: me.add_by_name
            }, {
                xtype: 'textfield',
                name: 'add_by',
                value: me.add_by,
                hidden: true,
                submitValue: true
            },{
                xtype: 'textarea',
                name: 'comment',
                fieldLabel: Profile.getText('comment'),
                anchor: '100%'

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