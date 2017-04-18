Ext.define('QDT.store.tq.CertificationItems', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.tq.CertificationItem',
    autoDestroy: true,
    proxy: {
        type: 'direct',
        directFn: 'DpTq.GetCertificationItems',
        paramsAsHash: true,
        reader: {
            root: 'data'
        }
    }
});