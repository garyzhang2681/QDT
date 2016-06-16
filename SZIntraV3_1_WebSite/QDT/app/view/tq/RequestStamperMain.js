Ext.define('QDT.view.tq.RequestStamperMain', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tq-requeststampermainpanel',
   
    initComponent: function () {
        var me = this;

        Ext.apply(me, {
          
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'tq-stamperlist',
                flex: 1
            }]
        });
        me.callParent();
    }
});