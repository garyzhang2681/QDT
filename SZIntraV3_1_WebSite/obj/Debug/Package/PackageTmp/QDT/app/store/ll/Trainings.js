Ext.define('QDT.store.ll.Trainings', {
    extend: 'Ext.data.Store',
    model:'QDT.model.ll.Training',
    pageSize: 20,
    proxy: {
        type:'direct',
        directFn: 'DpLl.GetLlTrainings',
        paramsAsHash: true,
        reader: {
            root:'data'
        }
    }
});