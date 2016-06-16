Ext.define("QDT.model.IrdCharacteristic", {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'ird_characteristic.char_id', mapping: 'ird_characteristic.char_id'
        }, {
            name: 'char_id', mapping: 'ird_characteristic.char_id'
        }, {
            name: 'ird_characteristic.ird_id', mapping: 'ird_characteristic.ird_id'
        }, {
            name: 'ird_revision', mapping: 'irdRevision.ird_revision.revision'
        }, {
            name: 'oper_num', mapping: 'ird_characteristic.oper_num'
        }, {
            name: 'ird_characteristic.oper_num', mapping: 'ird_characteristic.oper_num'
        }, {
            name: 'ird_characteristic.char_seq', mapping: 'ird_characteristic.char_seq'
        }, {
            name: 'ird_characteristic.char_num', mapping: 'ird_characteristic.char_num'
        }, {
            name: 'ird_characteristic.char_type', mapping: 'ird_characteristic.char_type'
        }, {
            name: 'ird_characteristic.blue_print_zone', mapping: 'ird_characteristic.blue_print_zone'
        }, {
            name: 'ird_characteristic.basic_gage_id', mapping: 'ird_characteristic.basic_gage_id'
        }, {
            name: 'ird_characteristic.fml_gage_id', mapping: 'ird_characteristic.fml_gage_id'
        }, {
            name: 'basic_gage', mapping: 'irdBasicGage.irdGage.gage_description_' + Profile.getLang()
        }, {
            name: 'fml_gage', mapping: 'irdFmlGage.irdGage.gage_description_' + Profile.getLang()
        }, {
            name: 'ird_characteristic.char_description', mapping: 'ird_characteristic.char_description'
        }, {
            name: 'ird_characteristic.characteristic', mapping: 'ird_characteristic.characteristic'
        }, {
            name: 'ird_characteristic.basic_rec_type', mapping: 'ird_characteristic.basic_rec_type'
        }, {
            name: 'ird_characteristic.fml_rec_type', mapping: 'ird_characteristic.fml_rec_type'
        }, {
            name: 'basic_rec_type', mapping: 'ird_characteristic.basic_rec_type'
        }, {
            name: 'fml_rec_type',  mapping: 'ird_characteristic.fml_rec_type'
        }, {
            name: 'ird_characteristic.char_maximum', mapping: 'ird_characteristic.char_maximum'
        }, {
            name: 'ird_characteristic.char_minimum', mapping: 'ird_characteristic.char_minimum'
        }, {
            name: 'ird_characteristic.gdnt_link', mapping: 'ird_characteristic.gdnt_link'
        }, {
            name: 'ird_characteristic.oai_flag', mapping: 'ird_characteristic.oai_flag'
        }, {
            name: 'ird_characteristic.oap_flag', mapping: 'ird_characteristic.oap_flag'
        }, {
            name: 'ird_characteristic.is_cmm_flag', mapping: 'ird_characteristic.is_cmm_flag'
        }, {
            name: 'ird_characteristic.need_cmm', mapping: 'ird_characteristic.need_cmm'
        }, {
            name: 'ird_characteristic.status', mapping: 'ird_characteristic.status'
        }, {
            name: 'ird_characteristic.last_char_id', mapping: 'ird_characteristic.last_char_id'
        }, {
            name: 'ird_characteristic.line_qty', mapping: 'ird_characteristic.line_qty'
        }
    ]
});