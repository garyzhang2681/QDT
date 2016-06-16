Ext.define('QDT.store.tq.SkillTrainingRoutes', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.tq.SkillTrainingRoute',
    autoDestroy: true,
    proxy: {
        type: 'direct',
        directFn: 'DpTq.GetSkillTrainingRoutes',
        paramOrder: ['request_id'],
        reader: {
            root: 'data'
        }
    }
});