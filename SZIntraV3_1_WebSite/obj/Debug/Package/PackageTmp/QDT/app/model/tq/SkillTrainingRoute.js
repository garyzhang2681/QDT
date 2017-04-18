Ext.define('QDT.model.tq.SkillTrainingRoute', {
    extend: 'Ext.data.Model',
    fields: [
        'workflow_id',
        'step',
        'status',
        'name',
        { name: 'allow_custom_approver', type: 'boolean' },
        'approvers'
    ]
});