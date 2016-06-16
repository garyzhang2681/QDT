Ext.define('QDT.view.cc.CcPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.cc-ccpanel',
    requires: [
        'QDT.view.cc.CcList',
        'QDT.view.cc.CcDetail'
    ],

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            title: Profile.getText('CustomerComplain'),
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'cc-cclist',
                flex: 1
            }, {
                xtype: 'splitter'
            }, {
                xtype: 'cc-ccdetail',
                minWidth: 300,
                width: 320,
                header: false,
                collapsible: true,
                collapseDirection: 'right',
                animCollapse: false
            }]
        });
        me.callParent();
    }
});