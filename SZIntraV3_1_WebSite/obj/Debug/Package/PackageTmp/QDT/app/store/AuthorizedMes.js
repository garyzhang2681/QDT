Ext.define('QDT.store.AuthorizedMes', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.Employee',
    remoteSort: true,
    sorters: [
        new Ext.util.Sorter({
            property: 'employee.employee_id',
            direction: 'ASC'
        })],  

    proxy: {
        type:'direct',
        directFn: 'QDT.GetAuthorizedMes',
        paramsAsHash: true,
        simpleSortMode: true,
        reader:{
            type:'json',
            root:'data'
        }
    }
});