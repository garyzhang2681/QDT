Ext.define("QDT.model.User", {
    extend: 'Ext.data.Model',
    fields: [
    { name: 'sso', mapping: 'db_entry.sso' },
    { name: 'name', mapping: 'db_entry.name_' + Profile.getLang() },
    { name: 'user_id', mapping: 'db_entry.user_id' }
   ]
});