Ext.define('QDT.store.scan.ScanTransactions', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.scan.Transaction',
    autoDestroy: true,
    proxy: {
        type: 'direct',
        directFn: 'DpScan.GetScanTransactions',
        paramsAsHash: true,
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }
});