Ext.define('QDT.store.IrdCharacteristicTypes', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.IrdCharacteristicType',


    data: [{
        characteristic_type: 'Minor'
    }, {
        characteristic_type: 'Basic'
    }, {
        characteristic_type: 'Major'
    }]

});