Ext.define('QDT.view.ll.CategoryManagement', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.ll-categorymanagement',
    activeRecord: {},

    initComponent: function () {
        var me = this,
            categoryGrid;
        categoryGrid = Ext.widget('grid', {
            itemId: 'category-grid',
            height: 300,
            width: 260,
            plugins: [{
                ptype: 'rowediting',
                clicksToEdit: 2,
                pluginId: 'row-edit',
                listeners: {
                    beforeedit: function (editor, context) {
                    },
                    validateedit: function (editor, context) {
                        var record = context.record;
                    },
                    canceledit: function (editor, context) {
                        me.down('#add').setDisabled(false);
                        var record = context.record,
                            store = categoryGrid.getStore();
                        if (record.data.id === 0) {
                            store.remove(record);
                        }
                    },
                    edit: function (editor, context) {
                        var record = context.record;
                        if (record.data.id === 0) {
                            DpLl.CreateCategory(record.data, function (result) {
                                me.onCategoryModified(result, record, true);
                            });
                        } else {
                            DpLl.UpdateCategory(record.data, function (result) {
                                me.onCategoryModified(result, record, true);
                            });

                        }
                    }
                }
            }],
            store: Ext.create('QDT.store.ll.Categories', {
                autoDestroy: true,
                autoLoad: true
            }),
            columns: [{
                dataIndex: 'id', text: 'ID', width: 80
            }, {
                dataIndex: 'category', text: Profile.getText('category'), minWidth: 150, flex: 1, editor: {
                    itemId: 'category-editor',
                    xtype: 'textfield',
                    allowBlank: false
                }
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                defaults: {
                    scope: me
                },
                items: [{
                    iconCls: 'add',
                    itemId: 'add',
                    handler: me.addCategory
                }, {
                    iconCls: 'delete',
                    itemId: 'delete',
                    handler: me.deleteCategory,
                    disabled: true
                }, '->', {
                    iconCls: 'refresh',
                    itemId: 'refresh',
                    handler: function () {
                        categoryGrid.getStore().load();
                    }
                }]
            }]
        });

        Ext.apply(me, {
            title: Profile.getText('CategoryManagement'),
            frame: true,
            layout: 'auto',
            items: [
                categoryGrid
            ]
        });

        me.callParent();

        categoryGrid.on({
            selectionChange: me.onSelectionChange,
            scope: me
        });
    },

    getRowEditing: function () {
        var me = this;
        return me.down('#category-grid').getPlugin('row-edit');
    },

    startEditing: function (record, index) {
        var me = this,
            editor = me.getRowEditing();
        editor.startEdit(record, index);
        //TODO:select text
        //        Ext.defer(editor.editor.getComponent('category-editor').selectText, 200);
    },

    addCategory: function () {
        var me = this,
            editor = me.getRowEditing(),
            store = me.down('#category-grid').getStore(),
            record = Ext.create('QDT.model.ll.Category', {
                id: 0,
                category: Profile.getText('txtNewCategory')
            });
        editor.cancelEdit();
//        if (store.count() > 0 && store.getAt(0).data.id === 0) {
//            store.removeAt(0);
        //        }
        me.down('#add').setDisabled(false);
        store.insert(0, record);
        me.startEditing(record, 0);
    },

    deleteCategory: function () {
        var me = this,
            record = me.activeRecord;
        if (record.data.id === 0) {
            me.down('#category-grid').getStore().remove(record);
        } else {
            Ext.Msg.confirm(Profile.getText('Confirm'), Profile.getText('txtConfirmDelete'), function (btn) {
                if (btn === 'yes') {
                    DpLl.DeleteCategory(record.data.id, function (result) {
                        me.onCategoryModified(result, record, false);
                    });
                }
            });
        }
    },

    onCategoryModified: function (result, record, reeditOnFailure) {
        var me = this,
            store = me.down('#category-grid').getStore();
        if (result.success) {
            store.load();
        } else {
            if (reeditOnFailure) {
                me.startEditing(record, 0);
            }
            Ext.Msg.alert(Profile.getText('Error'), result.errorMessage);
        }
    },

    onSelectionChange: function (selModel, selected) {
        var me = this;
        me.activeRecord = selected[0] || {};
        me.down('#delete').setDisabled(selected.length === 0);
    }
});