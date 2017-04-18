Ext.require([
    'Ext.tab.*',
    'Ext.window.*',
    'Ext.tip.*',
    'Ext.layout.container.Border'
]);
//define DR widget
Ext.define('GE.protostype.DRWidget', {
    extend: 'Ext.grid.Panel',

    requires: [
        'Ext.selection.CellModel',
        'Ext.grid.*',
        'Ext.data.*',
        'Ext.util.*',
        'Ext.form.*'
    ],
    xtype: 'cell-editing',


    title: 'DR List',
    frame: true,

    initComponent: function () {
        this.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 1
        });

        Ext.apply(this, {
            width: 680,
            height: 350,
            plugins: [this.cellEditing],
            store: new Ext.data.Store(
            {
                storeId: 'drStore',
                fields: ['_dr_no', '_dr_type', '_create_date', '_dr_desc', '_current_owner', '_due_date'],
                data: { 'items': [
                    { _dr_no: '1', _dr_type: 'Conformity尺寸超差', _create_date: '2013-01-01', _dr_desc: 'test dr', _current_owner: 'Jin Yifan', _due_date: '2013-09-09' },
                    { _dr_no: '2', _dr_type: 'Conformity尺寸超差', _create_date: '2013-01-01', _dr_desc: 'test dr', _current_owner: 'Jin Yifan', _due_date: '2013-09-09' },
                    { _dr_no: '3', _dr_type: 'Conformity尺寸超差', _create_date: '2013-01-01', _dr_desc: 'test dr', _current_owner: 'Jin Yifan', _due_date: '2013-09-09' },
                    { _dr_no: '4', _dr_type: 'Conformity尺寸超差', _create_date: '2013-01-01', _dr_desc: 'test dr', _current_owner: 'Jin Yifan', _due_date: '2013-09-09' }
                    ]
                },
                proxy: {
                    type: 'memory',
                    reader: {
                        type: 'json',
                        root: 'items'
                    }
                }
            }
            ),
            columns: [
                        { text: 'DR No.', dataIndex: '_dr_no' },
                        { text: 'DR Type', dataIndex: '_dr_type' },
                        { text: 'Create Date', dataIndex: '_create_date' },
                        { text: 'DR Description', dataIndex: '_dr_desc', flex: 1 },
                        { text: 'Current Owner', dataIndex: '_current_owner' },
                        { text: 'Due Date', dataIndex: '_due_date' }
            ],
            selModel: {
                selType: 'cellmodel'
            },
            tbar: [{
                id: 'btnCreateDR',
                text: 'Create DR',
                scope: this,
                handler: this.onCreateDRClick
            }, {
                id: 'btnFilterDR',
                text: 'Filter DR',
                scope: this,
                handler: this.onFilterDRClick
            }]
        });

        this.callParent();

        this.on('afterlayout', this.loadStore, this, {
            delay: 1,
            single: true
        })
    },


    //launch new DR window
    onCreateDRClick: function () {
        var win
        button = Ext.get('btnCreateDR');
        if (!win) {
            win = Ext.create('widget.window', {
                title: 'Create New DR',
                header: {
                    titlePosition: 2,
                    titleAlign: 'center'
                },
                closable: true,
                closeAction: 'hide',
                width: 1200,
                minWidth: 450,
                height: 550,
                tools: [{ type: 'pin'}],
                layout: {
                    type: 'border',
                    padding: 5
                },
                items: [{
                    region: 'west',
                    title: 'DR Information',
                    width: 300,
                    split: true,
                    collapsible: true,
                    floatable: false,
                    items: [{//DR gerneral inforamtion
                        xtype: 'label',
                        text: 'DR Number:DR001',
                        margin: '0 0 0 0'
                    }, {
                        xtype: 'label',
                        text: 'Job Card: A0000000001',
                        margin: '0 0 30 0'
                    }, {
                        xtype: 'label',
                        text: 'Description:This is a demo DR',
                        margin: '20 0 0 10'
                    }
                    ]
                }, {
                    region: 'center',
                    xtype: 'panel',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [{
                        //Top: Disposition:
                        xtype: 'gridpanel',
                        title: 'Disposition',
                        flex: 1,
                        store: dpStore,
                        columns: [
                        { text: 'Rank.', dataIndex: '_rank' },
                        { text: 'DP Type', dataIndex: '_dp_type' },
                        { text: 'Create Date', dataIndex: '_create_date' },
                        { text: 'DP Description', dataIndex: '_dp_reason', flex: 1 },
                        { text: 'Current Owner', dataIndex: '_current_owner' },
                        { text: 'Remark', dataIndex: '_remark'}],
                        tbar: [{
                            id: 'btnCreateDP',
                            text: 'Create New Disposition',
                            scope: this
                            //handler: this.onCreateDPClick
                        }],
                        listeners: {
                            'select': function (_this, _record, _index) {
                                var acPanel = Ext.getCmp('acPanel');
                                var _rankIndex = _record.data._rank;
                                acPanel.store.loadData(acDataChange[_rankIndex - 1]);
                                
                            }
                        }
                    }, 
                     {
                        //Under: Actions:
                        id: 'acPanel',
                        xtype: 'gridpanel',
                        hideHeaders:true,
                        flex: 2,
                        store: acStore,
                        columns: [
                        { text: 'Action Type.', dataIndex: '_ac_type' },
                        { text: 'Excutor', dataIndex: '_excutor' },
                        { text: 'Action Reason Description', dataIndex: '_ac_reason' },
                        { text: 'Short Term Action', dataIndex: '_short_term_action', flex: 1 },
                        { text: 'Containment Action', dataIndex: '_containment_action' },
                        { text: 'Long Term Action', dataIndex: '_long_term_action' },
                        { text: 'Close Date', dataIndex: '_close_date' }],
                        tbar: [{
                            id: 'btnCreateAC',
                            text: 'Create New Action',
                            scope: this
                        }]
                    }//End of Action
                    ]
                }]
            });
        }
        button.dom.disabled = true;
        if (win.isVisible()) {
            win.hide(this, function () {
                button.dom.disabled = false;
            });
        } else {
            win.show(this, function () {
                button.dom.disabled = false;
            });
        }
    },


    //launch filter DR window
    onFilterDRClick: function () {
        //Call filter dr window.
        alert("filter dr");
    },

    loadStore: function () {
        this.getStore().load({
            // store loading is asynchronous, use a load listener or callback to handle results
            callback: this.onStoreLoad
        });
    },

    onStoreLoad: function () {

    }

});


//Stores
    //Disposition Store
var dpStore=Ext.create('Ext.data.Store', {
                            //Disposition Store
                            storeId: 'dpStore',
                            fields: ['_rank', '_dp_type', '_create_date', '_dp_reason', '_current_owner', '_remark'],
                            data: [
                                            { _rank: '1', _dp_type: 'Conformity尺寸超差', _create_date: '2013-01-01', _dp_reason: 'test dr', _current_owner: 'Jin Yifan', _remark: '2013-09-09' },
                                            { _rank: '2', _dp_type: 'Conformity尺寸超差', _create_date: '2013-01-01', _dp_reason: 'test dr', _current_owner: 'Jin Yifan', _remark: '2013-09-09' },
                                            { _rank: '3', _dp_type: 'Conformity尺寸超差', _create_date: '2013-01-01', _dp_reason: 'test dr', _current_owner: 'Jin Yifan', _remark: '2013-09-09' },
                                            { _rank: '4', _dp_type: 'Conformity尺寸超差', _create_date: '2013-01-01', _dp_reason: 'test dr', _current_owner: 'Jin Yifan', _remark: '2013-09-09' }
                                            ]
                        })




var acStore = Ext.create('Ext.data.Store', {
    //Action Store
    storeId: 'acStore',
    fields: ['_ac_type', '_excutor', '_ac_reason', '_short_term_action', '_containment_action', '_long_term_action', '_close_date'],
    data: [
                                            { _ac_type: '1', _excutor: 'Conformity尺寸超差', _ac_reason: '2013-01-01', _short_term_action: 'test dr', _containment_action: 'Jin Yifan', _long_term_action: '2013-09-09', _close_date: '2013-09-09' },
                                            { _ac_type: '2', _excutor: 'Conformity尺寸超差', _ac_reason: '2013-01-01', _short_term_action: 'test dr', _containment_action: 'Jin Yifan', _long_term_action: '2013-09-09', _close_date: '2013-09-09' },
                                            { _ac_type: '3', _excutor: 'Conformity尺寸超差', _ac_reason: '2013-01-01', _short_term_action: 'test dr', _containment_action: 'Jin Yifan', _long_term_action: '2013-09-09', _close_date: '2013-09-09' },
                                            { _ac_type: '4', _excutor: 'Conformity尺寸超差', _ac_reason: '2013-01-01', _short_term_action: 'test dr', _containment_action: 'Jin Yifan', _long_term_action: '2013-09-09', _close_date: '2013-09-09' }
                                            ]
});

var acDataChange=[
[{ _ac_type: '1', _excutor: 'Conformity尺寸超差', _ac_reason: '2013-01-01', _short_term_action: 'test dr', _containment_action: 'Jin Yifan', _long_term_action: '2013-09-09', _close_date: '2013-09-09' },
  { _ac_type: '2', _excutor: 'Conformity尺寸超差', _ac_reason: '2013-01-01', _short_term_action: 'test dr', _containment_action: 'Jin Yifan', _long_term_action: '2013-09-09', _close_date: '2013-09-09' }],
[{ _ac_type: '3', _excutor: 'Conformity尺寸超差', _ac_reason: '2013-01-01', _short_term_action: 'test dr', _containment_action: 'Jin Yifan', _long_term_action: '2013-09-09', _close_date: '2013-09-09' },
  { _ac_type: '4', _excutor: 'Conformity尺寸超差', _ac_reason: '2013-01-01', _short_term_action: 'test dr', _containment_action: 'Jin Yifan', _long_term_action: '2013-09-09', _close_date: '2013-09-09' }],
[{ _ac_type: '5', _excutor: 'Conformity尺寸超差', _ac_reason: '2013-01-01', _short_term_action: 'test dr', _containment_action: 'Jin Yifan', _long_term_action: '2013-09-09', _close_date: '2013-09-09' },
  { _ac_type: '6', _excutor: 'Conformity尺寸超差', _ac_reason: '2013-01-01', _short_term_action: 'test dr', _containment_action: 'Jin Yifan', _long_term_action: '2013-09-09', _close_date: '2013-09-09' }],
[{ _ac_type: '7', _excutor: 'Conformity尺寸超差', _ac_reason: '2013-01-01', _short_term_action: 'test dr', _containment_action: 'Jin Yifan', _long_term_action: '2013-09-09', _close_date: '2013-09-09' },
  { _ac_type: '8', _excutor: 'Conformity尺寸超差', _ac_reason: '2013-01-01', _short_term_action: 'test dr', _containment_action: 'Jin Yifan', _long_term_action: '2013-09-09', _close_date: '2013-09-09' }],
]
