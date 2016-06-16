Ext.define("QDT.model.IrdOperation", {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'ird_id', mapping: 'ird_id'
    }, {
        name: 'item', mapping: 'item'
    }, {
        name: 'oper_num', mapping: 'oper_num'
    }, {
        name: 'plan_code', mapping: 'plan_code'
    }, {
        name: 'family_code', mapping: 'family_code'
    }, {
        name: 'description', mapping: 'description'
    }, {
        name: 'Uf_item_aircraft_type', mapping: 'Uf_item_aircraft_type'
    }, {
        name: 'Uf_item_ge_project', mapping: 'Uf_item_ge_project'
    }]
});
