Ext.define('QDT.model.inspection.InspectionLocation', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'inspection_location_id', mapping: 'inspection_location.inspection_location_id'
    }, {
        name: 'name', mapping: 'inspection_location.name'
    }, {
        name: 'language', mapping: 'inspection_location.language'
    }]
});