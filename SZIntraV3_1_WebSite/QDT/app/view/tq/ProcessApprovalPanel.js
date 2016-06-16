Ext.define('QDT.view.tq.ProcessApprovalPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tq-processapprovalpanel',
    requires: [
        'QDT.view.tq.WorkflowActionGrid',
        'QDT.view.tq.ProcessScanRecordGrid',
        'QDT.view.tq.WorkflowActionGrid',
        'QDT.view.tq.MyProcessApprovalGrid'
    ],

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            border: false,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'tq-myprocessapprovalgrid',
                flex: 1.5
            }, {
                xtype: 'splitter'
            }, {
                flex: 1,
                collapsible: true,
                collapseDirection: 'bottom',
                animCollapse: false,
                header: false,
                xtype: 'panel',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'tq-workflowprocessgrid',
                    flex: 1
                }, {
                    xtype: 'splitter'
                }, {
                    xtype: 'tabpanel',
                    flex: 1,
                    tabPosition: 'bottom',
                    items: [{
                        title: Profile.getText('ScanRecords'),
                        xtype: 'tq-processscanrecordgrid'
                    }, {
                        title: Profile.getText('ProcessOperatingRecords'),
                        xtype: 'tq-workflowactiongrid'
                    }]
                }]
            }]
        });

        me.callParent();
    }
});