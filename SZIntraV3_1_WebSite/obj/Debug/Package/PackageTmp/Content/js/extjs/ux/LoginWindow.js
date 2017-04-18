//Widget for user log in
//TODO:
//1. change text to Profile.getText(obj)
Ext.define('Asz.ux.LoginWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.loginwindow',
    width: 324,
    modal: true,
    title: Profile.getText('LogIn'),

    initComponent: function () {
        var me = this;

        me.items = [{
            xtype: 'form',
            frame: true,
            api: {
                submit: QDT.UserLogin
            },
            items: [{
                xtype: 'fieldset',
                title: 'Quality Digitalization Tool',
                defaults: {
                    anchor: '90%',
                    labelWidth: 75,
                    submitValue: true,
                    labelAlign: 'top',
                    listeners: {
                        //do log in when 'Enter' pressed
                        specialkey: function (field, e) {
                            if (e.getKey() == e.ENTER) {
                                doLogIn();
                            }
                        }
                    }
                },
                defaultType: 'textfield',
                items: [{
                    fieldLabel: 'SSO',
                    name: 'sso',
                    value: Profile.isRememberUser === 'true' ? Profile.getUserSso() : ''
                }, {
                    fieldLabel: Profile.getText('Password'),
                    name: 'password',
                    inputType: 'password'
                }, {
                    xtype: 'hidden',
                    name: 'lang',
                    value: Profile.getLang()
                }, {
                    xtype: 'checkbox',
                    boxLabel: Profile.getText('RememberUser'),
                    margin: '20 0 5 5',
                    submitValue: false,
                    checked: Profile.isRememberUser === 'true',
                    listeners: {
                        change: function (field, newValue, oldValue) {
                            if (newValue) {
                                Profile.doRememberUser(true);
                            } else {
                                Profile.doRememberUser(false);
                            }
                        }
                    }
                }]
            }],
            buttons: [{
                text: Profile.getText('LogIn'),
                iconCls: 'submit',
                listeners: {
                    click: doLogIn
                }
            }]
        }];

        function refreshPage() {
            window.location.reload();
        };

      
        function doLogIn() {
            me.down('form').getForm().submit({
                success: function (form, action) {
                    //result.user is instance of server model User
                    Profile.setUser(action.result.user);
                    refreshPage();
                },
                failure: function (form, action) {
                    Ext.Msg.alert('Error', action.result.errorMessage);
                }
            });

        };

        me.callParent();
    }
});

