Ext.define('QDT.model.ird.OperationInformation', {
    extend: 'Ext.data.TreeModel',
    fields: [
    {
        name: "oper_num", mapping: 'oper_num'
    }, {
        name: "fml_mark", mapping: 'fml_mark'
    }, {
        name: "oper_char_count", mapping: 'oper_char_count'
    }, {
        name: 'oper_trans_count', mapping: 'oper_trans_count'
    }, {
        name: "insp_char_count", mapping: 'insp_char_count'
    }, {
        name: 'insp_trans_count', mapping: 'insp_trans_count'
    }, {
        name: 'is_cmm_flag', mapping: 'is_cmm_flag'
    },{
        name: 'is_cmm', convert: function (val, record) {
        
            if (record.raw['is_cmm_flag']) {
                return 'CMM';
            } else {
                return '非CMM';
            }

        }
    }]

});