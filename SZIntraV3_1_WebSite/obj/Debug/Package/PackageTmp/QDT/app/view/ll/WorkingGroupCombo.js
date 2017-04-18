Ext.define('QDT.view.ll.WorkingGroupCombo', {
    extend: 'Asz.ux.RemoteCombo',
    alias: 'widget.ll-workinggroupcombo',
    store: 'QDT.store.ll.WorkingGroups',
    displayField: 'working_group',
    valueField: 'working_group_id',
    labelWidth: Profile.getLang() == 'en' ? 30 : 40,
    width: 200,
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            fieldLabel: Profile.getText('working_group')
        });
        me.callParent();
    }
});