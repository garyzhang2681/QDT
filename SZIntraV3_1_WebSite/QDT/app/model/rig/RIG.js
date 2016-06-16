Ext.define('QDT.model.rig.RIG', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'rig_num',
            mapping: 'rig_num'
        },
        {
            name: 'rig_line',
            mapping: 'rig_line'

        },
        {
            name: 'vendor_num',
            mapping: 'vendor_num'
        },
        {
            name: 'part_num',
            mapping: 'part_num'
        },
        {
            name: 'liability',
            mapping: 'liability'
        },
        {
            name: 'status',
            mapping: 'status'
        },
        {
            name: 'serial_lot',
            mapping: 'serial_lot'
        },
        {
            name: 'defect_desc',
            mapping: 'defect_desc'
        },
        {
            name: 'po_num',
            mapping: 'po_num'
        },
        {
            name: 'coc_num',
            mapping: 'coc_num'
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
            name: 'part_desc',
            mapping: 'part_desc'
        },
        {
            name: 'drawing_num',
            mapping: 'drawing_num'
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
            name: 'due_date',
            mapping: 'due_date'
        },
        {
            name: 'goods_receive_date',
            mapping: 'goods_receive_date'
        },
        {
            name: 'po_line',
            mapping: 'po_line'
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
            name: 'create_by_' + Profile.getLang(),
            mapping: 'create_by_' + Profile.getLang()
        },
        {
            name: 'quanlity_escape_' + Profile.getLang(),
            mapping: 'quanlity_escape_' + Profile.getLang()
        },
        {
            name: 'dr_num',
            mapping: 'dr_num'
        }
    ]
});
