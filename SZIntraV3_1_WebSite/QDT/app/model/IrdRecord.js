
Ext.define('QDT.model.IrdRecord', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'ird_route_id', mapping: 'ird_route_id'
    }, {
        name: 'serial', mapping: 'serial'
    }, {
        name: 'job', mapping: 'job'
    }, {
        name: 'suffix', mapping: 'suffix'
    }, {
        name: 'item', mapping: 'item'
    }, {
        name: 'oper_num', mapping: 'oper_num'
    }, {
        name: 'char_seq', mapping: 'char_seq'
    }, {
        name: 'char_num', mapping: 'char_num'
    }, {
        name: 'char_type', mapping: 'char_type'
    }, {
        name: 'blue_print_zone', mapping: 'blue_print_zone'
    }, {
        name: 'basic_gage_id', mapping: 'basic_gage_id'
    }, {
        name: 'fml_gage_id', mapping: 'fml_gage_id'
    }, {
        name: 'char_description', mapping: 'char_description'
    }, { name: 'char_fml', convert: function (val, record) {

        var characteristic = '';
        if (record.data['characteristic'] != null) {
            characteristic = record.data['characteristic'] + '    ';
        }

        if (record.data['char_minimum'] != null && record.data['char_maximum'] != null) {
            characteristic = characteristic + record.data['char_minimum'] + ' - ' + record.data['char_maximum'];
        } else if (record.data['char_minimum'] == null && record.data['char_maximum'] != null) {
            characteristic = characteristic + '<' + record.data['char_maximum'];
        } else if (record.data['char_minimum'] != null && record.data['char_maximum'] == null) {
            characteristic = characteristic + '>' + record.data['char_minimum'];
        } else {
            characteristic = 'N/A';
        }
        return characteristic;



        //        if (record.data['fml_rec_type'] == 'range') {
        //            if (record.data['characteristic'] != null && record.data['char_minimum'] != null && record.data['char_maximum'] != null) {
        //                return record.data['characteristic'] + '    ' + record.data['char_minimum'] + ' - ' + record.data['char_maximum'];
        //            }else if(record.data['characteristic'] == null && record.data['char_minimum'] != null && record.data['char_maximum'] != null){
        //                return record.data['char_minimum'] + ' - ' + record.data['char_maximum'];
        //            } else if (record.data['characteristic'] != null && record.data['char_minimum'] == null && record.data['char_maximum'] == null) {
        //                return record.data['char_minimum'];
        //            } else if (record.data['characteristic'] == null && record.data['char_minimum'] == null && record.data['char_maximum'] == null) {
        //                return 'N/A';
        //            }
        //        } else if (record.data['fml_rec_type'] == 'value') {
        //            return record.data['characteristic'];
        //        } else if (record.data['fml_rec_type'] == 'pass') {
        //            return record.data['characteristic'];
        //        }
    }
    }, { name: 'char_others', convert: function (val, record) {

        var characteristic = '';
        if (record.data['characteristic'] != null) {
            characteristic = characteristic + record.data['characteristic'] + ' ';
        }

        if (record.data['char_minimum'] != null && record.data['char_maximum'] != null) {
            characteristic = characteristic + record.data['char_minimum'] + ' - ' + record.data['char_maximum'];
        } else if (record.data['char_minimum'] == null && record.data['char_maximum'] != null) {
            characteristic = characteristic + '<' + record.data['char_maximum'];
        } else if (record.data['char_minimum'] != null && record.data['char_maximum'] == null) {
            characteristic = characteristic + '>' + record.data['char_minimum'];
        } else {
            characteristic = 'N/A';
        }
        return characteristic;
    }
    }, {
        name: 'characteristic', mapping: 'characteristic'
    }, {
        name: 'basic_rec_type', mapping: 'basic_rec_type'
    }, {
        name: 'fml_rec_type', mapping: 'fml_rec_type'
    }, {
        name: 'char_maximum', mapping: 'char_maximum'
    }, {
        name: 'char_minimum', mapping: 'char_minimum'
    }, {
        name: 'gdnt_link', mapping: 'gdnt_link'
    }, {
        name: 'oai_flag', mapping: 'oai_flag'
    }, {
        name: 'oap_flag', mapping: 'oap_flag'
    }, {
        name: 'is_cmm_flag', mapping: 'is_cmm_flag'
    }, {
        name: 'need_cmm', mapping: 'need_cmm'
    }, {
        name: 'line_qty', mapping: 'line_qty'
    }, {
        name: 'fml_mark', mapping: 'fml_mark'
    }, {
        name: 'create_date', mapping: 'create_date'
    }, {
        name: 'create_by', mapping: 'create_by'
    }, {
        name: 'ird_id', mapping: 'ird_id'
    }, {
        name: 'char_id', mapping: 'char_id'
    }, {
        name: 'operator_trans_num', mapping: 'operator_trans_num'
    }, {
        name: 'operator_trans_id_route_id', mapping: 'operator_trans_id_route_id'
    }, {
        name: 'operator_inspect_type', mapping: 'operator_inspect_type'
    }, {
        name: 'operator_trans_char_id', mapping: 'operator_trans_char_id'
    }, {
        name: 'operator_user_id', mapping: 'operator_user_id'
    }, {
        name: 'operator_name', mapping: 'operator_name_' + Profile.getLang()
    }, {
        name: 'operator_sso', mapping: 'operator_sso'
    }, {
        name: 'operator_record_date', mapping: 'operator_record_date'
    }, {
        name: 'operator_rec_maximum', mapping: 'operator_rec_maximum'
    }, {
        name: 'operator_rec_minimum', mapping: 'operator_rec_minimum'
    }, {
        name: 'operator_rec_value', mapping: 'operator_rec_value'
    }, {
        name: 'operator_rec_passed', mapping: 'operator_rec_passed'
    }, {
        name: 'inspector_trans_num', mapping: 'inspector_trans_num'
    }, {
        name: 'inspector_trans_id_route_id', mapping: 'inspector_trans_id_route_id'
    }, {
        name: 'inspector_inspect_type', mapping: 'inspector_inspect_type'
    }, {
        name: 'inspector_trans_char_id', mapping: 'inspector_trans_char_id'
    }, {
        name: 'inspector_user_id', mapping: 'inspector_user_id'
    }, {
        name: 'inspector_name', mapping: 'inspector_name_' + Profile.getLang()
    }, {
        name: 'inspector_sso', mapping: 'inspector_sso'
    }, {
        name: 'inspector_record_date', mapping: 'inspector_record_date'
    }, {
        name: 'inspector_rec_maximum', mapping: 'inspector_rec_maximum'
    }, {
        name: 'inspector_rec_minimum', mapping: 'inspector_rec_minimum'
    }, {
        name: 'inspector_rec_value', mapping: 'inspector_rec_value'
    }, {
        name: 'inspector_rec_passed', mapping: 'inspector_rec_passed'
    }, {
        name: 'basic_gage', mapping: 'basic_gage_' + Profile.getLang()
    }, {
        name: 'fml_gage', mapping: 'fml_gage_' + Profile.getLang()
    }]
});