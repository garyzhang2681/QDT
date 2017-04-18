Ext.define('QDT.view.rig.RigGraphicShow', {
    extend: 'Ext.chart.Chart',
    alias: 'widget.riggraphicshow',
    style: 'background:#fff',
    animate: true,
    shadow: true,
    minHeight: 400,
    legend: {
        position: 'right'
    },
    store: 'QDT.store.rig.RigGraphics',
    axes: [
        {
            type: 'Numeric',
            position: 'left',
            fields: ['Total RIG Add', 'Total QEM', 'Base Line', 'Total RIG(YTD)', 'Total QEM(YTD)', 'RIG Open Overdue', 'RIG Open'],
            label: {
                renderer: Ext.util.Format.numberRenderer('0,0')
            },
            title: 'Quantity',
            grid: true,
            minimum: 0
        }, {
            type: 'Category',
            position: 'bottom',
            fields: ['week'],
            title: 'Week'
        }
    ],
    series: [
        {
            type: 'column',
            axis: 'left',
            highlight: true,
            label: {
                display: 'insideEnd',
                'text-anchor': 'middle',
                field: ['Total RIG Add', 'Total QEM'],
                renderer: Ext.util.Format.numberRenderer('0'),
                orientation: 'vertical',
                color: '#333'
            },
            xField: 'week',
            yField: ['Total RIG Add', 'Total QEM']

        },
        {
            type: 'line',
            xField: 'week',
            yField: ['Base Line'],
            axis: 'left',
            highlight: true,
            showMarkers: false
        },
        {
            type: 'line',
            xField: 'week',
            yField: ['Total RIG(YTD)'],
            axis: 'left',
            highlight: true,
            showMarkers: true,
            tips: {
                trackMouse: true,
                width: 140,
                height: 28,
                renderer: function(storeItem, item) {
                    this.setTitle('Week ' + storeItem.get('week') + ': ' + storeItem.get('Total RIG(YTD)'));
                }
            }
        },
        {
            type: 'line',
            xField: 'week',
            yField: ['Total QEM(YTD)'],
            axis: 'left',
            highlight: true,
            showMarkers: true,
            tips: {
                trackMouse: true,
                width: 140,
                height: 28,
                renderer: function(storeItem, item) {
                    this.setTitle('Week ' + storeItem.get('week') + ': ' + storeItem.get('Total QEM(YTD)'));
                }
            }

        },
        {
            type: 'line',
            xField: 'week',
            yField: ['RIG Open'],
            axis: 'left',
            highlight: true,
            showMarkers: true,
            tips: {
                trackMouse: true,
                width: 140,
                height: 28,
                renderer: function(storeItem, item) {
                    this.setTitle('Week ' + storeItem.get('week') + ': ' + storeItem.get('RIG Open'));
                }
            }

        },
        {
            type: 'line',
            xField: 'week',
            yField: ['RIG Open Overdue'],
            axis: 'left',
            highlight: true,
            showMarkers: true,
            tips: {
                trackMouse: true,
                width: 140,
                height: 28,
                renderer: function(storeItem, item) {
                    this.setTitle('Week ' + storeItem.get('week') + ': ' + storeItem.get('RIG Open Overdue'));
                }
            }

        }
    ]
});