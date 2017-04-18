Ext.define('QDT.view.tq.MyTrainingPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tq-mytrainingpanel',

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            border: false,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                flex: 1,
                xtype: 'panel',
                html: 'skill training'
            }, {
                flex: 1,
                xtype: 'panel',
                html: 'lesson training'
            }]
        });

        me.callParent();
    }
});