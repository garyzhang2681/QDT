Ext.define('Asz.ux.SerialLotCombo', {
    extend: 'Asz.ux.SearchCombo',
    alias: 'widget.seriallotcombo',
    name: 'serial_lot',
    store: 'Asz.store.util.SerialsLots',
    displayField: 'serial_lot',
    valueField: 'serial_lot',
    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            fieldLabel: Profile.getText('serial_lot')
        });

        me.callParent();
    }
});