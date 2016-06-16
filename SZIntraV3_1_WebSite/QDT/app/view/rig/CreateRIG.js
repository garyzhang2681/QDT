Ext.define('QDT.view.rig.CreateRIG', {
    extend: 'Ext.window.Window',
    title: Profile.getText('CreateRIG'),
    alias: 'widget.createrig',
    modal: true,
    width: 1050,
    height: 730,
    layout: {
        type: 'fit'
    },
    po_num: '',
    po_line: '',
    received_date: '',
    vendor_num: '',
    creator: Profile.getUser(),

    initComponent: function() {
        var me = this;

        var createForm = Ext.widget('form', {
            overflowY: 'auto',
            frame: false,
            border: false,
            layout: 'hbox',
            api: { submit: DpRig.CreateRIG },

            items: [
                {
                    xtype: 'panel',
                    frame: false,
                    border: false,
                    flex: 1,
                    layout: 'anchor',
                    margin: '10 0 10 5',
                    defaults: { anchor: '100%' },

                    items: [
                        {
                            xtype: 'searchcombo',
                            name: 'serial_lot',
                            fieldLabel: Profile.getText('serial_lot'),
                            store: Ext.create('QDT.store.rig.TrackNums'),
                            displayField: 'track_num',
                            valueField: 'track_num',
                            listeners: {
                                select: function() {
                                    var serialLot = createForm.down('[name=serial_lot]').getValue();
                                    DpRig.GetGRNDetail(serialLot, function(result) {

                                        createForm.down('[name=part_num]').setValue(result.data[0].item);
                                        createForm.down('[name=part_desc]').setValue(result.data[0].description);
                                        createForm.down('[name=vendor_name]').setValue(result.data[0].name);
                                        createForm.down('[name=drawing_num]').setValue(result.data[0].drawing_nbr);
                                        createForm.down('[name=qty_received]').setValue(result.data[0].qty_rec);
                                        createForm.down('[name=grn_num]').setValue(result.data[0].grn_num);
                                        createForm.down('[name=grn_line]').setValue(result.data[0].grn_line);
                                        createForm.down('[name=coc_num]').setValue(result.data[0].tracking_num);

                                        createForm.down('[name=vendor_name]').getStore().add({
                                            name: result.data[0].name
                                        });
                                        createForm.down('[name=vendor_name]').setValue(result.data[0].name);


                                        me.po_num = result.data[0].po_num;
                                        me.po_line = result.data[0].po_line;
                                        me.received_date = result.data[0].CreateDate;
                                        me.vendor_num = result.data[0].vend_num;

                                        createForm.down('[name=qty_rejected]').reset();


                                    });


                                }
                            }
                        }, {
                            xtype: 'textfield',
                            name: 'part_num',
                            fieldLabel: Profile.getText('part_num')

                        }, {
                            xtype: 'textfield',
                            name: 'part_desc',
                            fieldLabel: Profile.getText('part_desc')

                        }, {
                            xtype: 'searchcombo',
                            name: 'vendor_name',
                            fieldLabel: Profile.getText('vendor_name'),
                            store: Ext.create('QDT.store.rig.RigGetVendorName'),
                            displayField: 'name',
                            valueField: 'name',
                            listeners: {
                                select: function() {
                                    var name = createForm.down('[name=vendor_name]').getValue();

                                    DpRig.GetVendorList(name, function(result) {

                                        me.vendor_num = result.data[0].vend_num;

                                    });
                                }
                            }

                        }, {
                            xtype: 'textfield',
                            name: 'grn_num',
                            fieldLabel: Profile.getText('grn_num')

                        }, {
                            xtype: 'textfield',
                            name: 'grn_line',
                            fieldLabel: Profile.getText('grn_line')

                        }, {
                            xtype: 'textfield',
                            name: 'coc_num',
                            fieldLabel: Profile.getText('coc_num')
                        }, {
                            xtype: 'textfield',
                            name: 'drawing_num',
                            fieldLabel: Profile.getText('drawing_num')
                        }, {
                            xtype: 'textfield',
                            name: 'qty_received',
                            fieldLabel: Profile.getText('qty_received')

                        }, {
                            xtype: 'textfield',
                            name: 'qty_rejected',
                            fieldLabel: Profile.getText('qty_rejected'),
                            listeners: {
                                blur:
                                    function() {

                                        var qtyReceived = createForm.down('[name=qty_received]').getValue();
                                        var qtyRejected = createForm.down('[name=qty_rejected]').getValue();
                                        if (qtyRejected - qtyReceived > 0) {

                                            alert('拒收数量大于收货数量,请确认！');

                                        }
                                    }
                            }

                        }, {
                            xtype: 'remotecombo',
                            name: 'liability',
                            fieldLabel: Profile.getText('liability'),
                            store: Ext.create('QDT.store.rig.Liabilitys'),
                            displayField: 'Liability',
                            valueField: 'Liability',
                            emptyText: Profile.getText('PleaseSelect')
                        }, {
                            xtype: 'remotecombo',
                            name: 'goods_returned_for',
                            fieldLabel: Profile.getText('goods_returned_for'),
                            store: Ext.create('QDT.store.rig.Goods_returned_fors'),
                            displayField: 'goods_returned_for',
                            valueField: 'goods_returned_for',
                            emptyText: Profile.getText('PleaseSelect'),
                            multiSelect: true
                        }, {
                            xtype: 'combobox',
                            name: 'quanlity_escape',
                            fieldLabel: Profile.getText('quanlity_escape'),
                            store: Ext.create('QDT.store.Bools'),
                            displayField: 'name',
                            valueField: 'value',
                            queryMode: 'local',
                            emptyText: Profile.getText('PleaseSelect')
                        }, {
                            xtype: 'displayfield',
                            name: 'create_date',
                            fieldLabel: Profile.getText('create_date'),
                            value: Ext.Date.format(new Date(), 'Y-m-d H:i')
                        }, {
                            xtype: 'displayfield',
                            name: 'create_by_name',
                            fieldLabel: Profile.getText('create_by'),
                            value: me.creator['name_' + Profile.getLang()]
                        }, {
                            xtype: 'displayfield',
                            name: 'due_date',
                            fieldLabel: Profile.getText('due_date'),
                            value: Ext.Date.format(Ext.Date.add(new Date(), Ext.Date.MONTH, 3), 'Y-m-d'),
                            submitValue: true
                        }, {
                            xtype: 'textarea',
                            name: 'problem_description',
                            fieldLabel: Profile.getText('problem_description')
                        }, {
                            xtype: 'hidden',
                            name: 'create_by',
                            value: me.creator.user_id
                        }, {
                            xtype: 'searchcombo',
                            name: 'dr_num',
                            fieldLabel: Profile.getText('dr_num'),
                            store: Ext.create('QDT.store.ComboDRs'),
                            displayField: 'dr_num',
                            valueField: 'dr_num',
                            listeners: {
                                select: function(combo, records) {
                                    var drnum = createForm.down('[name=dr_num]').getValue();
                                    DpRig.GetDrDescription(drnum, function(result) {

                                        if (result.success) {
                                            createForm.down('[name=DRInfo]').setValue(result.data);
                                        }
                                    });
                                }
                            }
                        }, {
                            xtype: 'textarea',
                            name: 'DRInfo',
                            fieldLabel: Profile.getText('DRInfo')

                        }, {
                            xtype: 'button',
                            anchor: '30%',
                            text: Profile.getText('add'),
                            iconCls: 'add_green',
                            handler: function() {

                                var serialLot = createForm.down('[name=serial_lot]').getValue();
                                var partNum = createForm.down('[name=part_num]').getValue();
                                var partDesc = createForm.down('[name=part_desc]').getValue();
//                                var vendorNum = createForm.down('[name=vendor_num]').getValue();
                                var grnNum = createForm.down('[name=grn_num]').getValue();
                                var grnLine = createForm.down('[name=grn_line]').getValue();
                                var cocNum = createForm.down('[name=coc_num]').getValue();
                                var drawingNum = createForm.down('[name=drawing_num]').getValue();
                                var qtyReceived = createForm.down('[name=qty_received]').getValue();
                                var qtyRejected = createForm.down('[name=qty_rejected]').getValue();
                                var liability = createForm.down('[name=liability]').getValue();
                                var goodsReturnedFor = createForm.down('[name=goods_returned_for]').getValue();
                                var quanlityEscape = createForm.down('[name=quanlity_escape]').getValue();
                                var createDate = createForm.down('[name=create_date]').getValue();
                                var createByName = createForm.down('[name=create_by_name]').getValue();
                                var dueDate = createForm.down('[name=due_date]').getValue();
                                var problemDescription = createForm.down('[name=problem_description]').getValue();
                                var drNum = createForm.down('[name=dr_num]').getValue();


                                var myStore = createForm.down('[name=RigLineGrid]').store;


                                if (serialLot == null) {

                                    alert('序列号无法为空请确认!');
                                } else {
                                    if (myStore.find('serial_lot', serialLot) == -1) {

                                        if (myStore.count() == 0) {


                                            myStore.add({
                                                serial_lot: serialLot,
                                                part_num: partNum,
                                                part_desc: partDesc,
                                                vendor_num: me.vendor_num,
                                                grn_num: grnNum,
                                                grn_line: grnLine,
                                                coc_num: cocNum,
                                                drawing_num: drawingNum,
                                                qty_received: qtyReceived,
                                                qty_rejected: qtyRejected,
                                                liability: liability,
                                                goods_returned_for: goodsReturnedFor,
                                                quanlity_escape: quanlityEscape,
                                                create_date: createDate,
                                                create_by_name: createByName,
                                                due_date: dueDate,
                                                problem_description: problemDescription,
                                                dr_num: drNum,
                                                po_num: me.po_num,
                                                po_line: me.po_line,
                                                received_date: me.received_date
                                            });

                                        } else {

                                            if (myStore.find('vendor_num', me.vendor_num) == -1 || myStore.find('part_num', partNum) == -1) {

                                                alert('供应商料号不唯一,请确认输入');

                                            } else {

                                                myStore.add({
                                                    serial_lot: serialLot,
                                                    part_num: partNum,
                                                    part_desc: partDesc,
                                                    vendor_num: me.vendor_num,
                                                    grn_num: grnNum,
                                                    grn_line: grnLine,
                                                    coc_num: cocNum,
                                                    drawing_num: drawingNum,
                                                    qty_received: qtyReceived,
                                                    qty_rejected: qtyRejected,
                                                    liability: liability,
                                                    goods_returned_for: goodsReturnedFor,
                                                    quanlity_escape: quanlityEscape,
                                                    create_date: createDate,
                                                    create_by_name: createByName,
                                                    due_date: dueDate,
                                                    problem_description: problemDescription,
                                                    dr_num: drNum,
                                                    po_num: me.po_num,
                                                    po_line: me.po_line,
                                                    received_date: me.received_date
                                                });

                                            }
                                        }
                                    } else {
                                        alert('序列号重复请确认！');
                                    }
                                }
                            }
                        }
                    ]

                }, {
                    xtype: 'panel',
                    frame: false,
                    border: false,
                    flex: 2,
                    layout: 'anchor',
                    margin: '10 10 10 5',
                    items: [
                        {
                            xtype: 'grid',
                            name: 'RigLineGrid',
                            anchor: '100%',
                            store: Ext.create('QDT.store.rig.RigLines'),
                            columns: [
                                {
                                    text: Profile.getText('serial_lot'),
                                    dataIndex: 'serial_lot'

                                }, {
                                    text: Profile.getText('vendor_num'),
                                    dataIndex: 'vendor_num'


                                }, {
                                    text: Profile.getText('part_num'),
                                    dataIndex: 'part_num'

                                }, {
                                    text: Profile.getText('grn_num'),
                                    dataIndex: 'grn_num'

                                }, {
                                    text: Profile.getText('grn_line'),
                                    dataIndex: 'grn_line'

                                }, {
                                    text: Profile.getText('dr_num'),
                                    dataIndex: 'dr_num'

                                }, {
                                    text: Profile.getText('qty_rejected'),
                                    dataIndex: 'qty_rejected'

                                }
                            ]
                        }, {
                            xtype: 'fieldset',
                            anchor: '90%',
                            title: Profile.getText('attachment'),
                            collapsible: false,
                            defaultType: 'textfield',
                            layout: 'anchor',
                            items: [
                                {
                                    xtype: 'multipleattachments',
                                    nameBase: "attachment#"

                                }
                            ]
                        }
                    ]
                }
            ],
            buttons: [
                {
                    iconCls: 'submit',
                    text: Profile.getText('Submit'),
                    handler: function(btn) {


                        var rig_line_store = createForm.down('[name=RigLineGrid]').store;
                        var rig_line_count = rig_line_store.getCount();
                        if (rig_line_count == 0) {

                            alert('请输入RIG 条目！');
                        } else {

                            var rig_line = rig_line_store.getRange(0, rig_line_count);
                            var rig_lines = Ext.JSON.encode(QDT.util.Util.getRecordsData(rig_line));
                            createForm.getForm().submit({
                                params: { rig_lines: rig_lines },
                                waitMsg: '正在保存文件...',
                                success: function(form, action) {
                                    me.close();
                                    var msgbox = My.Msg.info(Profile.getText('RecordCreated'), Profile.getText('rig_num') + ':' + action.result.rig_num);
                                    Ext.Function.defer(function() {
                                        msgbox.zIndexManager.bringToFront(msgbox);
                                    }, 100);

                                    cq.query('rig')[0].store.reload();
                                },
                                failure: function(form, action) {
                                    My.Msg.info(Profile.getText('Error'), action.result.errorMessage);
                                }
                            });


                        }
                    }
                }
            ]
        });

        me.items = [
            {
                title: Profile.getText('RIGInfo'),
                items: [createForm]
            }
        ];

        me.callParent();
    }
});