Ext.define('Asz.ux.LocalCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.localcombo',
    queryMode: 'local',
    editable: false,

    //only 'true' when editable is true
    //    selectOnFocus: false, 
    forceSelection: true,

    //dafault index to select after render
    df: -1,
    initComponent: function () {
        var me = this;
        me.on('afterrender', function () {
            if (me.store.getCount() > 0 && me.df >= 0 && me.df < me.store.getCount()) {
                me.setValue(me.store.getAt(me.df).get(me.valueField));
            }
        });
        me.callParent();
    }
});