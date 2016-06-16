Ext.define('QDT.view.tq.CertificationStatusCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.tq-certificationstatuscombo',
    name: 'status',
    labelWidth: 45,
    multiSelect: true,
    queryMode: 'local',
    editable: false,

    initComponent: function () {
        var me = this,
            store = Ext.getStore('QDT.store.tq.CertificationStatus', {
                autoDestroy:true
            });

        Ext.apply(me, {
            store: store,
            value: ['active'],
            fieldLabel: Profile.getText('status'),
            displayField: 'status_string',
            valueField: 'status'
        });


        me.callParent();
    }
});