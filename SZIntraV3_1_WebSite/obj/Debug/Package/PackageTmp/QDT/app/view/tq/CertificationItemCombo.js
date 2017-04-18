Ext.define('QDT.view.tq.CertificationItemCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.tq-certificationitemcombo',
    category: '',

    initComponent: function () {
        var me = this,
            store = Ext.create('QDT.store.tq.CertificationItems');
      
        Ext.apply(me, {
            store: store,
            queryMode: 'remote',
            forceSelection: true,
            name: 'certification_item_id',
            valueField: 'certification_item_id',
            displayField: 'certification_item',
            minChars: 0,
            emptyText: Profile.getText('Search'),
            pageSize: 25
        });


        me.callParent();

          store.mon(store, {
            destroyable: true,
            beforeload: function () {
                Ext.apply(store.proxy.extraParams, {
                    category: me.category
                });
            }
        });
    }
});