Ext.define('QDT.store.tq.StandardSkillTrainingRoutes', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.tq.SkillTrainingRoute',
    autoDestroy: true,
    proxy: {
        type: 'direct',
        directFn: 'DpTq.GetStandardSkillTrainingRoutes',
        paramOrder: ['skill_code_id', 'is_direct_certification', 'is_npi_direct_certification', 'is_refresh_training'],
        reader: {
            root: 'data'
        }
    }
});