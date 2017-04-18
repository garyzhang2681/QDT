Ext.define('QDT.model.skill.SkillCode', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
 'skill_code_id',
        'skill_code',
        'category',
        { name: 'critical', type: 'boolean' },
        'description',
        'business',
        'work_type',
        'effective_time',
        'learning_time',
        'invalid_time',
        'is_special_skill',
        'is_deleted',
        'workflow_type'
    ]
});