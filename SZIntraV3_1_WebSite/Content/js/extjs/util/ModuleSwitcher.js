//Used in app.js, use callback function to replace current component in center panel with new widget
//TODO: delete console.log
Ext.define('Asz.util.ModuleSwitcher', {
    show: function (xtype, callback) {
//        alert(xtype);
//        console.log('Creating ' + xtype);
        var cmp = Ext.widget(xtype);
        callback(cmp);
    }
});