//Widget for user log in
//TODO:
//1. change text to Profile.getText(obj)
Ext.define('Asz.ux.UserValidation', {
    extend: 'Ext.window.Window',
    alias: 'widget.uservalidation',
    width: 245,
    modal: true,
    onSuccess: null,
    onFailure: null,
    api: null,

    initComponent: function () {
        var me = this;

        me.title = Profile.getText('UserValidation');

        me.items = [{
            xtype: 'form',
            frame: true,
            api: me.api,
            items: [{
                xtype: 'fieldset',
                defaults: {
                    anchor: '100%',
                    labelWidth: 75,
                    submitValue: true,
                    labelAlign: 'top',
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == e.ENTER) {
                                me.doLogIn();
                            }
                        }
                    }
                },
                defaultType: 'textfield',
                items: [{
                    fieldLabel: '用户名',
                    name: 'identity',
                    emptyText: Profile.getText('msgYourSsoOrEmployeeNumber')
                }, {
                    fieldLabel: Profile.getText('Password'),
                    name: 'password',
                    inputType: 'password'
                }, {
                    xtype: 'hidden',
                    name: 'lang',
                    value: Profile.getLang()
                }]
            }],
            buttons: [{
                text: Profile.getText('LogIn'),
                name: 'submit',
                iconCls: 'forward',
                handler: function () {
                    me.doLogIn();
                }
            }]
        }];

        me.callParent();

        me.on({
            show: function () {
                me.down('[name=identity]').focus(false,true);
            }
        });
    },

    doLogIn: function () {
        var me = this;
        me.down('form').submit({
            success: me.onSuccess,
            failure: me.onFailure
        });
    }
});