Ext.define('Asz.ux.WorkTypeCombo', {
    extend: 'Asz.ux.LocalCombo',
    alias: 'widget.worktypecombo',

    initComponent: function () {
        var me = this,
            store = Ext.create('Asz.store.op.WorkTypes');

        Ext.apply(me, {
            name: 'work_type',
            valueField: 'work_type',
            displayField: 'work_type_string',
            fieldLabel: Profile.getText('work_type'),
            store: store
        });

        me.callParent();
    }
});