Ext.define('QDT.view.GenerateIRD', {
    extend: 'Ext.window.Window',
    alias: 'widget.generateird',
    title: Profile.getText('GenerateIRD'),


    modal: true,
   

    initComponent: function () {

        var me = this;

        var irdHeaderInformationForm = Ext.widget('irdheaderinformationform');

        me.items = [irdHeaderInformationForm];

        me.buttons = [{
            iconCls: 'submit',
            text: Profile.getText('GenerateIRD'),
            handler: function () {
                irdHeaderInformationForm.submit({
                    success: function (form, action) {
                        if (action.result.success) {
                            My.Msg.warning('创建IRD成功');
                            cq.query('ird[gridName=irdRouteListGrid]')[0].store.reload();
                            me.close();
                        } else {
                            My.Msg.warning('创建IRD失败' + action.result.errorMessage, function () {
                                generateIrdForm.getForm().reset();
                            });
                        }
                    },
                    failure: function (form, action) {
                        My.Msg.warning('创建IRD失败' + action.result.errorMessage, function () {
                            generateIrdForm.getForm().reset();
                        });
                    }
                });
            }
        }];
        me.callParent();
    }
});