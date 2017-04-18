Ext.define('QDT.model.IrdRoute', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'ird_route_id', mapping: 'ird_route.ird_route_id'
    }, {
        name: 'ird_route.ird_route_id', mapping: 'ird_route.ird_route_id'
    }, {
        name: 'ird_route.serial', mapping: 'ird_route.serial'
    }, {
        name: 'ird_route.job', mapping: 'ird_route.job'
    }, {
        name: 'ird_route.suffix', mapping: 'ird_route.suffix'
    }, {
        name: 'ird_route.item', mapping: 'ird_route.item'
    }, {
        name: 'ird_route.op_num', mapping: 'ird_route.op_num'
    }, {
        name: 'ird_route.characteristic', mapping: 'ird_route.characteristic'
    }, {
        name: 'ird_route.char_seq', mapping: 'ird_route.char_seq'
    }, {
        name: 'ird_route.char_num', mapping: 'ird_route.char_num'
    }, {
        name: 'ird_route.char_type', mapping: 'ird_route.char_type'
    }, {
        name: 'ird_route.blue_print_zone', mapping: 'ird_route.blue_print_zone'
    }, {
        name: 'ird_route.basic_rec_type', mapping: 'ird_route.basic_rec_type'
    }, {
        name: 'ird_route.fml_rec_type', mapping: 'ird_route.fml_rec_type'
    }, {
        name: 'basic_rec_type', mapping: 'ird_characteristic.basic_rec_type'
    }, {
        name: 'fml_rec_type', mapping: 'ird_characteristic.fml_rec_type'
    }, {
        name: 'basic_gage', mapping: 'basicGage.irdGage.gage_description_' + Profile.getLang()
    }, {
        name: 'fml_gage', mapping: 'fmlGage.irdGage.gage_description_' + Profile.getLang()
    }, {
        name: 'ird_route.basic_gage_id', mapping: 'ird_route.basic_gage_id'
    }, {
        name: 'ird_route.fml_gage_id', mapping: 'ird_route.fml_gage_id'
    }, {
        name: 'ird_route.char_description', mapping: 'ird_route.char_description'
    }, {
        name: 'ird_route.char', mapping: 'ird_route.char'
    }, {
        name: 'ird_route.rec_type', mapping: 'ird_route.rec_type'
    }, {
        name: 'ird_route.char_max', mapping: 'ird_route.char_max'
    }, {
        name: 'ird_route.char_min', mapping: 'ird_route.char_min'
    }, {
        name: 'ird_route.gdnt_link', mapping: 'ird_route.gdnt_link'
    }, {
        name: 'ird_route.fml_flag', mapping: 'ird_route.fml_flag'
    }, {
        name: 'ird_route.oap_flag', mapping: 'ird_route.oap_flag'
    }, {
        name: 'ird_route.cmm_flag', mapping: 'ird_route.cmm_flag'
    }, {
        name: 'ird_route.line_qty', mapping: 'ird_route.line_qty'
    }, {
        name: 'ird_route.create_date', mapping: 'ird_route.create_date'
    }, {
        name: 'ird_route.create_by', mapping: 'ird_route.create_by'
    }, {
        name: 'ird_route.ird_id', mapping: 'ird_route.ird_id'
    }, {
        name: 'ird_route.char_id', mapping: 'ird_route.char_id'
    }]
});