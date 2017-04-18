Ext.define('QDT.model.permission.Menu', {
    extend:'Ext.data.Model',
    fields: [
        'menu_id',
        'program_id',
        'node_id',
        'text_cn',
        'text_en',
        'parent_id',
        'leaf'
    ]


});