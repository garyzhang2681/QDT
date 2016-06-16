Ext.define('QDT.view.tq.WorkflowActionGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.tq-workflowactiongrid',
    requires: [
        'QDT.store.tq.WorkflowActions'
    ],

    initComponent: function () {
        var me = this,
            store = Ext.create('QDT.store.tq.WorkflowActions');

        Ext.apply(me, {
            store: store,
            columns: [{
                dataIndex: 'process_action', text: Profile.getText('process_action'), width: 100, renderer: QDT.util.Renderer.workflowAction
            }, {
                dataIndex: 'handler', text: Profile.getText('handler'), width: 80, renderer: QDT.util.Renderer.username
            }, {
                dataIndex: 'process_time', text: Profile.getText('process_time'), width: 80, renderer: QDT.util.Renderer.dateTimeRenderer
            }, {
                dataIndex: 'remark', text: Profile.getText('remark'), flex: 1
            }]
        });



        me.callParent();
    }
});