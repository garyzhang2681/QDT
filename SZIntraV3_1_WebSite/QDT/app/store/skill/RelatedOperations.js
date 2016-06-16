Ext.define('QDT.store.skill.RelatedOperations', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.op.Operation',
    autoDestroy: true,
    proxy: {
        type: 'direct',
        paramOrder: [
            'skill_code_id'
        ],
        directFn: 'DpSkill.GetSkillRelatedOperations',
        reader: {
            root: 'data'
        }
    }
});