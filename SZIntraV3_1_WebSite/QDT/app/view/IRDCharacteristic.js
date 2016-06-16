Ext.define('QDT.view.IRDCharacteristic', {
    extend: 'Ext.window.Window',
    alias: 'widget.irdcharacteristic',
    title: Profile.getText('EditCharacteristic'),
    width: 800,
    height: 400,
    modal: true,
    // isUpgrade: true, //表示目前的状态是否是升版，如果是false，那么就是直接在数据中进行udpate，如果是true，那么就要在record_type为draft的记录update or insert
    isCreate: true,  // 表示这个window下的form提交是update还是insert
    ird_id: '',
    layout: {
        type: 'fit'
    },

    initComponent: function () {
        var me = this;
        var irdCharacteristicForm = Ext.widget('form', {
            frame: false,
            border: false,
            id: 'irdcharacteristicForm',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            api: me.isCreate === true ? { submit: DpIrd.CreateCharacteristic } : { submit: DpIrd.UpdateCharacteristic },
            defaults: {
                margin: '10 5 10 5'
            },
            items: [
            {
                xtype: 'container',
                //  layout: 'vbox',
                flex: 1,
                defaults: {
                    xtype: 'textfield',
                    margin: '5 5 5 5'
                },
                items: [
                    {
                        fieldLabel: Profile.getText('char_seq'),
                        name: 'ird_characteristic.char_seq'
                    }, {
                        fieldLabel: Profile.getText('char_num'),
                        name: 'ird_characteristic.char_num'
                        //   value: '233.5'
                    }, {
                        xtype: 'combobox',
                        store: Ext.create('QDT.store.IrdCharacteristicTypes'),
                        fieldLabel: Profile.getText('char_type'),
                        name: 'ird_characteristic.char_type',
                        queryMode: 'local',
                        displayField: 'characteristic_type',
                        valueField: 'characteristic_type',
                        editable: false
                    }, {
                        xtype: 'searchcombo',
                        name: 'basic_gage',
                        id: 'basic_gage',
                        fieldLabel: Profile.getText('basic_gage'),
                        store: Ext.create('QDT.store.IrdGages'),
                        displayField: 'gage_description_' + Profile.getLang(),
                        valueField: 'gage_id',
                        pageSize: 10
                    }, {
                        xtype: 'searchcombo',
                        name: 'fml_gage',
                        id: 'fml_gage',
                        fieldLabel: Profile.getText('fml_gage'),
                        store: Ext.create('QDT.store.IrdGages'),
                        displayField: 'gage_description_' + Profile.getLang(),
                        valueField: 'gage_id',
                        pageSize: 10
                    }, {
                        fieldLabel: Profile.getText('char_description'),
                        name: 'ird_characteristic.char_description'

                    }, {
                        xtype: 'htmleditor',
                        id: 'char',
                        fieldLabel: Profile.getText('characteristic'),
                        fontFamilies: [
                            'GDT', 'Arial', 'Tahoma', 'Times New Roman', 'Verdana'
                        ],
                        enableAlignments: false,
                        enableColors: false,
                        enableFormat: false,
                        enableLinks: false,
                        enableLists: false,
                        enableSourceEdit: false,
                        name: 'ird_characteristic.char',
                        height: 130
                    }
                ]
            }, {
                xtype: 'container',
                //   layout: 'vbox',
                flex: 1,
                defaults: {
                    xtype: 'textfield',
                    margin: '5 5 5 5'
                },
                items: [
                    {
                        xtype: 'combobox',
                        name: 'basic_rec_type',
                        fieldLabel:Profile.getText('basic_rec_type'), 
                        name: 'basic_rec_type',
                        store: Ext.create('QDT.store.IrdRecordTypes'),
                        displayField: 'record_type',
                        valueField: 'record_type',
                        queryMode: 'local',
                        editable: false
                    }, {
                        xtype: 'combobox',
                        name: 'fml_rec_type',
                        fieldLabel: Profile.getText('fml_rec_type'),
                        store: Ext.create('QDT.store.IrdRecordTypes'),
                        displayField: 'record_type',
                        valueField: 'record_type',
                        queryMode: 'local',
                        editable: false
                    }, {
                        fieldLabel: Profile.getText('char_maximum'),
                        name: 'ird_characteristic.char_maximum',
                        disabled: true
                    }, {
                        fieldLabel: Profile.getText('char_minimum'),
                        name: 'ird_characteristic.char_minimum',
                        disabled: true
                    }, {
                        xtype: 'combobox',
                        fieldLabel: Profile.getText('blue_print_zone'),
                        name: 'ird_characteristic.blue_print_zone',
                        store: Ext.create('QDT.store.IrdBluePrintZones'),
                        displayField: 'blue_print_zone',
                        valueField: 'blue_print_zone',
                        queryMode: 'local',
                        editable: false
                    }, 
                    //                {
                    //                    fieldLabel: 'gdnt_link',
                    //                    name: 'gdnt_link',
                    //                    value: 'path'
                    //                }, 
                    {
                        xtype: 'combobox',
                        fieldLabel: Profile.getText('oai_flag'),
                        name: 'ird_characteristic.oai_flag',
                        store: Ext.create('QDT.store.Bools'),
                        displayField: 'name',
                        valueField: 'value',
                        queryMode: 'local',
                        editable: false
                    }, {
                        xtype: 'combobox',
                        fieldLabel: Profile.getText('oap_flag'),
                        name: 'ird_characteristic.oap_flag',
                        store: Ext.create('QDT.store.Bools'),
                        displayField: 'name',
                        valueField: 'value',
                        queryMode: 'local',
                        editable: false
                    }, {
                        xtype: 'combobox',
                        fieldLabel: Profile.getText('is_cmm_flag'),
                        name: 'ird_characteristic.is_cmm_flag',
                        store: Ext.create('QDT.store.Bools'),
                        displayField: 'name',
                        valueField: 'value',
                        queryMode: 'local',
                        editable: false
                    }, {
                        xtype: 'combobox',
                        fieldLabel: 'need_cmm', // TODO: language
                        name: 'ird_characteristic.need_cmm',
                        store: Ext.create('QDT.store.Bools'),
                        displayField: 'name',
                        valueField: 'value',
                        queryMode: 'local',
                        editable: false
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: Profile.getText('quantity'),
                        name: 'ird_characteristic.line_qty',
                        minValue: 1,
                        value:1,
                allowDecimals:false
            }, {
                xtype: 'hiddenfield',
                name: 'is_create',
                value: me.isCreate
            },
            //                {
            //                    xtype: 'hiddenfield',
            //                    name: 'is_upgrade',
            //                    value: me.isUpgrade
            //                },
                 {
                 xtype: 'hiddenfield',
                 name: 'ird_characteristic.char_id'
             }, {
                 xtype: 'hiddenfield',
                 name: 'ird_characteristic.ird_id',
                 value: me.ird_id
             }, {
                 xtype: 'hiddenfield',
                 name: 'ird_characteristic.oper_num',
                 value: Ext.ComponentQuery.query('form[id=irdOperationInfoForm]')[0].getValues()['oper_num']
             }]
        }]
    });


    //        cq.query('combobox[name=char_Type]')[0].setValue('Minor');
    //        cq.query('combobox[name=blue_print_zone]')[0].setValue('B2');
    //        cq.query('combobox[name=basic_rec_type]')[0].setValue('value');
    //        cq.query('combobox[name=fml_rec_type]')[0].setValue('value');
    //        cq.query('combobox[name=oai_flag]')[0].setValue('0');
    //        cq.query('combobox[name=oap_flag]')[0].setValue('1');
    //        cq.query('combobox[name=is_cmm_flag]')[0].setValue('1');
    //        cq.query('combobox[name=need_cmm]')[0].setValue('1');



    me.items = [irdCharacteristicForm];

    me.buttons = [{
        iconCls: 'submit',
        text: Profile.getText('Submit'),
        handler: function (btn) {
            irdCharacteristicForm.getForm().submit({
                waitMsg: '',
                success: function (form, action) {
                    if (action.result.success === true) {
                        console.log(action);
                        me.close();
                        //TODO: reload 编辑工序页面的grid
                        cq.query('grid[name=irdBOMCharacteristicGrid]')[0].store.reload({
                            params: { ird_id: action.result.ird_characteristic.ird_id,
                                oper_num: action.result.ird_characteristic.oper_num
                                //     isUpgrade: me.isUpgrade
                            }
                        });
                    }
                },
                failure: function (form, action) {
                    Ext.Msg.alert(Profile.getText('Error'), action.result.errorMessage);
                }
            });
        }

    }];

    me.callParent();
}
});