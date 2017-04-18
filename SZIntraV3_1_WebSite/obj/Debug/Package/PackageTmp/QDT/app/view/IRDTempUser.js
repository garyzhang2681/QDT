Ext.define('QDT.view.IRDTempUser', {
    extend: 'Ext.window.Window',
    alias: 'widget.irdtempuser',
    title: Profile.getText('TempUser'),
    width: 300,
    height: 105,
    modal: true,
    layout: {
        type: 'fit'
    },

    initComponent: function () {

        var me = this;

        var tempUserForm = Ext.widget('form', {
            api: {
                submit: DpIrd.GetUserInfoBySSO
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: 'SSO',
                labelWidth: 80,
                margin: '10 10 10 10'

            }]
        });

        me.items = [tempUserForm];


        me.buttons = [{
            iconCls: 'submit',
            text: Profile.getText('Save'),
            handler: function () {
                tempUserForm.submit({
                    success: function (form, action) {
                        if (action.result.success) {
                           cq.query('irddetail grid[gridName=irdCharacteristicGrid]')[0].temp_user = action.result.user;
                            My
                        } else {
                            My.Msg.warning(action.result.errorMessage);
                        }
                    },
                    failure: function (form, action) {
                        My.Msg.warning(action.result.errorMessage);
                    }
                });
            }
        }];


        me.callParent();
    }

});