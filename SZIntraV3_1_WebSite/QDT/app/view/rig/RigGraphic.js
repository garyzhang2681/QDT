Ext.define('QDT.view.rig.RigGraphic', {
    extend: 'Ext.window.Window',
    title: '图表',
    alias: 'widget.riggraphic',
    width: 800,
    height: 578,
    minHeight: 400,
    minWidth: 550,
    hidden: false,
    maximizable: true,
    autoShow: true,
    layout: 'anchor',
    autoScroll: true,
    items: [
        {
            xtype: 'riggraphicshow',
            anchor: '100%'
        },
        {
            xtype: 'grid',
            anchor: '100%',
            store: 'QDT.store.rig.RigGraphics',
            columns: [
                {
                    dataIndex: 'week',
                    text: 'week'

                },
                {
                    dataIndex: 'Total RIG Add',
                    text: 'Total RIG Add'

                },
                {
                    dataIndex: 'Total RIG(YTD)',
                    text: 'Total RIG(YTD)'

                },
                {
                    dataIndex: 'Total QEM',
                    text: 'Total QEM'

                },
                {
                    dataIndex: 'Total QEM(YTD)',
                    text: 'Total QEM(YTD)'

                },
                {
                    dataIndex: 'Base Line',
                    text: 'Base Line'

                },
                {
                    dataIndex: 'RIG Open Overdue',
                    text: 'RIG Open Overdue'

                },
                {
                    dataIndex: 'RIG Open',
                    text: 'RIG Open'

                }
            ]

        }
    ],
    tbar: [
        {
            xtype: 'button',
            text: '保存图表',
            iconCls: 'down',
            handler: function() {
                var me = this;

                cq.query('riggraphicshow')[0].save({
                    type: 'image/png'


                });


            }

        }
    ],

    initComponent: function() {
        var me = this;
        me.callParent();

    }
});