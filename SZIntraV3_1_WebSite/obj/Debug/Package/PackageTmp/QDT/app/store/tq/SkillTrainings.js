Ext.define('QDT.store.tq.SkillTrainings', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.tq.SkillTraining',
    pageSize: 50,
    autoLoad: false,
    autoDestroy: true,
    remoteSort: true,
    sorters: [{
        property: 'certification_id',
        direction: 'ASC'
    }],
    proxy: {
        type: 'direct',
        directFn: 'DpTq.GetSkillTrainings',
        simpleSortMode: true,
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }
});