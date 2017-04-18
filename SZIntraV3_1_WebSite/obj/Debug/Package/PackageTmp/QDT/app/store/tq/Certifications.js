Ext.define('QDT.store.tq.Certifications', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.tq.Certification',
    proxy: {
        type: 'direct',
        directFn: 'DpTq.GetStcCertifications',
        paramsAsHash:true,
        reader: {
            root: 'data'
        }
    }
});