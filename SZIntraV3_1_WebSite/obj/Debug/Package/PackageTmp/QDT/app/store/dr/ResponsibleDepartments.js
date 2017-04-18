Ext.define('QDT.store.dr.ResponsibleDepartments', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.CommonString',

    proxy: {
        type: 'direct',
        directFn: QDT.GetResponsibleDepartments,
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});