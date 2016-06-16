Ext.define('QDT.model.tq.StamperList', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'category',
            mapping: 'a.category'
        },
        {
            name: 'employee_id',
            mapping: 'a.employee_id'

        },
         {
             name: 'requestor',
             mapping: 'requestor'

         },
        {
            name: 'certification_item',
            mapping: 'a.certification_item'
        },
        {
            name: 'certification_item_id',
            mapping: 'a.certification_item_id'
        },
        {
            name: 'request_id',
            mapping: 'a.request_id'
        },
        {
            name: 'issue_date',
            mapping: 'a.issue_date'
        },
        {
            name: 'refresh_date',
            mapping: 'a.refresh_date'
        },
        {
            name: 'expire_date',
            mapping: 'a.expire_date'
        },
        {
            name: 'status',
            mapping: 'a.status'
        },
        {
            name: 'certify_mode',
            mapping: 'a.certify_mode'
        },
        {
            name: 'is_trainer',
            mapping: 'a.is_trainer'
        },
        {
            name: 'remark',
            mapping: 'a.remark'
        },
        {
            name: 'a.attachment'

        }
    ]
});
