/*
* File: app/view/ird/SPC.js
*
* This file was generated by Sencha Architect version 3.0.4.
* http://www.sencha.com/products/architect/
*
* This file requires use of the Ext JS 4.2.x library, under independent license.
* License of Sencha Architect does not include license for Ext JS 4.2.x. For more
* details see http://www.sencha.com/license or contact license@sencha.com.
*
* This file will be auto-generated each and everytime you save your project.
*
* Do NOT hand edit this file.
*/

Ext.define('QDT.view.ird.SPC', {
    extend: 'Ext.window.Window',
    alias: 'widget.ird_spc',

    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Ext.form.field.Date',
        'Ext.form.field.Time',
        'Ext.button.Button',
        'Ext.chart.Chart',
        'Ext.chart.axis.Category',
        'Ext.chart.axis.Numeric',
        'Ext.chart.series.Line'
    ],

    height: 489,
    width: 750,
    title: 'SPC(Statistic Process Control)',
    modal: true,
    closeAction: 'hide',
    listeners: {
        hide: function () {
            //TODO: no animation(I do not know why)
            Ext.ComponentQuery.query('ird_spc')[0].hide(cq.query('ird')[0].down('button[name=spc]'));
        }
    },

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    initComponent: function () {
        var me = this;


        //     var chart_store = Ext.create('QDT.store.ird.SpcRecords');
        var chart_store = Ext.create('Ext.data.JsonStore', { fields: ['$id', 'rec_maximum', 'rec_minimum', 'rec_value', 'rec_passed', 'max_max_value', 'min_min_value', 'max_value', 'min_value', 'line1', 'line2', 'line3', 'line4', 'line5', 'line6', 'line7']
            //            fields: ['$id', 'serial', 'job', 'suffix', 'item', 'oper_num', 'characteristic', 'basic_rec_type', 'trans_num', 'ird_route_id', 'inspect_type', 'char_id', 'record_by', 'record_date', 'rec_maximum', 'rec_minimum', 'rec_value', 'rec_passed', 'user_id', 'sso', 'name_cn', 'name_en', 'login_pwd', 'account_status']
        });

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'form',
                    frame: true,
                    bodyPadding: 10,
                    manageHeight: false,
                    title: '',
                    name: 'spc_form',
                    //                    api: {
                    //                        submit: DpIrd.GetSpc
                    //                    },
                    items: [
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    margins: '',
                                    margin: '5 10 5 5',
                                    flex: 4,
                                    fieldLabel: 'Part Num',
                                    labelWidth: 60,
                                    name: 'part_num',
                                    value: '17A190-605P03'
                                },
                                {
                                    xtype: 'textfield',
                                    margin: '5 10 5 5',
                                    flex: 3,
                                    fieldLabel: 'Operation Num',
                                    labelWidth: 90,
                                    name: 'oper_num',
                                    value: '10'

                                },
                                {
                                    xtype: 'textfield',
                                    margin: '5 5 5 5',
                                    flex: 3,
                                    fieldLabel: 'Char. Num',
                                    labelWidth: 70,
                                    name: 'char_num',
                                    value: '20.1'
                                },
                                {
                                    xtype: 'combobox',
                                    name: 'fml_mark',
                                    fieldLabel: '请选择',
                                    labelWidth: 40,
                                    flex: 3,
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['fml_mark', 'value'],
                                        data: [{
                                            'fml_mark': Profile.getText('Others'), 'value': 'others'
                                        }, {
                                            'fml_mark': Profile.getText('First'), 'value': 'first'
                                        }, {
                                            'fml_mark': Profile.getText('Middle'), 'value': 'middle'
                                        }, {
                                            'fml_mark': Profile.getText('Last'), 'value': 'last'
                                        }]
                                    }),
                                    queryMode: 'local',
                                    displayField: 'fml_mark',
                                    valueField: 'value',
                                    editable: false,
                                    value: 'others'
                                }, {
                                    xtype: 'combobox',
                                    name: 'inspection_type',
                                    fieldLabel: '请选择',
                                    labelWidth: 40,
                                    flex: 3,
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['inspection_type_name', 'inspection_type'],
                                        data: [{
                                            'inspection_type_name': 'Operator', 'inspection_type': '0'
                                        }, {
                                            'inspection_type_name': 'Inspector', 'inspection_type': '1'
                                        }]
                                    }),
                                    queryMode: 'local',
                                    displayField: 'inspection_type_name',
                                    valueField: 'inspection_type',
                                    editable: false,
                                    value: '0'

                                }
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [
                                {
                                    xtype: 'fieldset',
                                    flex: 1,
                                    title: '开始时间',
                                    margin: '5 5 5 5',
                                    items: [
                                        {
                                            xtype: 'datefield',
                                            anchor: '100%',
                                            fieldLabel: '日期',
                                            name: 'start_date',
                                            value: Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.MONTH, -3), 'Y-m-d')
                                        },
                                        {
                                            xtype: 'timefield',
                                            anchor: '100%',
                                            fieldLabel: '时间',
                                            name: 'start_time',
                                            value: '00:01'
                                        }
                                    ]
                                },
                                {
                                    xtype: 'fieldset',
                                    flex: 1,
                                    title: '结束时间',
                                    margin: '5 5 5 5',
                                    items: [
                                        {
                                            xtype: 'datefield',
                                            anchor: '100%',
                                            fieldLabel: '日期',
                                            name: 'end_date',
                                            value: Ext.Date.format(new Date(), 'Y-m-d')
                                        },
                                        {
                                            xtype: 'timefield',
                                            anchor: '100%',
                                            fieldLabel: '时间',
                                            name: 'end_time',
                                            value: '23:59'
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    dockedItems: [
                        {
                            xtype: 'container',
                            dock: 'bottom',
                            margin: '0 5 0 5',
                            width: 150,
                            layout: {
                                type: 'hbox',
                                align: 'stretch',
                                pack: 'end'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    name: 'export',
                                    margin: '5 5 5 5',
                                    text: '导出Excel'
                                },
                                {
                                    xtype: 'button',
                                    name: 'reset',
                                    margin: '5 5 5 5',
                                    text: '重置'
                                },
                                {
                                    xtype: 'button',
                                    name: 'submit',
                                    margin: '5 5 5 5',
                                    text: '提交'
                                }
                            ]
                        }
                    ]
                },
                {

                    xtype: 'chart',
                    height: 300,
                    width: 400,
                    animate: true,
                    legend: {
                        position: 'right'
                    },
                    insetPadding: 20,
                    store: chart_store,
                    name: 'spc_chart',
                    axes: [
                        {
                            type: 'Category',
                            fields: [
                                '$id'
                            ],
                            title: '零件',
                            position: 'bottom'

                        },
                        {
                            type: 'Numeric',
                            fields: [
                                'rec_minimum',
                                'rec_maximum',
                                'rec_value',
                                'rec_passed'
                            ],
                            majorTickSteps: 10,
                            minorTickSteps: 4,
                            decimals: 4,
                            title: '公差',
                            position: 'left'
                        }
                    ],
                    series: [{
                        type: 'line',
                        axis: 'left',
                        xField: '$id',
                        yField: 'rec_value',
                        recordType: 'value',
                        title: Profile.getText('record_value'),
                        showMarkers: true,
                        highlight: {
                            size: 6,
                            radius: 6
                        },
                        tips: {
                            trackMouse: true,
                            width: 100,
                            height: 28,
                            renderer: function (storeItem, item) {
                                this.setTitle(storeItem.data['$id'] + ':  ' + storeItem.data['rec_value']);
                            }
                        },
                        markerConfig: {
                            type: 'cross',
                            size: 4,
                            radius: 4,
                            'stroke-width': 0
                        }
                    }, {
                        type: 'line',
                        axis: 'left',
                        xField: '$id',
                        yField: 'rec_minimum',
                        recordType: 'range',
                        title: Profile.getText('rec_minimum'),
                        showMarkers: true,
                        highlight: {
                            size: 6,
                            radius: 6
                        },
                        tips: {
                            trackMouse: true,
                            width: 100,
                            height: 28,
                            renderer: function (storeItem, item) {
                                this.setTitle(storeItem.data['$id'] + ':  ' + storeItem.data['rec_minimum']);
                            }
                        },
                        markerConfig: {
                            type: 'cross',
                            size: 4,
                            radius: 4,
                            'stroke-width': 0
                        }
                    }, {
                        type: 'line',
                        axis: 'left',
                        xField: '$id',
                        yField: 'rec_maximum',

                        recordType: 'range',
                        title: Profile.getText('rec_maximum'),
                        showMarkers: true,
                        highlight: {
                            size: 6,
                            radius: 6
                        },
                        tips: {
                            trackMouse: true,
                            width: 100,
                            height: 28,
                            renderer: function (storeItem, item) {
                                this.setTitle(storeItem.data['$id'] + ':  ' + storeItem.data['rec_maximum']);
                            }
                        },
                        markerConfig: {
                            type: 'cross',
                            size: 4,
                            radius: 4,
                            'stroke-width': 0
                        }
                    }, {
                        type: 'line',
                        axis: 'left',
                        xField: '$id',
                        yField: 'rec_passed',
                        recordType: 'pass',
                        title: Profile.getText('rec_passed'),
                        showMarkers: true,
                        highlight: {
                            size: 6,
                            radius: 6
                        },
                        tips: {
                            trackMouse: true,
                            width: 100,
                            height: 28,
                            renderer: function (storeItem, item) {
                                this.setTitle(storeItem.data['$id'] + ':  ' + storeItem.data['rec_passed']);
                            }
                        },
                        markerConfig: {
                            type: 'cross',
                            size: 4,
                            radius: 4,
                            'stroke-width': 0
                        }
                    }, {
                        type: 'line',
                        axis: 'left',
                        xField: '$id',
                        yField: 'line1',
                        recordType: 'threshold',
                        markerConfig: {
                            type: 'circle',
                            radius: 0
                        },
                        style: {
                            stroke: '#ffffff',
                            'stroke-width': 1,
                            'stroke-dasharray': 10,
                            opacity: 0.8
                        }
                    }, {
                        type: 'line',
                        axis: 'left',
                        xField: '$id',
                        yField: 'line2',
                        recordType: 'threshold',
                        markerConfig: {
                            type: 'circle',
                            radius: 0
                        },
                        style: {
                            stroke: '#ff0000',
                            'stroke-width': 1

                        }
                    }, {
                        type: 'line',
                        axis: 'left',
                        xField: '$id',
                        yField: 'line3',
                        recordType: 'threshold',
                        markerConfig: {
                            type: 'circle',
                            radius: 0
                        },
                        style: {
                            stroke: '#ffff00',
                            'stroke-width': 1
                        }
                    }, {
                        type: 'line',
                        axis: 'left',
                        xField: '$id',
                        yField: 'line4',
                        recordType: 'threshold',
                        markerConfig: {
                            type: 'circle',
                            radius: 0
                        },
                        style: {
                            stroke: '#cccccc',
                            'stroke-width': 1
                        }
                    }, {
                        type: 'line',
                        axis: 'left',
                        xField: '$id',
                        yField: 'line5',
                        recordType: 'threshold',
                        markerConfig: {
                            type: 'circle',
                            radius: 0
                        },
                        style: {
                            stroke: '#ffff00',
                            'stroke-width': 1
                        }
                    }, {
                        type: 'line',
                        axis: 'left',
                        xField: '$id',
                        yField: 'line6',
                        recordType: 'threshold',
                        markerConfig: {
                            type: 'circle',
                            radius: 0
                        },
                        style: {
                            stroke: '#ff0000',
                            'stroke-width': 1
                        }
                    }, {
                        type: 'line',
                        axis: 'left',
                        xField: '$id',
                        yField: 'line7',
                        recordType: 'threshold',
                        markerConfig: {
                            type: 'circle',
                            radius: 0
                        },
                        style: {
                            stroke: '#ffffff',
                            'stroke-width': 1
                        }
                    }],

                    listeners: {
                        afterrender: function (cmp) {
                            cmp.series.each(function (aSeries) {
                                aSeries.showInLegend = false;
                            });
                        }
                    }
                }
            ]
        });

        me.callParent(arguments);
    }

});