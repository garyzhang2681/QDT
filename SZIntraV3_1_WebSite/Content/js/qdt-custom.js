//prevent window title overflow into browser page header
Ext.override(Ext.window.Window, {
    constrainHeader: true
});

Ext.override(Ext.grid.Panel, {
    columnLines: true,
    viewConfig: {
        enableTextSelection: true
    },
    getFirstSelected: function () {
        var rec = {};
        var recs = this.selModel.selected;
        if (this.selType === 'rowmodel' && this.selModel.mode === 'SINGLE' && recs.length === 1) {
            return recs.first();
        } else {
            return null;
        }
    }
});

Ext.override(Ext.form.field.Checkbox, {
    uncheckedValue: 'off'
});

Ext.override(Ext.form.field.Date, {
    format: 'Y-m-d',
    editable: false
});


Ext.override(Ext.grid.column.Column, {
    autoText: false,
    block: false,
    initComponent: function () {
        var me = this;
        me.text = me.autoText ? Profile.getText(me.dataIndex) : me.text;
        me.sortable = !me.block;
        me.menuDisabled = me.block;
        me.callParent();
    }
});