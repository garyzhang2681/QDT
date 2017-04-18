Ext.define('Asz.store.hr.Employees', {
    extend: 'Ext.data.Store',
    model: 'Asz.model.hr.Employee',
    autoLoad:true,
    proxy: {
        type: 'direct',
        directFn: 'DpUtil.GetEmployees',
        paramsAsHash: true,
        reader: {
            root: 'data'
        }
    }
});