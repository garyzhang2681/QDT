Ext.define('QDT.store.tq.ProcessScanRecords', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.scan.Transaction',
    autoDestroy: true,
    proxy: {
        type: 'direct',
        directFn: 'DpTq.GetProcessScanRecords',
        paramOrder: ['process_id'],
        reader: {
            root: 'data'
        }
    }
});