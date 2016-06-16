Ext.define('QDT.store.ll.WorkingGroups', {
    extend:'Ext.data.Store',
    model:'QDT.model.ll.WorkingGroup',
    proxy: {
        type:'direct',
        directFn:'DpLl.GetWorkingGroup',
        reader: {
            type: 'json',
            root:'data'
        }
    }
});