Ext.define('QDT.store.tq.OperationalRestrictions', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.tq.OperationalRestriction',
    autoDestroy: true,
    groupField: 'certification_category',
    proxy: {
        type: 'direct',
        directFn: 'DpTq.GetOperationalRestrictions',
        paramsAsHash: true,
        reader: {
            root: 'data'
        }
    }
});