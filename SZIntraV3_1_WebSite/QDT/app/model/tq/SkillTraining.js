Ext.define('QDT.model.tq.SkillTraining', {
    extend: 'Ext.data.Model',
    requires: [
        'QDT.util.Converter'
    ],
    fields: [
        'request_id',
        'workflow_id',
        'certification_id',
        'certification_item_id',
        'employee_id',
        'local_id',
        'skill_code',
        'start_time',
        'end_time',
        'current_step',
        'current_step_name',
        'current_process_id',
        'due_date',
        'certify_mode',
        'remark', {
            name: 'step0', defaultValue: 0
        }, {
            name: 'step1', defaultValue: 1
        }, {
            name: 'step2', defaultValue: 2
        }, {
            name: 'step3', defaultValue: 3
        }, {
            name: 'step4', defaultValue: 4
        }, {
            name: 'step5', defaultValue: 5
        }],
    idProperty: 'request_id'

});