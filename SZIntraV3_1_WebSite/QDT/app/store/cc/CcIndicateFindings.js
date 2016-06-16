Ext.define('QDT.store.cc.CcIndicateFindings', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.CommonString',
    autoLoad: true,
    proxy: {
        type: 'direct',
        directFn: DpCc.GetCcIndicateFindings,
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});