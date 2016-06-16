/*global _comma_separated_list_of_variables_*/
Ext.define('QDT.model.ll.Lesson', {
    extend: 'Ext.data.Model',
    requires: [
        'Asz.util.UserProfile'
    ],
    fields: [
        'id',
        'category_id',
        'subject',
        'detail',
        'owner_id',
        'business',
        'restrict_all',
        'create_date',
        'create_by',
        'working_group',
        'effective_time',
        'status',
        'skill_code_binding_mode',
        'learning_cycle',
        'failure_mode',
        'attachment_quantity',
        {
            name: 'detail_title', convert: function (v, record) {
                return Profile.getText('Lessons') + ' - ' + record.data.id;
            }
        }
    ]
});