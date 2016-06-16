Ext.define('QDT.store.tq.WorkflowActions', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.tq.WorkflowAction',
    autoDestroy: true,
    proxy: {
        type: 'direct',
        directFn: 'DpTq.GetWorkflowActions',
        paramOrder: ['action_target', 'target_id'],
        reader: {
            root: 'data'
        }
    }
});