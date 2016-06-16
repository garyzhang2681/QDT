Ext.define('QDT.store.scan.MyCurrentWork', {
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
            storeId: 'scan.MyCurrentWork',
            proxy: {
                type: 'direct',
                paramOrder: ['employee_id'],
                directFn: 'DpScan.GetMyCurrentWork',
                reader: {
                    type: 'json',
                    root: 'data'
                }
            }
        }, cfg)]);
    }
});