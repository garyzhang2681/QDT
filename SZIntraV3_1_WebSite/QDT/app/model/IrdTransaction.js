Ext.define('Qdt.model.IrdTransaction', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'ird_transaction.trans_num', mapping: 'ird_transaction.trans_num'
    }, {
        name: 'ird_transaction.ird_route_id', mapping: 'ird_transaction.ird_route_id'
    }, {
        name: 'ird_transaction.inspect_type', mapping: 'ird_transaction.inspect_type'
    }, {
        name: 'ird_transaction.char_id', mapping: 'ird_transaction.char_id'
    }, {
        name: 'ird_transaction.user_id', mapping: 'ird_transaction.user_id'
    }, {
        name: 'ird_transaction.record_date', mapping: 'ird_transaction.record_date'
    }, {
        name: 'ird_transaction.rec_max', mapping: 'ird_transaction.rec_max'
    }, {
        name: 'ird_transaction.rec_min', mapping: 'ird_transaction.rec_min'
    }, {
        name: 'ird_transaction.rec_value', mapping: 'ird_transaction.rec_value'
    }, {
        name: 'ird_transaction.rec_value', mapping: 'ird_transaction.rec_value'
    } ]
});