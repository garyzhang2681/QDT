Ext.define('QDT.view.cc.CcList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.cc-cclist',
    //activeRecord:{}
    requires: [
        'QDT.util.Renderer'
    ],
    columns: [{
        dataIndex: 'cc_num',
        text: 'CC Num.',
        width: 100,
       // locked: true,
        minWidth: 50
    }, {
        dataIndex: 'po_num',
        text: 'PO No.',
        width: 100,
        minWidth: 50
    }, {
        dataIndex: 'business',
        text: 'Business'
    }, {
        dataIndex: 'part_num',
        text: 'Part Num.'
    }, {
        dataIndex: 'create_by',
        text: 'Creator',
        renderer: QDT.util.Renderer.username
    }, {
        dataIndex: 'create_date',
        text: 'Create Date',
        renderer: QDT.util.Renderer.dateRenderer
    }, {
        dataIndex: 'criteria',
        text: 'Criteria'
    }, {
        dataIndex: 'type',
        text: 'Type',
        renderer: QDT.util.Renderer.ccType
    }, {
        dataIndex: 'rejected_quantity',
        text: 'Rejected Quantity'

    }, {
        dataIndex: 'failure_code',
        text: 'Failure Code',
        renderer: QDT.util.Renderer.ccFailureCode
    }, {
        dataIndex: 'indicate_finding',
        text: 'Indicate Finding',
        renderer: QDT.util.Renderer.ccIndicateFinding
    }, {
        dataIndex: 'quality_rep',
        text: 'Quality Rep.',
        renderer: QDT.util.Renderer.employeeName
    }, {
        dataIndex: 'ca_assigned_to',
        text: 'Ca Assigned To',
        renderer: QDT.util.Renderer.employeeName
    }, {
        dataIndex: 'audit_findings',
        text: 'Audit Findings'
    }],

    initComponent: function () {
        var me = this;

        var cc_store = Ext.create('QDT.store.cc.Ccs');
        cc_store.load();


        Ext.applyIf(me, {
            store: cc_store,
            dockedItems: [
           {
               xtype: 'toolbar',
               dock: 'top',
               margin: '0 0 5 0',
               // border: true,
               items: [
            {
                iconCls: 'add',
                itemId: 'add'
            }, {
                iconCls: 'edit',
                itemId: 'edit',
                disabled: true
            }, {
                iconCls: 'delete',
                itemId: 'delete',
                disabled: true
            }]
           }, {
               xtype: 'toolbar',
               dock: 'top',
               layout: 'fit',
               items: [{
                   xtype: 'form',
                   layout: 'vbox',
                   name: 'search_cc',
                   itemId: 'search_cc',
                   frame: true,
                   items: [{
                       xtype: 'container',
                       layout: 'hbox',
                       margin: '0 0 5 0',
                       defaults: {
                           margin: '2 10 0 0'
                       },
                       items: [{
                           xtype: 'seriallotcombo',
                           name: 'serial_lot',
                           itemId: 'serial_lot',
                           fieldLabel: 'Serial/Lot',
                           labelWidth: 60
                       }, {
                           xtype: 'itemcombo',
                           name: 'part_num',
                           itemId: 'part_num',
                           fieldLabel: 'Part Num.',
                           labelWidth: 60
                       }, {
                           xtype: 'businesscombo',
                           name: 'business',
                           fieldLabel: 'Business',
                           labelWidth: 50
                       }]
                   }, {
                       xtype: 'container',
                       layout: 'hbox',
                       defaults: {
                           margin: '0 10 2 0'
                       },
                       items: [{
                           xtype: 'nativeusercombo',
                           name: 'create_by',
                           itemId: 'create_by',
                           fieldLabel:'Creator',
                           labelWidth: 40
                       }, {
                           xtype: 'button',
                           iconCls: 'undo',
                           itemId: 'clear',
                           name: 'clear',
                           text: Profile.getText('clear')
                       }, {
                           xtype: 'button',
                           iconCls: 'search',
                           itemId: 'search',
                           name: 'search',
                           text: Profile.getText('Search')
                       }]
                   }]
               }]
           }, {
               xtype: 'pagingtoolbar',
               displayInfo: true,
               dock: 'bottom',
               itemId: 'cc_pages',
               name: 'cc_pages',
               store: cc_store

           }]
        });

  

        me.callParent();
    }
});