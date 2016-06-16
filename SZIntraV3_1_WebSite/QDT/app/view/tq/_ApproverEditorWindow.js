Ext.define('QDT.view.tq.ApproverEditorWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.tq-approvereditorwindow',
    autoShow: true,
    constrainHeader: true,
    width: 300,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    requestId: null,

    initComponent: function () {
        var me = this,
            processGrid,
            approverGrid;

        approverGrid = Ext.widget('grid', {
            height: 180,
            hideHeaders: true,
            store: Ext.create('Ext.data.DirectStore', {
                directFn: 'DpTq.GetProcessApprovers',
                root: 'data',
                paramOrder: ['id'],
                model: 'QDT.model.repository.Employee'
            }),
            columns: [{
                dataIndex: 'local_id', flex: 1
            }, {
                dataIndex: 'name', flex: 1
            }, {
                xtype: 'actioncolumn', items: [{
                    iconCls: 'remove',
                    handler: function (view, rowIndex, colIndex, item, e, record) {
                        console.log('delete approver ' + record.data.local_id);
                    }
                }]
            }],

            bbar: {
                xtype: 'statusbar',
                itemId: 'status-bar'
            }
        });
        processGrid = Ext.widget('grid', {
            height: 180,
            hideHeader: true,
            //TODO: process store
            //            store: Ext.create('Ext.data.Store'),
            selModel: 'checkboxmodel',
            columns: [{
                dataIndex: 'name', flex: 2
            }, {
                dataIndex: 'status', flex: 1
            }],
            listeners: {
                itemclick: function (cmp) {
                    approverGrid.getStore().removeAll();
                    if (cmp.getSelectionModel().getSelection().length > 1) {
                        approverGrid.getComponent('status-bar').setStatus({
                            iconCls: 'warning',
                            text: Profile.getText('txtPreviewNotAvailable')
                        });
                    }
                }
            }
        });

        Ext.apply(me, {
            items: [processGrid, approverGrid]
        });


        me.callParent();
    }
});