Ext.define('QDT.store.Employees', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.Employee',
    autoLoad: true,
    remoteSort: true,
    sorters: [
        new Ext.util.Sorter({
            property: 'employee.employee_id',
            direction: 'ASC'
        })],  
    proxy: {
        type: 'direct',
        directFn: 'QDT.GetEmployeesInfo',
        paramsAsHash: true,
        simpleSortMode: true,
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});