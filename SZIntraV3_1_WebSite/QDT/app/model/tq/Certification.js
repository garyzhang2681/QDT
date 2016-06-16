Ext.define('QDT.model.tq.Certification', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'category',
        'employee_id',
        'certification_item',
        'request_id',
        'issue_date',
        'refresh_date',
        'expire_date',
        'status',
        'certify_mode',
        { name: 'is_trainer', type: 'boolean', useNull: true },
        'remark'
    ]
});