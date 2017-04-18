Ext.define('Asz.ux.ChangePasswordWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.changepasswordwindow',
    width: 324,
    modal: true,


    initComponent: function () {
        var me = this;
        me.title = Profile.getText('ChangePassword');
        var formPanel = Ext.widget('form', {
            frame: true,
            api: {
                submit: QDT.ChangePassword
            },
            defaults: {
                anchor: '90%',
                labelWidth: 75,
                allowBlank: false,
                submitValue: true,
                labelAlign: 'top',
                listeners: {
                    //do submit on when 'Enter' pressed
                    specialkey: function (field, e) {
                        if (e.getKey() == e.ENTER) {
                            doSubmit();
                        }
                    }
                }
            },
            defaultType: 'textfield',
            items: [{
                xtype: 'hidden',
                name: 'user_id',
                value: Profile.getUser().user_id
            }, {
                fieldLabel: Profile.getText('Password'),
                name: 'password',
                inputType: 'password'
            }, {
                fieldLabel: Profile.getText('NewPassword'),
                name: 'new_password',
                inputType: 'password'
            }, {
                fieldLabel: Profile.getText('Confirm'),
                name: 'confirm_password',
                inputType: 'password'
            }],
            buttons: [{
                text: Profile.getText('Submit'),
                iconCls: 'submit',
                listeners: {
                    click: doSubmit
                }
            }]
        });

        me.items = [formPanel];

        function doSubmit() {
            formPanel.submit({
                success: function (form, action) {
                    Ext.Msg.alert(Profile.getText('Success'), Profile.getText('PasswordChanged'));
                    me.close();
                    QDT.UserLogout(function (result) {
                        if (result.success) {
                            Profile.logOut();
                            window.location.reload();
                        } else {
                            Ext.Msg.alert(Profile.getText('Error'), result.errorMessage);
                        }
                    });
                },
                failure: function (form, action) {
                    Ext.Msg.alert(Profile.getText('Error'), action.result.errorMessage);
                }
            });
        };

        me.callParent();
    }
});