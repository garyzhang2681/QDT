Ext.define('QDT.model.inspection.InspectionType', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'name', mapping: 'inspection_type.name'
    }, {
        name: 'category', mapping: 'inspection_type.category'
    }, {
        name: 'inspection_type_id', mapping: 'inspection_type.inspection_type_id'
    }, {
        name: 'language', mapping: 'inspection_type.language'
    }]
});