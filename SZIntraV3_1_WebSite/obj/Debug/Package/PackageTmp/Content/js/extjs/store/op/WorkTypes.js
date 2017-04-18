Ext.define('Asz.store.op.WorkTypes', {
    extend: 'Ext.data.Store',
    model: 'Asz.model.op.WorkType',
    autoLoad: true,
    data: [{
        work_type: 'run'
    }, {
        work_type: 'qa'
    }, {
        work_type: 'whs'
    }],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json'
        }
    }
});