Ext.define('QDT.view.permission.MenuGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.permission-menugrid',
   store:'permission.UserGroupMenus',
    columns: [
        { text: 'menu_id', dataIndex: 'menu_id' },
        { text: 'program_id', dataIndex: 'program_id', flex: 1 },
        { text: 'node_id', dataIndex: 'node_id' },
        { text: 'text_cn', dataIndex: 'text_cn' },
        { text: 'text_en', dataIndex: 'text_en' },
        { text: 'parent_id', dataIndex: 'parent_id' },
        { text: 'leaf', dataIndex: 'leaf' }
    ]
})