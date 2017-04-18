Ext.define('QDT.model.rig.RigGraphic', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'week',
            mapping: 'week'

        },
        {
            name: 'Total RIG Add',
            mapping: 'total_rig'

        },
        {
            name: 'Total RIG(YTD)',
            mapping: 'total_ytd'

        },
        {
            name: 'Total QEM',
            mapping: 'total_qem'

        },
        {
            name: 'Total QEM(YTD)',
            mapping: 'total_qem_ytd'

        },
        {
            name: 'Base Line',
            mapping: 'base_line'

        },
        {
            name: 'RIG Open Overdue',
            mapping: 'rig_open_overdue'

        },
        {
            name: 'RIG Open',
            mapping: 'rig_open'

        }
    ]
});