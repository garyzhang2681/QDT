Ext.define('Asz.ux.RadioGroupColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.radiogroupcolumn',


    defaultRenderer: function (value, metadata, record, rowIndex, colIndex, store, view) {
        var column = view.getGridColumns()[colIndex];
       
        var html = '';
        if (column.radioValues) {
            var group = Ext.widget('radiogroup');
            column.add(group);
         //   group.add([{ text: 'Button 1' }, { text: 'Button 2'}]);
            for (var x in column.radioValues) {
                var radioValue = column.radioValues[x], radioDisplay;
                if (radioValue && radioValue.fieldValue) {
                    radioDisplay = radioValue.fieldDisplay;
                    radioValue = radioValue.fieldValue;
                } else {
                    radioDisplay = radioValue;
                }
                if (radioValue == value) {
                    html = html + column.getHtmlData(record.internalId, store.storeId, rowIndex, radioValue, radioDisplay, 'checked');
                } else {
                    html = html + column.getHtmlData(record.internalId, store.storeId, rowIndex, radioValue, radioDisplay);
                }
            }
        }
        return group;
    },

    getHtmlData: function (recordId, storeId, rowIndex, value, display, optional) {
        var me = this, clickHandler, readOnly;
        var name = storeId + '_' + recordId;
        if (me.readOnly) {
            readOnly = 'readonly';
            onClick = '';
        } else {
            readOnly = '';
            onClick = "onclick=\"this.checked=true;Ext.StoreManager.lookup('" + storeId + "').getAt(" + rowIndex + ").set('" + me.dataIndex + "', '" + value + "');\"'";
        }
        return ' ' + display + ' ';
    }
});