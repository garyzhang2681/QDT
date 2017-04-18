Ext.define('QDT.store.skill.SkillTrainers', {
    requires: [
        'Asz.model.system.NativeUser'
    ],
    extend: 'Ext.data.Store',
    model: 'Asz.model.system.NativeUser',
    autoDestroy: true,
    proxy: {
        type: 'direct',
        directFn: 'DpSkill.GetSkillTrainers',
        paramOrder: ['skill_code_id', 'step', 'certify_mode'],
        reader: {
            root: 'data'
        }
    }
});