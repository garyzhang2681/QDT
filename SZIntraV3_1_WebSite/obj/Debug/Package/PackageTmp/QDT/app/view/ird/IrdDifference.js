
Ext.define('QDT.view.ird.IrdDifference', {
    extend: 'Ext.window.Window',
    alias: 'widget.ird-irddifference',
    width: 1000,
    modal: true,
    check_type: '',
    ird_id: '',

    initComponent: function () {
        var me = this;

        me.title = Profile.getText(me.check_type);

        var charCols = [{
            text: Profile.getText('char_seq'),
            dataIndex: 'ird_characteristic.char_seq',
            flex: 1
        }, {
            text: Profile.getText('ird_id'),
            dataIndex: 'ird_characteristic.ird_id',
            hidden: true
        }, {
            text: Profile.getText('oper_num'),
            dataIndex: 'ird_characteristic.oper_num',
            flex: 1
        }, {
            dataIndex: 'ird_characteristic.char_id',
            text: Profile.getText('char_id'),
            flex: 1
        }, {
            text: Profile.getText('char_num'),
            dataIndex: 'ird_characteristic.char_num',
            flex: 1
        }, {
            text: Profile.getText('characteristic'),
            dataIndex: 'ird_characteristic.characteristic',
            flex: 1
        }, {
            text: Profile.getText('description'),
            dataIndex: 'ird_characteristic.char_description',
            flex: 1
        }, {
            text: Profile.getText('OperatorResult'),
            dataIndex: 'basic_rec_type',
            //  renderer: operatorTemplateRenderer,
            width: 30
        }, {
            text: Profile.getText('InspectorResult'),
            dataIndex: 'fml_rec_type',
            //  renderer: inspectorTemplateRenderer,
            width: 30
        }, {
            text: Profile.getText('char_minimum'),
            dataIndex: 'ird_characteristic.char_minimum',
            //  renderer: inspectorTemplateRenderer,
            width: 30
        }, {
            text: Profile.getText('char_maximum'),
            dataIndex: 'ird_characteristic.char_maximum',
            //  renderer: inspectorTemplateRenderer,
            width: 30
        }, {
            text: Profile.getText('char_type'),
            flex: 1,
            dataIndex: 'ird_characteristic.char_type'
        }, {
            text: Profile.getText('blue_print_zone'),
            dataIndex: 'ird_characteristic.blue_print_zone'
        }, {
            text: Profile.getText('gage'),
            dataIndex: 'basic_gage',
            flex: 1
        }, {
            text: Profile.getText('gage'),
            dataIndex: 'fml_gage',
            flex: 1
        }, {
            text: Profile.getText('quantity'),
            dataIndex: 'ird_characteristic.line_qty',
            flex: 1
        }, {
            text: Profile.getText('oap_flag'),
            dataIndex: 'ird_characteristic.oap_flag',
            flex: 1
        }, {
            text: Profile.getText('oai_flag'),
            dataIndex: 'ird_characteristic.oai_flag',
            flex: 1
        }, {
            text: Profile.getText('is_cmm_flag'),
            dataIndex: 'ird_characteristic.is_cmm_flag',
            flex: 1
        }, {
            text: 'need cmm',
            dataIndex: 'ird_characteristic.need_cmm',
            flex: 1

        }];

        me.items = [{
            xtype: 'container',
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'start'
            },
            defaults: {
                margin: '5 5 5 5',
                flex: 1
            },

            items: [{
                xtype: 'grid',
                itemId: 'updated_chars',
                title: '修改后特征',
                store: Ext.create('QDT.store.IrdCharacteristics'),
                columns: charCols,
                height: 200,
                autoScroll: true,
                listeners: {
                    select: function (cmp) {

                        var charId = cmp.getSelection()[0].data.char_id;
                        console.log(charId);
                        console.log(DpIrd);
                        DpIrd.GetOriginalCharacteristicsByCharId(charId, function (result) {
                            if (result.success) {
                                var charsStore = Ext.create('Ext.data.Store', {
                                    model: 'QDT.model.IrdCharacteristic'

                                });
                                charsStore.loadRawData(result.data);
                                console.log(result.data);
                                console.log(charsStore);
                                me.down('#original_chars').reconfigure(charsStore);
                            }
                        });
                    }
                }

            }, {
                xtype: 'grid',
                itemId: 'original_chars',
                title: '被更改特征',
                store: Ext.create('QDT.store.IrdCharacteristics'),
                columns: charCols,
                height: 130,
                autoScroll: true

            }]

        }];

        me.buttons = [{
            text: Profile.getText(me.check_type),
            handler: function () {
                if (me.check_type === 'Verify') {
                    DpIrd.VerifyIrdRevision(Ext.ComponentQuery.query('irdbom')[0].ird_id, function (result) {
                        if (result.success === true) {
                            My.Msg.warning('通过校验！');
                            Ext.ComponentQuery.query('button[id=upgrade_ird]')[0].setDisabled(true);
                            Ext.ComponentQuery.query('button[id=save]')[0].setDisabled(true);
                            Ext.ComponentQuery.query('button[id=verify]')[0].setDisabled(true);
                            Ext.ComponentQuery.query('button[id=approve]')[0].setDisabled(true);
                        } else if (result.success === false) {
                            My.Msg.warning(result.errorMessage);
                        }
                        me.close();
                    });

                } else if (me.check_type === 'Approve') {
                    DpIrd.ApproveIrdRevision(Ext.ComponentQuery.query('irdbom')[0].ird_id, function (result) {
                        if (result.success === true) {
                            My.Msg.warning('批准！');
                            Ext.ComponentQuery.query('button[id=upgrade_ird]')[0].setDisabled(true);
                            Ext.ComponentQuery.query('button[id=save]')[0].setDisabled(true);
                            Ext.ComponentQuery.query('button[id=verify]')[0].setDisabled(true);
                            Ext.ComponentQuery.query('button[id=approve]')[0].setDisabled(true);
                        } else if (result.success === false) {
                            My.Msg.warning(result.errorMessage);
                        }
                        me.close();
                    });
                } else {
                    My.Msg.warning('IrdDifferenct button ' + Profile.getText(me.check_type) + 'Error');
                }

            }
        }, {
            text: Profile.getText('Reject'),
            handler: function () {
                if (me.check_type === 'Verify') {
                    DpIrd.VerifyDenyIrdRevision(Ext.ComponentQuery.query('irdbom')[0].ird_id, function (result) {
                        if (result.success === true) {
                            My.Msg.warning('未通过校验！');
                        } else if (result.success === false) {
                            My.Msg.warning(result.errorMessage);
                        }
                        me.close();
                    });

                } else if (me.check_type === 'Approve') {
                    DpIrd.ApproveDenyIrdRevision(Ext.ComponentQuery.query('irdbom')[0].ird_id, function (result) {
                        if (result.success === true) {
                            My.Msg.warning('不批准！');
                        } else if (result.success === false) {
                            My.Msg.warning(result.errorMessage);
                        }
                        me.close();
                    });
                } else {
                    My.Msg.warning('IrdDifferenct button ' + Profile.getText(me.check_type) + 'Error');
                }

            }
        }];

        me.callParent();

        me.on({
            afterrender: function (cmp) {
                DpIrd.GetModifiedCharacteristicsByIrdId(cmp.ird_id, function (result) {
                    if (result.success) {
                        if (result.data.length == 0) {
                            My.Msg.warning('此版本并无任何更新！');
                        } else {
                            var charsStore = Ext.create('Ext.data.Store', {
                                model: 'QDT.model.IrdCharacteristic'
                            });
                            charsStore.loadRawData(result.data);
                            cmp.down('#updated_chars').reconfigure(charsStore);
                        }
                    }
                });
            }
        })
    }
});