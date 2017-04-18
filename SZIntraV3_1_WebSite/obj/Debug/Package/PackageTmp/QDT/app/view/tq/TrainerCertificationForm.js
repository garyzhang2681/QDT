Ext.define('QDT.view.tq.TrainerCertificationForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.tq-trainercertificationform',

    frame: true,

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            bodyPadding: 10,
            fieldDefaults: {
                labelWidth: 80,
                margin: '10 0',
                allowBlank: false,
                anchor: '100%'
            },
            api: {
                submit: 'DpTq.TrainerCertification'
            },
            layout: {
                type: 'hbox',
                align: 'stretch',
                pack: 'center'
            },
            items: [{
                xtype: 'container',
                width: 500,
                layout: 'anchor',
                items: [
                {
                    xtype: 'employeecombo',
                    name: 'employee_id'
                }, {
                    xtype: 'tq-certificationitemcombo',
                    name: 'certification_item_id',
                    itemId: 'certification_item_id',
                    fieldLabel: Profile.getText('certification_item'),
                    anchor: '50%',
                    width: 300,
                    category: 'stc'
                }, {
                    xtype: 'textarea',
                    name: 'remark',
                    itemId: 'remark',
                    fieldLabel: Profile.getText('remark'),
                    minWidth: 320,
                    anchor: '50%'
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
                    }]
                }]
            }],
            buttons: [{
                iconCls: 'submit',
                text: Profile.getText('Submit'),
                itemId: 'submit',
                handler: me.onSubmitClick,
                scope: me
            }, {
                iconCls: 'undo_blue',
                text: Profile.getText('Reset'),
                itemId: 'reset',
                handler: me.onResetClick,
                scope: me
            }]
        });

        me.callParent();
    },

    onSubmitClick: function () {
        var me = this,
            submitButton = me.down('#submit');
        if (me.isValid()) {
            submitButton.setDisabled(true);
            me.getForm().submit({
                success: function(form, action) {
                
                    submitButton.setDisabled(false);
                    Ext.Msg.alert(Profile.getText('Success'), Profile.getText('txtSubmitSucceed'));
                    //清空form中的所有内容
                    me.onResetClick();
                },
                failure: function(form, action) {
                    submitButton.setDisabled(false);
                 
                    Ext.Msg.alert(Profile.getText('Error'), action.result.errorMessage);
                }
            });
        } else {
            Ext.Msg.alert(Profile.getText('Error'), '请确认输入正确！');
        }
    },

    onResetClick: function () {
        this.getForm().reset();
    }
});