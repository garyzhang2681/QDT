Ext.define('Asz.ux.SearchCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.searchcombo',
    queryMode: 'remote',
    queryParam:'query',
    triggerAction: 'all',
    minChars: 1,
    typeAhead: true,
    autoSelect: true,
    editable: true,
    forceSelection: true,
    hideTrigger: true,
    emptyText: '',
    matchFieldWidth: false,
    minWidth: 200,
    grow: true,
    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            listConfig: {
                autoHeight: true,
                width: 255,
                loadingText: Profile.getText('LoadingText')
            }
        });

        me.callParent();
    },

    enableKeyEvents: true,


    listeners: {
        'change': function (me, newVal) {
            if (newVal === null) {
                me.reset();
            }
        }
    }
});