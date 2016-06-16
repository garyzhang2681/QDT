Ext.define('QDT.store.tq.WorkflowProcesses', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.tq.WorkflowProcess',
    autoDestroy: true,
 
    proxy: {
        type: 'direct',
        directFn: 'DpTq.GetWorkflowProcesses',
        paramOrder: ['request_id'],
        reader: {
            root: 'data'
        }
    }
});