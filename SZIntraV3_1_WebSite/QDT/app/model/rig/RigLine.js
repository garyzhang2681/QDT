Ext.define('QDT.model.rig.RigLine', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'serial_lot',
            mapping: 'serial_lot'
        }, {
            name: 'part_num',
            mapping: 'part_num'
        },
        {
            name: 'part_desc',
            mapping: 'part_desc'
        },
        {
            name: 'vendor_num',
            mapping: 'vendor_num'
        },
        {
            name: 'grn_num',
            mapping: 'grn_num'
        },
        {
            name: 'grn_line',
            mapping: 'grn_line'
        },
        {
            name: 'coc_num',
            mapping: 'coc_num'
        },
        {
            name: 'drawing_num',
            mapping: 'drawing_num'
        },
        {
            name: 'qty_received',
            mapping: 'qty_received'
        },
        {
            name: 'qty_rejected',
            mapping: 'qty_rejected'
        },
        {
            name: 'liability',
            mapping: 'liability'
        },
        {
            name: 'goods_returned_for',
            mapping: 'goods_returned_for'
        },
        {
            name: 'quanlity_escape',
            mapping: 'quanlity_escape'
        },
        {
            name: 'create_date',
            mapping: 'create_date'
        },
        {
            name: 'create_by_name',
            mapping: 'create_by_name'
        },
        {
            name: 'due_date',
            mapping: 'due_date'
        },
        {
            name: 'problem_description',
            mapping: 'problem_description'
        },
        {
            name: 'dr_num',
            mapping: 'dr_num'
        },
        {
            name: 'po_num',
            mapping: 'po_num'
        },
        {
            name: 'po_line',
            mapping: 'po_line'
        },
        {
            name: 'received_date',
            mapping: 'received_date'
        }
    ]
});
