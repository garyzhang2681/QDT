Ext.define('QDT.store.scan.JobOperations', {
    extend: 'Ext.data.Store',
    fields: [
        'oper_num'
    ],
    autoDestroy: true,
    proxy: {
        type: 'direct',
        paramOrder: ['job', 'suffix'],
        directFn: 'DpScan.GetJobOperationNumbers',
        reader: {
            root: 'data'
        }
    }
});