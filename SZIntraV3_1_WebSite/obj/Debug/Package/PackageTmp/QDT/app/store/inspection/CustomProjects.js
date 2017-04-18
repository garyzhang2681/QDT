Ext.define('QDT.store.inspection.CustomProjects', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.inspection.CustomProject',

    proxy: {
        type: 'direct',
        directFn: 'DpInspection.GetProject',
        reader: {
            type: 'json',
            root: 'data'
        }
    }

});