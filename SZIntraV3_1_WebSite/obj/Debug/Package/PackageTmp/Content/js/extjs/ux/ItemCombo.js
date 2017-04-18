Ext.define('Asz.ux.ItemCombo', {
    extend: 'Asz.ux.SearchCombo',
    alias: 'widget.itemcombo',
    name: 'item',
    store: 'Asz.store.util.Items',
    displayField: 'item',
    valueField: 'item',
    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            fieldLabel: Profile.getText('item')
        });

        me.callParent();
    }
});