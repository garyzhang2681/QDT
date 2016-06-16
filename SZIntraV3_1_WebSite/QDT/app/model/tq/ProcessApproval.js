Ext.define('QDT.model.tq.ProcessApproval', {
    extend: 'Ext.data.Model',
    fields: [
        'certification_item',
        { name: 'current_process_id' },
        'request_id',
        'current_process',
        'start_time',
        'due_date',
        'request_for',
        'requestor',
        'process_start_time',
        { name: 'business', defaultValue: '' },
        'category',
        'attachment_quantity'
    ]
});