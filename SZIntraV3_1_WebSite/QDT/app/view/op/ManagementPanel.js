Ext.define('QDT.view.op.ManagementPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.op-managementpanel',
    requires: [
        'QDT.view.op.OperationGrid'
    ],

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'op-operationgrid',
                minWidth: 420,
                flex: 3,
                 selType: 'checkboxmodel'
            }, {
                xtype: 'splitter'
            }, {
                xtype: 'tq-operationalrestrictiongrid',
                title: Profile.getText('OperationalRestriction'),
                collapsible: true,
                collapsed: false,
                collapseDirection: 'right',
                animCollapse: false,
                minWidth: 320,
                flex: 2
            }]

        });

        me.callParent();
    }
});