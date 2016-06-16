Ext.define('QDT.store.IrdBluePrintZones', {
    extend: 'Ext.data.Store',
    model: 'QDT.model.IrdBluePrintZone',

    data: [{
        blue_print_zone: 'I/P'
    }, {
        blue_print_zone: 'D5'
    }, {
        blue_print_zone: 'B2'
    }]
});