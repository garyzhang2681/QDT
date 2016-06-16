Ext.define('Asz.ux.WorkingGroupCombo', {
    extend: 'Asz.ux.RemoteCombo',
    alias: 'widget.workinggroupcombo',
    store: Ext.create('Ext.data.DirectStore', {
        directFn: 'DpHr.GetWorkingGroups',
        fields: ['working_group_id', 'working_group'],
        root: 'data'
    }),
    valueField: 'working_group_id',
    displayField: 'working_group',
    name: 'working_group_id',
    labelWidth: 45,
    width: 180,

    initComponent: function () {
        var me = this;

        me.fieldLabel = Profile.getText('working_group');

        me.callParent();
    }
});