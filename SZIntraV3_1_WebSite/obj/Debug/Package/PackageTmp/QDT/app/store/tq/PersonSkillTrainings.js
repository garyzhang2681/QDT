Ext.define('QDT.store.tq.PersonSkillTrainings', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.tq.SkillTraining',
    autoLoad: false,
    autoDestroy: true,
    remoteSort: false,
    proxy: {
        type: 'direct',
        directFn: 'DpTq.GetPersonSkillTrainings',
        paramsAsHash: true,
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }
});