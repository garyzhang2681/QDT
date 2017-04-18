Ext.define('QDT.model.tq.OperationalRestriction', {
    extend: 'Ext.data.Model',
    fields: [
        'item',
        'oper_num',
        'operation_id',
        'work_type',
        'certification_category',
        'certification_item_id',
        'certification_item',
        'row_pointer'
    ],
    idProperty: 'row_pointer'
});