Ext.define('QDT.controller.cc.Cc', {
    extend: 'Ext.app.Controller',
    stores: ['QDT.store.cc.Ccs',
             'QDT.store.cc.CcTypes',
             'QDT.store.cc.CcFailureCodes',
             'QDT.store.cc.CcIndicateFindings'],

    views: ['QDT.view.cc.CcList',
            'QDT.view.cc.CcPanel',
            'QDT.view.cc.CcEdit',
            'QDT.view.cc.CcDetail'],


    refs: [{
        ref: 'list',
        selector: 'cc-cclist'
    }, {
        ref: 'edit',
        selector: 'cc-ccedit'
    }, {
        ref: 'detail',
        selector: 'cc-ccdetail'
    }, {
        ref: 'panel',
        selector: 'cc-ccpanel'
    }],

    init: function () {
        var me = this;


        me.control({


            'cc-cclist': {
                selectionchange: me.onCcListSelectionChange
            },

            'cc-cclist #add': {
                click: {
                    buffer: 100,
                    fn: me.onAddCcClick
                },
                scope: me
            }, 'cc-cclist #delete': {
                click: {
                    buffer: 100,
                    fn: me.onDeleteCcClick
                },
                scope: me
            }, 'cc-cclist #edit': {
                click: {
                    buffer: 100,
                    fn: me.onEditCcClick
                },
                scope: me
            },
            'cc-cclist #clear': {
                click: me.onClearClick,

                scope: me
            },
            'cc-cclist #search': {
                click: {
                    buffer: 1000,
                    fn: me.onSearchClick
                },
                scope: me
            },
            'cc-ccedit #serial_lot': {
                select: function (combo, records) {
                    var ccedit = me.getEdit();

                    DpUtil.SearchItemBySerialOrLot(records[0].data['item'], function (result) {
                        if (result.success) {

                            var item = Ext.create('Asz.model.util.Item', {
                                item: result.data[0].item,
                                FGorRW: result.data[0].FGorRW,
                                serialOrLot: result.data[0].serialOrLot
                            });
                            ccedit.down('#part_num').select(item);

                        } else {
                            My.Msg.warning('获取零件号失败！');
                        }

                    });
                }
            },
            'cc-ccdetail #print': {
                click: {
                    buffer: 1000,
                    fn: me.onPrintClick
                },
                scope: me
            },
            'cc-ccedit #print': {
                click: {
                    buffer: 1000,
                    fn: me.onPrintClick
                },
                scope: me
            }

        });
    },
    onAddCcClick: function () {

        DpCc.GenerateCcNumber(function (result) {
            if (result.success) {
                Ext.widget('cc-ccedit', {
                    is_create: true,
                    is_update: false,
                    cc_num: result.cc_num
                }).show();
            } else {
                My.Msg.warning('Customer Complaint ID 生成错误，请联系IT！');
            }


        });
    },

    onEditCcClick: function () {
        var me = this,
            record = me.getList().selModel.getSelection()[0];
        cc_num = record.data.cc_num;
        Ext.widget('cc-ccedit', {
            is_create: false,
            is_update: true,
            cc_num: cc_num,
            record: record
        }).show();

    },

    onDeleteCcClick: function () {
        var me = this,
            cc_num = me.getList().selModel.getSelection()[0].data.cc_num;

        My.Msg.question('attention', '确定要删除' + cc_num + '吗？', function (btn, text) {
            if (btn == 'yes') {
                DpCc.DeleteCc(cc_num, function (result) {
                    if (result.success) {
                        My.Msg.alert('message', 'Delete Customer Complaint ' + cc_num + ' Successfully!');
                    } else {
                        My.Msg.warning('Delete Customer Complaint ' + cc_num + ' Failed!');
                    }
                    me.getList().getStore().load();
                });
            } else {
            }
        });
    },

    onCcListSelectionChange: function (selModel, selected) {

        var me = this,
            list = me.getList(),
            detail = me.getDetail(),
            record = selected[0] || {},
            isSelected = !Ext.Object.equals(record, {});

        list.down('#edit').setDisabled(!isSelected);
        list.down('#delete').setDisabled(!isSelected);

        detail.getForm().reset();
        if (isSelected) {
            detail.loadRecord(record);
        }
    },

    onClearClick: function () {
        var me = this;
        var list = me.getList();
        list.down('#search_cc').getForm().reset();

        me.onSearchClick();
    },

    onSearchClick: function () {
        var me = this;
        var list = me.getList();

        list.getStore().load({
            waitMsg: '正在加载数据请稍后',
            params: {
                search_conditions: list.down('#search_cc').getForm().getValues()
            },
            callback: function (records, operation, success) {
                if (!success) {
                    My.Msg.warning('查询出错，请刷新页面重新操作，或者联系IT！');
                }
            }
        });
    },

    onPrintClick: function () {
        var me = this;
        var cc_num = me.getList().selModel.getSelection()[0].data.cc_num;
        var url = '../../DpCc/Print8DReport?ccNum=' + cc_num;
        window.open(url);
    }



});