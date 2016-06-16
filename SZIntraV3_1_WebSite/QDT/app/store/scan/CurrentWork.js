Ext.define('QDT.store.scan.CurrentWork', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.scan.CurrentWork',
    requires: [
        'QDT.model.scan.CurrentWork',
        'Ext.data.proxy.Direct',
        'Ext.data.reader.Json'
    ],

    proxy: {
        type: 'direct',
        directFn: 'DpScan.GetMyCurrentWork',
        paramOrder: ['employee_id'],
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});