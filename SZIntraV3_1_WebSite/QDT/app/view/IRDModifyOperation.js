Ext.define('QDT.view.IRDModifyOperation', {
    extend: 'Ext.window.Window',
    alias: 'widget.irdmodifyoperation',
    title: Profile.getText('IrdModifyOperatoin'),
    width: 1000,
    height: 600,
    modal: true,
    //  isUpgrade: true,
    canEdit: false,
    ird_id: '',
    layout: {
        type: 'border'
    },

    initComponent: function () {
        var me = this;
        var irdOperationInfoForm = Ext.widget('form', {
            id: 'irdOperationInfoForm',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'container',
                layout: 'hbox',
                defaultType: 'displayfield',
                defaults: {
                    submitValue: true,
                    margin: '5 10 5 10',
                    flex: 1
                }
            },
            items: [{
                items: [{
                    fieldLabel: Profile.getText('oper_num'),
                    name: 'oper_num'
                }, {
                    fieldLabel: Profile.getText('irdId'),
                    name: 'ird_id'
                }, {
                    fieldLabel: Profile.getText('Uf_item_aircraft_type'),
                    name: 'Uf_item_aircraft_type'
                }]
            }, {

                items: [{
                    fieldLabel: Profile.getText('description'),
                    name: 'description'
                }, {
                    fieldLabel: Profile.getText('Uf_item_ge_project'),
                    name: 'Uf_item_ge_project'
                }]
            }, {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack: 'end',
                    align: 'middle'
                },
                defaults: {
                    margin: '5 5 10 5'
                },
                items: [{
                    xtype: 'button',
                    text: Profile.getText('AddCharacteristic'),  //TODO: language  depends on current status
                    id: 'addcharacteristic'
                }]
            }]
        });


        var irdBOMCharacteristicGrid = Ext.widget('grid', {
            name: 'irdBOMCharacteristicGrid',
            store: Ext.create('QDT.store.IrdOpeartionCharacteristics'),
            width: 985,
            height: 460,
            requires: [
                    'Ext.grid.plugin.CellEditing',
                    'Ext.form.field.Text',
                    'Ext.toolbar.TextItem'
                ],
            columns: [{
                header: Profile.getText('Edit'),
                xtype: 'actioncolumn',
                width: 50,
                items: [{
                    xtype: 'button',
                    getClass: function (v, meta, rec) {
                        return 'edit';
                    },
                    handler: function (grid, rowIndex, colIndex) {
                        if (me.canEdit === true) {

                            var record = grid.getStore().getAt(rowIndex);
                            var irdcharacteristic = Ext.create('QDT.view.IRDCharacteristic', {
                                // isUpgrade: me.isUpgrade,
                                isCreate: false,
                                ird_id: me.ird_id
                            });

                            irdcharacteristic.down('form').loadRecord(record);
                            var basic_gage = Ext.ModelManager.create({
                                gage_id: record.raw.irdBasicGage.irdGage.gage_id,
                                gage_description_en: record.raw.irdBasicGage.irdGage.gage_description_en,
                                gage_description_cn: record.raw.irdBasicGage.irdGage.gage_description_cn
                            }, 'QDT.model.IrdGage');

                            var fml_gage = Ext.ModelManager.create({
                                gage_id: record.raw.irdFmlGage.irdGage.gage_id,
                                gage_description_en: record.raw.irdFmlGage.irdGage.gage_description_en,
                                gage_description_cn: record.raw.irdFmlGage.irdGage.gage_description_cn
                            }, 'QDT.model.IrdGage');


                            irdcharacteristic.down('form').down('searchcombo[id=basic_gage]').setValue(basic_gage);
                            irdcharacteristic.down('form').down('searchcombo[id=fml_gage]').setValue(fml_gage);


                            // irdcharacteristic.down('form').down('ckeditor[id=char]').setValue('sssss');
                            //在show之前设置值，设置不成功，可能是因为ckeditor还没有设置成功
                            irdcharacteristic.show();
                            irdcharacteristic.down('form').down('htmleditor[id=char]').setValue(record.raw.ird_characteristic.characteristic);


                        }
                        else {
                            My.Msg.warning('Some one is editing! Please do not edit!');
                        }
                    }
                }]
            }, {
                text: Profile.getText('char_seq'),
                dataIndex: 'ird_characteristic.char_seq',
                flex: 1,
                editor: new Ext.form.field.Text({
                    allowBlank: false
                })
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
                width: 30,
                hidden: true
            }, {
                text: Profile.getText('char_maximum'),
                dataIndex: 'ird_characteristic.char_maximum',
                //  renderer: inspectorTemplateRenderer,
                width: 30,
                hidden: true
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
                flex: 1,
                hidden: true
            }]
        });

        me.items = [{
            region: 'north',
            split: true,
            items: [irdOperationInfoForm]
        }, {
            region: 'center',
            items: [irdBOMCharacteristicGrid]
        }];

        me.callParent();
    }
});