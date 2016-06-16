
Ext.define('QDT.view.tq.CreateScrappedRecord', {
    extend: 'Ext.window.Window',
    title: '创建报废记录',
    alias: 'widget.createscrappedrecord',
    modal: true,
    width: 320,
    height: 250,
    layout: {
        type: 'fit'
    },
    creator: Profile.getUser(),

    initComponent: function () {
        var me = this;
        var createForm = Ext.widget('form', {
            frame: true,
            layout: 'anchor',
            bodyPadding: 10,
            border: false,
            api: { submit: QDT.CreateScrappedRecord },
            defaults: {
                anchor: '100%',
                allowBlank: false,
                xtype: 'panel',
                frame: false,
                border: false,
                flex: 1,
                layout: 'anchor',
                margin: '5 0 5 0'
            },
            fieldDefaults: {
                anchor: '90%',
                labelWidth: 120
            },
            items: [{
                xtype: 'hidden',
                name: 'create_by',
                value: me.creator.user_id
            }, {
                xtype: 'employeecombo',
                name: 'scrapped_by',
                fieldLabel: '报废者'
            }, {
                xtype: 'skill-skillcodecombo',
                store: Ext.create('QDT.store.skill.InUseSkillCodes'),
                name: 'skill_code_id',
                id: 'skill_code_id'
            }, {
                xtype: 'datefield',
                fieldLabel: '报废日期',
                name: 'scrapped_date',
                maxValue: new Date() // limited to the current date or prior

            }, {
                xtype: 'textareafield',
                fieldLabel: '备注',
                name: 'remark',
                grow: true,
                allowBlank: true
            }],
            buttons: [{
                iconCls: 'submit',
                text: Profile.getText('Submit'),
                handler: function (btn) {
                    createForm.getForm().submit({
                        waitMsg: '正在提交...',
                        success: function (form, action) {
                            var msgbox;
                            if (!action.result.success) {
                                msgbox = My.Msg.info('错误', action.result.errorMessage);
                            } else {
                                me.close();
                                msgbox = My.Msg.info(Profile.getText('txtRecordUpdated'), '提交成功！');
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
            }]
        });

        me.items = [createForm];
        me.callParent();
    }
});