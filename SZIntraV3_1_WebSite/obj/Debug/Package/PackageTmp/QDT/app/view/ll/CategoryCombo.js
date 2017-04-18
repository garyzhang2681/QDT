Ext.define('QDT.view.ll.CategoryCombo', {
    extend: 'Asz.ux.RemoteCombo',
    alias: 'widget.ll-categorycombo',
    store: 'QDT.store.ll.Categories',
    
    width: 190,
    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            displayField: 'category',
            valueField: 'category_id',
         //    labelWidth: Profile.getLang() == 'en' ? 40 : 50,
            fieldLabel: Profile.getText('category')
        });

        me.callParent();
    }
});