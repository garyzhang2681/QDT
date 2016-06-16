Ext.define('QDT.store.inspection.Projects', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.inspection.Project',


    proxy: {
        type: 'direct',
        directFn: DpInspection.GetProject,
        reader: {
            type:'json',
            root:'data'
        }
    }
});