Ext.define('QDT.view.skill.ScanTransactionGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.skill-scantransactiongrid',

    initComponent: function () {
        var me = this;


        var scan_transaction_store = Ext.create('QDT.store.scan.ScanTransactions');



        Ext.apply(me, {
            store: scan_transaction_store,
            columns: [{
                dataIndex: 'employee_id', text: Profile.getText('employee_name'), width: 80, flex: 1, renderer: QDT.util.Renderer.employeeName
            }, {
                dataIndex: 'work_date', text: Profile.getText('work_date'), width: 80, renderer: QDT.util.Renderer.dateRenderer
            }, {
                dataIndex: 'start_time', text: Profile.getText('start_time'), width: 80, renderer: QDT.util.Renderer.dateTimeRenderer
            }, {
                dataIndex: 'end_time', text: Profile.getText('end_time'), width: 80, renderer: QDT.util.Renderer.dateTimeRenderer
            }, {
                dataIndex: 'work_time', text: Profile.getText('work_time'), width: 60
            }, {
                dataIndex: 'job', text: Profile.getText('job'), minWidth: 100, flex: 1
            }, {
                dataIndex: 'oper_num', text: Profile.getText('oper_num'), width: 60
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                margin: '0 0 5 0',
                layout: 'fit',
                items: [{
                    xtype: 'form',

                    layout: 'vbox',
                    name: 'search_scan_transaction',
                    itemId: 'search_scan_transaction',
                    frame: true,
                    items: [{
                        xtype: 'container',
                        layout: 'hbox',
                        defaults: {
                            margin: '2 10 2 0'
                        },
                        items: [{
                            xtype: 'employeecombo',
                            name: 'employee_id',
                            itemId: 'employee_id',
                            fieldLabel: Profile.getText('employee'),
                            store: Ext.create('Asz.store.hr.Employees'),
                            labelWidth: Profile.getLang() == 'en' ? 40 : 60,
                            width: 40
                        }, {
                            xtype: 'skill-skillcodecombo',
                            name: 'skill_code',
                            itemId: 'skill_code',
                            fieldLabel: Profile.getText('skill_code'),
                            labelWidth: Profile.getLang() == 'en' ? 40 : 60,
                            width: 240
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
                store: scan_transaction_store,
                itemId: 'scanTransaction_pages',
                name: 'scanTransaction_pages',
                dock: 'bottom',
                displayInfo: true
            }]
        });
        me.callParent();
    }
});