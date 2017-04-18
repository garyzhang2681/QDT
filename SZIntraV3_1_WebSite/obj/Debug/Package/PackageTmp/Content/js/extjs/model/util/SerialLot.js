Ext.define('Asz.model.util.SerialLot', {
    extend: 'Ext.data.Model',
    fields: [
    { name: 'serial_lot', mapping: 'serial_lot' },
  { name: 'item', mapping: 'item' }
   ],
    idProperty: 'serial_lot'
});