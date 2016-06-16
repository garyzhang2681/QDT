Ext.define('QDT.model.Item', {
    extend: 'Ext.data.Model',
    fields: [
    { name: 'item', mapping: 'item' },
    { name: 'FGorRW', mapping: 'FGorRW' }, //FGorRM
    { name: 'serialOrLot', mapping: 'serialOrLot' }
   ]
});