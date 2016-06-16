Ext.define('QDT.view.rig.RIGDetail', {
    extend: 'Ext.window.Window',
    alias: 'widget.rigdetail',
    title: Profile.getText('RIGDetail'),
    modal: true,
    width: 832,
    height: 730,
    layout: {
        type: 'fit'
    },
    rignum: '',
    isclosed: false,

    initComponent: function() {
        var me = this;
        var rigDetailForm = Ext.widget('form', {
            overflowY: 'auto',
            frame: false,
            border: false,
            layout: 'hbox',

            api: { submit: DpRig.CloseRIG },
            defaults: {
                defaultType: 'displayfield'
            },
            items: [
                {
                    xtype: 'panel',
                    frame: false,
                    border: false,
                    flex: 2,
                    layout: 'anchor',
                    margin: '10 0 10 5',
                    defaults: { anchor: '80%', submitValue: true },
                    items: [
                        {
                            name: 'rig_num',
                            fieldLabel: Profile.getText('rig_num')

                        },
                        {
                            name: 'rig_line',
                            fieldLabel: Profile.getText('rig_line')

                        },
                        {
                            name: 'vendor_num',
                            fieldLabel: Profile.getText('vendor_num')

                        },
                        {
                            name: 'part_num',
                            fieldLabel: Profile.getText('part_num')


                        },
                        {
                            xtype: 'combobox',
                            store: Ext.create('QDT.store.rig.Liabilitys'),
                            name: 'liability',
                            displayField: 'Liability',
                            valueField: 'Liability',
                            fieldLabel: Profile.getText('liability')


                        },
                        {
                            name: 'status',
                            fieldLabel: Profile.getText('status')

                        },
                        {
                            xtype: 'combobox',
                            name: 'dr_num',
                            fieldLabel: Profile.getText('dr_num'),
                            store: Ext.create('QDT.store.ComboDRs'),
                            displayField: 'dr_num',
                            valueField: 'dr_num'

                        },
                        {
                            xtype: 'combobox',
                            name: 'serial_lot',
                            fieldLabel: Profile.getText('serial_lot'),
                            store: Ext.create('QDT.store.rig.TrackNums'),
                            displayField: 'track_num',
                            valueField: 'track_num'
                        },
                        {
                            xtype: 'textfield',
                            name: 'defect_desc',
                            fieldLabel: Profile.getText('problem_description')

                        },
                        {
                            xtype: 'textfield',
                            name: 'po_num',
                            fieldLabel: Profile.getText('po_num')

                        }, {
                            xtype: 'textfield',
                            name: 'po_line',
                            fieldLabel: Profile.getText('po_line')

                        },
                        {
                            xtype: 'textfield',
                            name: 'coc_num',
                            fieldLabel: Profile.getText('coc_num')

                        },
                        {
                            xtype: 'textfield',
                            name: 'grn_num',
                            fieldLabel: Profile.getText('grn_num')

                        },
                        {
                            xtype: 'textfield',
                            name: 'grn_line',
                            fieldLabel: Profile.getText('grn_line')

                        },
                        {
                            xtype: 'textfield',
                            name: 'part_desc',
                            fieldLabel: Profile.getText('part_desc')

                        },
                        {
                            xtype: 'textfield',
                            name: 'drawing_num',
                            fieldLabel: Profile.getText('drawing_num')

                        },
                        {
                            xtype: 'combobox',
                            name: 'goods_returned_for',
                            fieldLabel: Profile.getText('goods_returned_for'),
                            store: Ext.create('QDT.store.rig.Goods_returned_fors'),
                            displayField: 'goods_returned_for',
                            valueField: 'goods_returned_for',
                            emptyText: Profile.getText('PleaseSelect'),
                            multiSelect: true
                        },
                        {
                            name: 'quanlity_escape_' + Profile.getLang(),
                            fieldLabel: Profile.getText('quanlity_escape'),
                            xtype: 'combobox',
                            store: Ext.create('QDT.store.rig.QualityEscapeCNs'),
                            displayField: 'name',
                            valueField: 'name',
                            queryMode: 'local'


                        },
                        {
                            name: 'create_date',
                            fieldLabel: Profile.getText('create_date'),
                            renderer: QDT.util.Renderer.dateRenderer

                        },
                        {
                            xtype: 'datefield',
                            name: 'due_date',
                            fieldLabel: Profile.getText('due_date'),
                            renderer: QDT.util.Renderer.dateRenderer

                        },
                        {
                            xtype: 'datefield',
                            name: 'goods_receive_date',
                            fieldLabel: Profile.getText('goods_receive_date'),
                            renderer: QDT.util.Renderer.dateRenderer

                        },
                        {
                            xtype: 'textfield',
                            name: 'qty_received',
                            fieldLabel: Profile.getText('qty_received')


                        },
                        {
                            xtype: 'textfield',
                            name: 'qty_rejected',
                            fieldLabel: Profile.getText('qty_rejected')

                        },
                        {
                            name: 'create_by_' + Profile.getLang(),
                            fieldLabel: Profile.getText('create_by')

                        }
                    ]
                }, {
                    xtype: 'panel',
                    frame: false,
                    border: false,
                    flex: 1,
                    layout: 'anchor',
                    margin: '10 0 10 60',
                    defaults: { anchor: '40%', submitValue: true },
                    items: [
                        {
                            fieldLabel: '关闭RIG:'
                        },
                        {
                            name: 'btnclose_rig',
                            xtype: 'button',
                            text: Profile.getText('CloseRig'),
                            hidden: me.isclosed,
                            listeners: {
                                click: function() {

                                    Ext.MessageBox.show({
                                        title: 'Warning',
                                        msg: me.rignum + '将会关闭, 请确认操作！',
                                        buttons: Ext.MessageBox.YESNO,
                                        fn: function(btn) {
                                            if (btn === 'yes') {
                                                rigDetailForm.getForm().submit({
                                                    params: { isClose: 1 },
                                                    waitMsg: '正在保存文件...',
                                                    success: function(form, action) {
                                                        Ext.MessageBox.show({
                                                            title: 'Warning',
                                                            msg: me.rignum + '关闭成功！'

                                                        });
                                                        me.close();
                                                        cq.query('rig')[0].store.reload();
                                                    }
                                                });
                                            } else {
                                                close = false;
                                            }
                                        }
                                    });
                                }
                            }
                        },
                        {
                            fieldLabel: '打印RIG:'


                        },
                        {
                            name: 'btnPrint',
                            xtype: 'button',
                            text: Profile.getText('Print'),

                            listeners: {
                                click: function() {
                                    var url = '../../DpRig/PrintRig?rignum=' + me.rignum;
                                    window.open(url);
                                }
                            }
                        }, {
                            name: 'editfield',
                            fieldLabel: '编辑相关信息:'
                        },
                        {
                            xtype: 'button',
                            name: 'btnUpdate',
                            text: Profile.getText('Update'),
                            listeners: {
                                click: function() {

                                    rigDetailForm.getForm().submit({
                                        params: { isClose: 0 },
                                        waitMsg: '正在处理,请稍候...',
                                        success: function(form, action) {
                                            Ext.MessageBox.show({
                                                title: 'Warning',
                                                msg: me.rignum + '更新成功！'

                                            });
                                            me.close();
                                            cq.query('rig')[0].store.reload();
                                        }
                                    });
                                }
                            }
                        },
                        {
                            name: 'editfield',
                            fieldLabel: '编辑附件:'


                        },
                        {
                            iconCls: 'attachment',
                            itemId: 'view-attachment',
                            xtype: 'attachmentbutton',
                            text: Profile.getText('attachment'),
                            tooltip: Profile.getText('txtViewAttachment'),
                            rootCt: me,
                            refType: 'rig',
                            generateId: false,
                            refNum: me.rignum,
                            viewerMode: false

                        }
                    ]
                }
            ]

        });


        me.items = [
            {
                title: Profile.getText('RIGInfo'),
                items: [rigDetailForm],
                submitValue: true
            }
        ];

        me.callParent();


    }
});