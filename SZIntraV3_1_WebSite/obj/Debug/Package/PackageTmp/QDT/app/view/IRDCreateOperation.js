Ext.define('QDT.view.IRDCreateOperation', {
    extend: 'Ext.window.Window',
    alias: 'widget.irdcreateoperation',
    title: Profile.getText('irdCreateOperation'),
    width: 800,
    height: 600,
    modal: true,
    layout: {
        type: 'fit'
    },

    initComponent: function () {
        var me = this;
        var irdCreateOpeartionForm = Ext.widget('form', {

            layout: 'anchor',
            items: [{
                xtype: 'textfield',
                name: 'oper_num',
                fieldLabel:Profile.getText('oper_num'),
                allowBlank:false
          
            }],
            buttons: [{
                iconCls: 'submit',
                text: Profile.getText('Submit'),
                handler: function (btn) {
                    createForm.getForm().submit({
                                   
                        success: function (form, action) {
//                            me.close();
//                            Ext.Msg.alert(Profile.getText('RecordCreated'), Profile.getText('dr_num') + ':' + action.result.dr_num);
//                            cq.query('dr')[0].store.reload();
                            //Ext.StoreMgr.lookup('RelatedDRs').load();
                        },
                        failure: function (form, action) {
//                            Ext.Msg.alert(Profile.getText('Error'), action.result.errorMessage);
                        }
                    });
                }
            }]
        });

        me.items = [irdCreateOpeartionForm];

        me.callParent();
    }
});