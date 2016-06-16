Ext.define('QDT.store.scan.ScanTypes', {
    extend: 'Ext.data.Store',

    requires: [
        'QDT.model.scan.ScanType',
        'Ext.data.proxy.Direct',
        'Ext.data.reader.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'QDT.model.scan.ScanType',
            storeId: 'scan.ScanTypes',
            proxy: {
                type: 'direct',
                directFn: 'DpScan.GetScanType',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }
        }, cfg)]);
    }
});