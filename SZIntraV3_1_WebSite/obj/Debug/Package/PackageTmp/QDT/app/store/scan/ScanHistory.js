Ext.define('QDT.store.scan.ScanHistory', {
    extend: 'Ext.data.Store',

    requires: [
        'QDT.model.scan.Transaction',
        'Ext.data.proxy.Direct',
        'Ext.data.reader.Json'
    ],

    constructor: function (cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'QDT.model.scan.Transaction',
            storeId: 'scan.ScanHistory',
            proxy: {
                type: 'direct',
                directFn: 'DpScan.GetScanHistory',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }
        }, cfg)]);
    }
});