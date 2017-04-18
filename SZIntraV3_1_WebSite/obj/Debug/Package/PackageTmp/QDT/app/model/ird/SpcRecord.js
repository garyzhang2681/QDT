Ext.define('QDT.model.ird.SpcRecord', {
    extend:'Ext.data.model',
    fields: [{
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
        name: 'characteristic', mapping: 'characteristic'
    }, {
        name: 'record_date', mapping: 'record_date'
    }, {
        name: 'record_by', mapping: 'name_' + Profile.getLang()
    }, {
        name: 'rec_minimum', mapping: 'rec_minimum'
    }, {
        name: 'rec_maximum', mapping: 'rec_maximum'
    }, {
        name: 'rec_passed', mapping: 'rec_passed'
    }, {
        name: 'rec_value', mapping: 'rec_value'
    }, {
        name: 'sso', mapping: 'sso'
    }]
});