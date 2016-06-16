Ext.define('QDT.view.tq.StamperList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.tq-stamperlist',
    requires: [
        'QDT.util.Renderer',
        'QDT.ux.Skirtle.Component'
    ],
    store: 'QDT.store.tq.StamperLists',



    initComponent: function() {
        var me = this;


        Ext.applyIf(me, {
            columns: [
                {
                    dataIndex: 'request_id',
                    text: Profile.getText('id'),
                    width: 82
                },
                {
                    dataIndex: 'category',
                    text: Profile.getText('category'),
                    width: 82
                },
                {
                    dataIndex: 'employee_id',
                    text: Profile.getText('requestFor'),
                    width: 82,
                    renderer: QDT.util.Renderer.employeeName
                },
                {

                    dataIndex: 'requestor',
                    text: Profile.getText('requestor'),
                    width: 82,
                    renderer: QDT.util.Renderer.username

                },
                {
                    dataIndex: 'issue_date',
                    text: Profile.getText('issue_date'),
                    width: 82,
                    renderer: QDT.util.Renderer.dateRenderer
                },
                {
                    dataIndex: 'refresh_date',
                    text: Profile.getText('refresh_date'),
                    width: 82,
                    renderer: QDT.util.Renderer.dateRenderer
                },
                {
                    dataIndex: 'status',
                    text: Profile.getText('status'),
                    width: 82
                },
                {
                    dataIndex: 'remark',
                    text: Profile.getText('remark'),
                    width: 82
                },
                {
                    dataIndex: 'attachment',
                    text: Profile.getText('attachment'),
                    xtype: 'componentcolumn',

                    renderer: function(record) {
                        return {
                            iconCls: 'attachment',
                            itemId: 'view-attachment',
                            xtype: 'attachmentbutton',
                            text: Profile.getText('attachment'),
                            tooltip: Profile.getText('txtViewAttachment'),
                            idFieldName: 'request_id',
                            refType: 'request',
                            rootCt: me,
                            generateId: false

                        }


                    }


                }
            ],
            store: me.store,
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
                        },
                        {
                            iconCls:'delete',
                            itemId:'delete'
                        }
                    ]
                }, {
                    xtype: 'toolbar',
                    dock: 'top',
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'form',
                            layout: 'vbox',
                            name: 'search_stamper',
                            itemId: 'search_stamper',
                            frame: true,
                            items: [
                                {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '0 0 5 0',
                                    defaults: {
                                        margin: '2 10 0 0'
                                    },
                                    items: [
                                        {
                                            name: 'request_id',
                                            xtype: 'hiddenfield'
                                        },
                                        {
                                            xtype: 'nativeusercombo',
                                            name: 'create_by',
                                            itemId: 'create_by',
                                            fieldLabel: '被申请人',
                                            labelWidth: 50
                                        },
                                        {
                                            xtype: 'tq-certificationstatuscombo',
                                            name: 'status',
                                            itemId: 'status',
                                            fieldLabel: Profile.getText('status'),
                                            labelWidth: 50,
                                            multiSelect: false
                                        }
                                    ]
                                }, {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    defaults: {
                                        margin: '0 10 2 0'
                                    },
                                    items: [
                                        {
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
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }, {
                    xtype: 'pagingtoolbar',
                    displayInfo: true,
                    dock: 'bottom',
                    itemId: 'stamper_pages',
                    name: 'stamper_pages',
                    store: me.store

                }
            ]
        });





        me.callParent();
    }
});