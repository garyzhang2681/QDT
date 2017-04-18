Ext.define('QDT.store.ll.Lessons', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.ll.Lesson',
    pageSize: 20,
    proxy: {
        type: 'direct',
        directFn: 'DpLl.GetLessons',
        paramsAsHash: true,
        reader: {
            type: 'json',
            root: 'data',
            totalProperty:'total'
        }
    }
});
