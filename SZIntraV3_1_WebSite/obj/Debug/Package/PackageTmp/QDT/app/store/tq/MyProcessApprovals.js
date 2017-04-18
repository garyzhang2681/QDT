Ext.define('QDT.store.tq.MyProcessApprovals', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.tq.ProcessApproval',
    autoDestroy: true,
    autoLoad:true,
    proxy: {
        type: 'direct',
        directFn: 'DpTq.GetUserProcessApprovals',
        reader: {
            root: 'data'
        }
    }
});