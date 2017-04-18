Ext.define('QDT.model.ll.Category', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'category',
        { name: 'category_id', mapping: 'id' }
    ]
});