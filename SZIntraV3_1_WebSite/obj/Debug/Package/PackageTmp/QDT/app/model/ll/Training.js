Ext.define('QDT.model.ll.Training', {
    extend: 'Ext.data.Model',
    requires: [
        'Asz.util.UserProfile'
    ],
    fields: [
        { name: 'certification_id' },
        { name: 'lesson_id' },
        { name: 'request_id' },
        { name: 'employee_id' },
        { name: 'current_process_id' },
        { name: 'subject' },
        { name: 'detail' },
        { name: 'category_id' },
        { name: 'business' },
        { name: 'start_time' },
        {name:'due_date'},
        { name: 'requestor' },
        { name: 'owner_id' },
        { name: 'restrict_all' },
        { name: 'working_group' },
        { name: 'effective_time' },
        { name: 'status' },
        { name: 'current_step' },
        { name: 'current_step_name' },
        { name: 'current_approvers' },
        { name: 'attachment_quantity' }
        ]
})