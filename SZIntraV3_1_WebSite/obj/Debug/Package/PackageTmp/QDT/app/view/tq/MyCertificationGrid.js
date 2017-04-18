Ext.define('QDT.view.tq.MyCertificationGrid', {
    extend: 'QDT.view.tq.CertificationBaseGrid',
    alias: 'widget.tq-mycertificationgrid',
    requires: [
        'QDT.view.tq.CertificationStatusCombo'
    ],

    initComponent: function () {
        var me = this,
            tbar;

        me.employeeId = QDT.util.Util.getCurrentUserEmployeeId();

        me.callParent();

        tbar = {
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'checkbox',
                name: 'filter_status',
                boxLabel: Profile.getText('FilterStatus')
            }, {
                xtype: 'tbtext',
                text: ': '
            }, {
                xtype: 'tq-certificationstatuscombo',
                hideLabel: true,
                disabled: true
            }, '->', {
                xtype: 'searchfield',
                emptyText: Profile.getText('Search'),
                store: me.store,
                width: 200
            }]
        };

        me.addDocked(tbar);
    }
});