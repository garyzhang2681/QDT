Ext.define('QDT.model.IrdGage', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'gage_id', mapping: 'irdGage.gage_id'
    }, {
        name: 'gage_description_en', mapping: 'irdGage.gage_description_en'
    }, {
        name: 'gage_description_cn', mapping: 'irdGage.gage_description_cn'
    }]
});