Ext.define('QDT.store.ll.Categories', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.ll.Category',
    proxy: {
        type: 'direct',
        directFn:'DpLl.GetCategories',
        reader:{
            root:'data'
        }
    }
});