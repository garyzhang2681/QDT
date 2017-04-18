Ext.define('QDT.store.ll.FailureModes', {
    extend:'Ext.data.Store',
    model:'QDT.model.ll.FailureMode',
    proxy: {
        type:'direct',
        directFn:'DpLl.GetFailureModes',
        reader: {
            type:'json',
            root:'data'
        }
    }
})