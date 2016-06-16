Ext.define('QDT.view.tq.DeleteStamper', {
    extend: 'Ext.form.Panel',
    alias: 'widget.tq-deletestamper',
  
   
    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            autoScroll: false,
            border: false,
            bodyPadding: '15',
            api: { submit: 'DpTq.DeleteStamper' },
            title: 'Enter employee name:',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
               autoScroll: true,
                margin: '0 0 10 0'
            },

            items: [
            
            
            
            {
                xtype: 'employeecombo',
                itemId: 'idForDelete',
                fieldLabel: Profile.getText('requestFor'),
                name: 'idForDelete',
                pageSize: 10,
                forctSelection: true,
                allowBlank: false
   
            }],
            buttons: [{
                iconCls: 'submit',
                itemId: 'submit',
                text: Profile.getText('Submit')
            }]
        });

        me.callParent();
    }

  
});